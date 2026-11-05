import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";

// Stub de la base de datos (ver dbStub.ts para la justificación).
vi.mock("@workspace/db", () => import("./dbStub.js"));
vi.mock("drizzle-orm", () => {
  const f = () => ({});
  return { eq: f, and: f, or: f, ne: f, lte: f, gte: f, desc: f, count: f, sql: f };
});

import adminRouter from "../../routes/admin.js";
import { enqueue, resetDb, calls } from "./dbStub.js";
import { buildApp, adminToken, clientToken, bearer, user, room, reservation } from "./app.js";

const app = buildApp(adminRouter);

describe("Admin - control de acceso", () => {
  beforeEach(resetDb);

  it("rechaza con 401 las rutas de admin sin token", async () => {
    const res = await request(app).get("/api/admin/users");
    expect(res.status).toBe(401);
  });

  it("rechaza con 403 a un usuario con rol cliente", async () => {
    const res = await request(app).get("/api/admin/reports").set(bearer(clientToken()));
    expect(res.status).toBe(403);
  });
});

describe("GET /api/admin/stats", () => {
  beforeEach(resetDb);

  it("calcula ocupación, disponibles e ingresos y enriquece las reservas recientes", async () => {
    enqueue("reservations",
      [{ count: 7 }],              // total reservaciones
      [{ count: 2 }],              // reservaciones de hoy
      [{ id: "room-1" }],          // habitaciones ocupadas hoy
      [{ total: "3600.50" }],      // ingresos del mes
      [reservation()],             // reservas recientes
    );
    enqueue("rooms", [{ count: 4 }], [room()]);
    enqueue("users", [user()]);

    const res = await request(app).get("/api/admin/stats").set(bearer(adminToken()));

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({
      totalReservaciones: 7,
      reservacionesHoy: 2,
      totalHabitaciones: 4,
      habitacionesDisponibles: 3,
      ingresosMes: 3600.5,
      ocupacionPorcentaje: 25,
    });
    expect(res.body.reservasRecientes[0].room.nombre).toBe("Suite Tajumulco");
    expect(res.body.reservasRecientes[0].cliente).not.toHaveProperty("passwordHash");
  });

  it("devuelve ocupación 0 sin dividir entre cero cuando no hay habitaciones", async () => {
    enqueue("reservations", [{ count: 0 }], [{ count: 0 }], [], [{ total: null }], []);
    enqueue("rooms", [{ count: 0 }]);

    const res = await request(app).get("/api/admin/stats").set(bearer(adminToken()));

    expect(res.status).toBe(200);
    expect(res.body.ocupacionPorcentaje).toBe(0);
    expect(res.body.ingresosMes).toBe(0);
    expect(res.body.reservasRecientes).toEqual([]);
  });
});

describe("GET /api/admin/calendar", () => {
  beforeEach(resetDb);

  it("usa un rango de 30 días desde hoy cuando no se envían fechas", async () => {
    enqueue("rooms", [room()]);
    enqueue("reservations", []);
    const res = await request(app).get("/api/admin/calendar").set(bearer(adminToken()));
    const desde = new Date(res.body.desde), hasta = new Date(res.body.hasta);
    expect(res.status).toBe(200);
    expect(Math.round((+hasta - +desde) / 86400000)).toBe(29);
    expect(res.body.rooms[0]).toEqual({ id: "room-1", nombre: "Suite Tajumulco", tipo: "suite", precioNoche: "1200.00" });
  });

  it("incluye al cliente sin su contraseña en cada reservación", async () => {
    enqueue("rooms", [room()]);
    enqueue("reservations", [reservation()]);
    enqueue("users", [user()]);
    const res = await request(app).get("/api/admin/calendar?desde=2026-12-01&hasta=2026-12-31").set(bearer(adminToken()));
    expect(res.body.desde).toBe("2026-12-01");
    expect(res.body.reservations[0].cliente.nombre).toBe("María López");
    expect(res.body.reservations[0].cliente).not.toHaveProperty("passwordHash");
  });
});

describe("Gestión de usuarios", () => {
  beforeEach(resetDb);

  it("GET /admin/users lista los usuarios", async () => {
    enqueue("users", [user(), user({ id: "admin-1", rol: "admin" })]);
    const res = await request(app).get("/api/admin/users").set(bearer(adminToken()));
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(2);
  });

  it("PATCH no permite que el administrador se desactive a sí mismo", async () => {
    const res = await request(app).patch("/api/admin/users/admin-1").set(bearer(adminToken())).send({ activo: false });
    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/propio usuario/);
  });

  it("PATCH exige el campo activo", async () => {
    const res = await request(app).patch("/api/admin/users/cli-1").set(bearer(adminToken())).send({});
    expect(res.status).toBe(400);
  });

  it("PATCH desactiva a otro usuario y guarda activo=false", async () => {
    enqueue("users", [{ id: "cli-1", activo: false }]);
    const res = await request(app).patch("/api/admin/users/cli-1").set(bearer(adminToken())).send({ activo: false });
    expect(res.status).toBe(200);
    expect(calls.find(c => c.op === "update")?.payload).toEqual({ activo: false });
  });

  it("PATCH responde 404 si el usuario no existe", async () => {
    enqueue("users", []);
    const res = await request(app).patch("/api/admin/users/no-existe").set(bearer(adminToken())).send({ activo: true });
    expect(res.status).toBe(404);
  });
});

describe("GET /api/admin/reports", () => {
  beforeEach(resetDb);

  it("agrupa ingresos por mes, cuenta por tipo y excluye las canceladas", async () => {
    enqueue("reservations", [
      reservation({ id: "a", precioTotal: "1000.00", estadoPago: "pagado", createdAt: "2026-09-10T12:00:00Z" }),
      reservation({ id: "b", precioTotal: "500.00", estadoPago: "pendiente", createdAt: "2026-10-05T12:00:00Z", habitacionId: "room-2" }),
      reservation({ id: "c", precioTotal: "900.00", estado: "cancelada", estadoPago: "pagado", createdAt: "2026-10-06T12:00:00Z" }),
    ]);
    enqueue("rooms", [room(), room({ id: "room-2", tipo: "doble" })]);

    const res = await request(app).get("/api/admin/reports").set(bearer(adminToken()));

    expect(res.status).toBe(200);
    expect(res.body.ingresosMensuales.map((m: { ingresos: number }) => m.ingresos)).toEqual([1000, 500]);
    expect(res.body.porTipoHabitacion).toEqual(expect.arrayContaining([{ tipo: "suite", value: 1 }, { tipo: "doble", value: 1 }]));
    expect(res.body).toMatchObject({ pagadas: 1, pendientesPago: 1, canceladas: 1, totalIngresos: 1000 });
  });
});

describe("Estado de habitaciones, inventario y check-in/out", () => {
  beforeEach(resetDb);

  it("PATCH /admin/rooms/:id/status guarda null cuando el estado viene vacío", async () => {
    enqueue("rooms", [room({ estadoManual: null })]);
    const res = await request(app).patch("/api/admin/rooms/room-1/status").set(bearer(adminToken())).send({ estadoManual: "" });
    expect(res.status).toBe(200);
    expect(calls.find(c => c.op === "update")?.payload).toEqual({ estadoManual: null });
  });

  it("PATCH /admin/rooms/:id/status responde 404 si la habitación no existe", async () => {
    enqueue("rooms", []);
    const res = await request(app).patch("/api/admin/rooms/x/status").set(bearer(adminToken())).send({ estadoManual: "limpieza" });
    expect(res.status).toBe(404);
  });

  it("GET /admin/inventory marca ocupadas y disponibles y cuenta llegadas y salidas", async () => {
    enqueue("rooms", [room(), room({ id: "room-2" })]);
    enqueue("reservations", [{ habitacionId: "room-1" }], [reservation()], []);
    const res = await request(app).get("/api/admin/inventory").set(bearer(adminToken()));
    expect(res.status).toBe(200);
    expect(res.body.inventory.map((r: { estadoOcupacion: string }) => r.estadoOcupacion)).toEqual(["ocupada", "disponible"]);
    expect(res.body).toMatchObject({ todayArrivals: 1, todayDepartures: 0 });
  });

  it("GET /admin/checkinout devuelve llegadas y salidas del día enriquecidas", async () => {
    enqueue("reservations", [reservation()], [reservation({ id: "res-2" })]);
    enqueue("rooms", [room()], [room()]);
    enqueue("users", [user()], [user()]);
    const res = await request(app).get("/api/admin/checkinout").set(bearer(adminToken()));
    expect(res.status).toBe(200);
    expect(res.body.fecha).toBe(new Date().toISOString().split("T")[0]);
    expect(res.body.arrivals[0].room.id).toBe("room-1");
    expect(res.body.departures[0].cliente).not.toHaveProperty("passwordHash");
  });
});
