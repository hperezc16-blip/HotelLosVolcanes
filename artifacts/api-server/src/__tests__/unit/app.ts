import express, { type Express, type Router } from "express";
import { signToken } from "../../middlewares/auth.js";

export function buildApp(router: Router): Express {
  const app = express();
  app.use(express.json());
  app.use("/api", router);
  return app;
}

export const adminToken = () => signToken({ id: "admin-1", email: "admin@hotel.com", rol: "admin" });
export const clientToken = (id = "cli-1") => signToken({ id, email: "maria@example.com", rol: "cliente" });
export const bearer = (t: string) => ({ Authorization: `Bearer ${t}` });

export const user = (o: Record<string, unknown> = {}) => ({
  id: "cli-1", nombre: "María López", email: "maria@example.com", passwordHash: "HASH",
  rol: "cliente", telefono: null, activo: true, createdAt: new Date("2026-10-01"), ...o,
});
export const room = (o: Record<string, unknown> = {}) => ({
  id: "room-1", nombre: "Suite Tajumulco", tipo: "suite", precioNoche: "1200.00", capacidad: 3, activo: true, ...o,
});
export const reservation = (o: Record<string, unknown> = {}) => ({
  id: "res-1", clienteId: "cli-1", habitacionId: "room-1", fechaEntrada: "2026-12-10", fechaSalida: "2026-12-12",
  precioTotal: "2400.00", estado: "confirmada", estadoPago: "pendiente", notas: null,
  createdAt: new Date("2026-10-15T10:00:00Z"), ...o,
});
