import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";

vi.mock("@workspace/db", () => import("./dbStub.js"));
vi.mock("drizzle-orm", () => {
  const f = () => ({});
  return { eq: f, and: f, or: f, ne: f, lte: f, gte: f, desc: f };
});

import reservationsRouter, { buildAdminUpdate } from "../../routes/reservations.js";
import { enqueue, resetDb, calls } from "./dbStub.js";
import { buildApp, adminToken, clientToken, bearer, user, room, reservation } from "./app.js";

const app = buildApp(reservationsRouter);
const nueva = { habitacionId: "room-1", fechaEntrada: "2026-12-10", fechaSalida: "2026-12-12" };

beforeEach(resetDb);

describe("POST /api/reservations - creación", () => {
  it("calcula el precio total como noches por precio por noche", async () => {
    enqueue("rooms", [room({ precioNoche: "1200.00" })], [room()]);
    enqueue("reservations", [], [reservation()]);
    enqueue("users", [user()]);

    const res = await request(app).post("/api/reservations").set(bearer(clientToken())).send(nueva);

    expect(res.status).toBe(201);
    const insert = calls.find(c => c.op === "insert")?.payload as Record<string, string>;
    expect(insert.precioTotal).toBe("2400.00");
    expect(insert.estado).toBe("confirmada");
    expect(insert.clienteId).toBe("cli-1");
  });

  it("toma el cliente del token, no del cuerpo de la petición", async () => {
    enqueue("rooms", [room()], [room()]);
    enqueue("reservations", [], [reservation()]);
    enqueue("users", [user()]);
    await request(app).post("/api/reservations").set(bearer(clientToken("cli-1"))).send({ ...nueva, clienteId: "otro" });
    expect((calls.find(c => c.op === "insert")?.payload as { clienteId: string }).clienteId).toBe("cli-1");
  });

  it("rechaza con 400 cuando la habitación ya está ocupada en esas fechas", async () => {
    enqueue("rooms", [room()]);
    enqueue("reservations", [reservation({ id: "otra" })]);
    const res = await request(app).post("/api/reservations").set(bearer(clientToken())).send(nueva);
    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/no está disponible/);
    expect(calls.some(c => c.op === "insert")).toBe(false);
  });

  it("acepta una estancia de una sola noche (valor límite válido)", async () => {
    enqueue("rooms", [room({ precioNoche: "350.00" })], [room()]);
    enqueue("reservations", [], [reservation()]);
    enqueue("users", [user()]);
    const res = await request(app).post("/api/reservations").set(bearer(clientToken()))
      .send({ ...nueva, fechaSalida: "2026-12-11" });
    expect(res.status).toBe(201);
    expect((calls.find(c => c.op === "insert")?.payload as { precioTotal: string }).precioTotal).toBe("350.00");
  });
});

describe("Consulta de reservaciones", () => {
  it("el listado incluye habitación y cliente sin contraseña", async () => {
    enqueue("reservations", [reservation()]);
    enqueue("rooms", [room()]);
    enqueue("users", [user()]);
    const res = await request(app).get("/api/reservations").set(bearer(clientToken()));
    expect(res.status).toBe(200);
    expect(res.body[0].room.nombre).toBe("Suite Tajumulco");
    expect(res.body[0].cliente).not.toHaveProperty("passwordHash");
  });

  it("el cliente puede ver su propia reservación", async () => {
    enqueue("reservations", [reservation()]);
    enqueue("rooms", [room()]);
    enqueue("users", [user()]);
    const res = await request(app).get("/api/reservations/res-1").set(bearer(clientToken("cli-1")));
    expect(res.status).toBe(200);
    expect(res.body.id).toBe("res-1");
  });

  it("el administrador puede ver la reservación de cualquier cliente", async () => {
    enqueue("reservations", [reservation({ clienteId: "otro" })]);
    enqueue("rooms", [room()]);
    enqueue("users", [user({ id: "otro" })]);
    const res = await request(app).get("/api/reservations/res-1").set(bearer(adminToken()));
    expect(res.status).toBe(200);
  });
});

describe("PATCH /api/reservations/:id - cambios de estado", () => {
  it("el administrador actualiza estado y estado de pago a la vez", async () => {
    enqueue("reservations", [reservation()], [reservation({ estado: "completada", estadoPago: "pagado" })]);
    enqueue("rooms", [room()]);
    enqueue("users", [user()]);
    const res = await request(app).patch("/api/reservations/res-1").set(bearer(adminToken()))
      .send({ estado: "completada", estadoPago: "pagado" });
    expect(res.status).toBe(200);
    expect(calls.find(c => c.op === "update")?.payload).toEqual({ estado: "completada", estadoPago: "pagado" });
  });

  it("el administrador puede actualizar solo las notas", async () => {
    enqueue("reservations", [reservation()], [reservation({ notas: "Llega tarde" })]);
    enqueue("rooms", [room()]);
    enqueue("users", [user()]);
    const res = await request(app).patch("/api/reservations/res-1").set(bearer(adminToken())).send({ notas: "Llega tarde" });
    expect(res.status).toBe(200);
    expect(calls.find(c => c.op === "update")?.payload).toEqual({ notas: "Llega tarde" });
  });

  it("el cliente solo puede cancelar: ignora cualquier otro estado enviado", async () => {
    enqueue("reservations", [reservation()], [reservation({ estado: "cancelada" })]);
    enqueue("rooms", [room()]);
    enqueue("users", [user()]);
    const res = await request(app).patch("/api/reservations/res-1").set(bearer(clientToken()))
      .send({ estado: "completada", estadoPago: "pagado" });
    expect(res.status).toBe(200);
    expect(calls.find(c => c.op === "update")?.payload).toEqual({ estado: "cancelada" });
  });
});

describe("POST /api/reservations/:id/pay - pago", () => {
  it("registra el pago y devuelve código de autorización y factura", async () => {
    enqueue("reservations", [reservation()], [reservation({ estadoPago: "pagado" })]);
    enqueue("rooms", [room()]);
    enqueue("users", [user()]);
    const res = await request(app).post("/api/reservations/res-1/pay").set(bearer(clientToken())).send({});
    expect(res.status).toBe(200);
    expect(res.body.metodoPago).toBe("tarjeta");
    expect(res.body.numeroFactura).toMatch(/^FV-\d{8}$/);
    expect(res.body.codigoAutorizacion).toMatch(/^[A-Z0-9]+$/);
    expect(calls.find(c => c.op === "update")?.payload).toEqual({ estadoPago: "pagado" });
  });

  it("respeta el método de pago enviado", async () => {
    enqueue("reservations", [reservation()], [reservation({ estadoPago: "pagado" })]);
    enqueue("rooms", [room()]);
    enqueue("users", [user()]);
    const res = await request(app).post("/api/reservations/res-1/pay").set(bearer(clientToken())).send({ metodoPago: "transferencia" });
    expect(res.body.metodoPago).toBe("transferencia");
  });

  it("no permite pagar dos veces la misma reservación", async () => {
    enqueue("reservations", [reservation({ estadoPago: "pagado" })]);
    const res = await request(app).post("/api/reservations/res-1/pay").set(bearer(clientToken())).send({});
    expect(res.status).toBe(400);
    expect(calls.some(c => c.op === "update")).toBe(false);
  });

  it("responde 404 si la reservación no existe", async () => {
    enqueue("reservations", []);
    const res = await request(app).post("/api/reservations/x/pay").set(bearer(clientToken())).send({});
    expect(res.status).toBe(404);
  });

  it("no permite que un cliente pague la reservación de otro", async () => {
    enqueue("reservations", [reservation({ clienteId: "otro" })]);
    const res = await request(app).post("/api/reservations/res-1/pay").set(bearer(clientToken("cli-1"))).send({});
    expect(res.status).toBe(403);
  });
});

describe("buildAdminUpdate (validación del cambio de estado)", () => {
  it("rechaza un estado que no existe", () => {
    expect(buildAdminUpdate({ estado: "perdida" })).toEqual({ error: "Estado inválido" });
  });

  it("rechaza un estado de pago que no existe", () => {
    expect(buildAdminUpdate({ estadoPago: "reembolsado" })).toEqual({ error: "Estado de pago inválido" });
  });

  it("rechaza una petición sin cambios", () => {
    expect(buildAdminUpdate({})).toEqual({ error: "No se enviaron campos para actualizar" });
  });

  it("permite notas vacías para borrarlas", () => {
    expect(buildAdminUpdate({ notas: "" })).toEqual({ fields: { notas: "" } });
  });
});
