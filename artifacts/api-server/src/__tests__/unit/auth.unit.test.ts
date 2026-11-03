import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";

vi.mock("@workspace/db", () => import("./dbStub.js"));
vi.mock("drizzle-orm", () => ({ eq: () => ({}) }));

/**
 * Mock de bcryptjs.
 * Por qué se aísla: el sistema usa bcrypt con factor de costo 12, que tarda
 * cientos de milisegundos por llamada. En una prueba unitaria no nos interesa
 * el algoritmo de cifrado (es una librería de terceros), sino qué hace la ruta
 * cuando la contraseña coincide o no. El mock vuelve la prueba rápida y nos deja
 * decidir el resultado de compare() en cada caso.
 */
vi.mock("bcryptjs", () => ({
  default: {
    hash: vi.fn(async (p: string) => `hash(${p})`),
    compare: vi.fn(async () => true),
  },
}));

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import authRouter from "../../routes/auth.js";
import { enqueue, resetDb, calls } from "./dbStub.js";
import { buildApp, clientToken, bearer, user } from "./app.js";

const app = buildApp(authRouter);
const compare = vi.mocked(bcrypt.compare);

beforeEach(() => {
  resetDb();
  compare.mockReset();
  compare.mockResolvedValue(true as never);
});

describe("POST /api/auth/login", () => {
  it("devuelve un JWT que expira en 24 horas y no expone el hash", async () => {
    enqueue("users", [user()]);
    const res = await request(app).post("/api/auth/login").send({ email: "maria@example.com", password: "Admin123!" });
    expect(res.status).toBe(200);
    const payload = jwt.decode(res.body.token) as { exp: number; iat: number; rol: string };
    expect(payload.exp - payload.iat).toBe(24 * 60 * 60);
    expect(payload.rol).toBe("cliente");
    expect(res.body.user).not.toHaveProperty("passwordHash");
  });

  it("rechaza con 401 una contraseña incorrecta", async () => {
    enqueue("users", [user()]);
    compare.mockResolvedValue(false as never);
    const res = await request(app).post("/api/auth/login").send({ email: "maria@example.com", password: "mala" });
    expect(res.status).toBe(401);
  });

  it("rechaza con 401 a un usuario desactivado sin revisar la contraseña", async () => {
    enqueue("users", [user({ activo: false })]);
    const res = await request(app).post("/api/auth/login").send({ email: "maria@example.com", password: "Admin123!" });
    expect(res.status).toBe(401);
    expect(compare).not.toHaveBeenCalled();
  });

  it("responde 400 si falta el correo o la contraseña", async () => {
    const res = await request(app).post("/api/auth/login").send({ email: "maria@example.com" });
    expect(res.status).toBe(400);
  });
});

describe("POST /api/auth/register", () => {
  it("crea la cuenta siempre con rol cliente aunque se envíe otro rol", async () => {
    enqueue("users", [], [user({ email: "nuevo@example.com" })]);
    const res = await request(app).post("/api/auth/register")
      .send({ nombre: "Nuevo", email: "nuevo@example.com", password: "12345678", rol: "admin" });
    expect(res.status).toBe(201);
    expect((calls.find(c => c.op === "insert")?.payload as { rol: string }).rol).toBe("cliente");
  });

  it("guarda la contraseña cifrada, nunca en texto plano", async () => {
    enqueue("users", [], [user()]);
    await request(app).post("/api/auth/register").send({ nombre: "N", email: "n@example.com", password: "12345678" });
    const payload = calls.find(c => c.op === "insert")?.payload as { passwordHash: string };
    expect(payload.passwordHash).toBe("hash(12345678)");
    expect(bcrypt.hash).toHaveBeenCalledWith("12345678", 12);
  });
});

describe("GET /api/auth/me", () => {
  it("devuelve el perfil del usuario del token", async () => {
    enqueue("users", [user()]);
    const res = await request(app).get("/api/auth/me").set(bearer(clientToken()));
    expect(res.status).toBe(200);
    expect(res.body.email).toBe("maria@example.com");
    expect(res.body).not.toHaveProperty("passwordHash");
  });

  it("responde 404 si el usuario del token ya no existe", async () => {
    enqueue("users", []);
    const res = await request(app).get("/api/auth/me").set(bearer(clientToken()));
    expect(res.status).toBe(404);
  });
});

describe("PATCH /api/auth/profile", () => {
  it("actualiza nombre (sin espacios sobrantes) y teléfono", async () => {
    enqueue("users", [user()], [user({ nombre: "María L." })]);
    const res = await request(app).patch("/api/auth/profile").set(bearer(clientToken()))
      .send({ nombre: "  María L.  ", telefono: "" });
    expect(res.status).toBe(200);
    expect(calls.find(c => c.op === "update")?.payload).toEqual({ nombre: "María L.", telefono: null });
  });

  it("responde 400 si no se envía ningún cambio", async () => {
    enqueue("users", [user()]);
    const res = await request(app).patch("/api/auth/profile").set(bearer(clientToken())).send({});
    expect(res.status).toBe(400);
  });

  it("cambia la contraseña cuando la actual es correcta", async () => {
    enqueue("users", [user()], [user()]);
    const res = await request(app).patch("/api/auth/profile").set(bearer(clientToken()))
      .send({ passwordActual: "Admin123!", passwordNueva: "Nueva1234" });
    expect(res.status).toBe(200);
    expect(calls.find(c => c.op === "update")?.payload).toEqual({ passwordHash: "hash(Nueva1234)" });
  });

  it("rechaza el cambio si la contraseña actual es incorrecta", async () => {
    enqueue("users", [user()]);
    compare.mockResolvedValue(false as never);
    const res = await request(app).patch("/api/auth/profile").set(bearer(clientToken()))
      .send({ passwordActual: "mala", passwordNueva: "Nueva1234" });
    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/actual incorrecta/);
  });

  it("rechaza una contraseña nueva de 7 caracteres (valor límite)", async () => {
    enqueue("users", [user()]);
    const res = await request(app).patch("/api/auth/profile").set(bearer(clientToken()))
      .send({ passwordActual: "Admin123!", passwordNueva: "1234567" });
    expect(res.status).toBe(400);
  });
});

describe("Recuperación de contraseña", () => {
  it("responde el mismo mensaje exista o no el correo", async () => {
    enqueue("users", []);
    const res = await request(app).post("/api/auth/forgot-password").send({ email: "nadie@example.com" });
    expect(res.status).toBe(200);
    expect(res.body).not.toHaveProperty("token");
  });

  it("forgot-password exige el correo", async () => {
    const res = await request(app).post("/api/auth/forgot-password").send({});
    expect(res.status).toBe(400);
  });

  it("el token sirve una sola vez para restablecer la contraseña", async () => {
    enqueue("users", [user()]);
    const { body } = await request(app).post("/api/auth/forgot-password").send({ email: "maria@example.com" });
    const first = await request(app).post("/api/auth/reset-password").send({ token: body.token, nuevaPassword: "Nueva1234" });
    const second = await request(app).post("/api/auth/reset-password").send({ token: body.token, nuevaPassword: "Otra12345" });
    expect(first.status).toBe(200);
    expect(second.status).toBe(400);
  });

  it("rechaza un token inexistente", async () => {
    const res = await request(app).post("/api/auth/reset-password").send({ token: "inventado", nuevaPassword: "Nueva1234" });
    expect(res.status).toBe(400);
  });

  it("rechaza una contraseña nueva menor a 8 caracteres", async () => {
    const res = await request(app).post("/api/auth/reset-password").send({ token: "x", nuevaPassword: "corta" });
    expect(res.status).toBe(400);
  });

  it("reset-password exige token y contraseña", async () => {
    const res = await request(app).post("/api/auth/reset-password").send({});
    expect(res.status).toBe(400);
  });
});
