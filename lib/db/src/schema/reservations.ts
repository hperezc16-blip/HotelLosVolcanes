import { pgTable, uuid, decimal, text, timestamp, date, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { usersTable } from "./users";
import { roomsTable } from "./rooms";

export const estadoReservaEnum = pgEnum("estado_reserva", ["pendiente", "confirmada", "cancelada", "completada"]);

export const reservationsTable = pgTable("reservations", {
  id: uuid("id").primaryKey().defaultRandom(),
  clienteId: uuid("cliente_id").notNull().references(() => usersTable.id),
  habitacionId: uuid("habitacion_id").notNull().references(() => roomsTable.id),
  fechaEntrada: date("fecha_entrada").notNull(),
  fechaSalida: date("fecha_salida").notNull(),
  precioTotal: decimal("precio_total", { precision: 10, scale: 2 }).notNull(),
  estado: estadoReservaEnum("estado").notNull().default("pendiente"),
  estadoPago: text("estado_pago").notNull().default("pendiente"),
  notas: text("notas"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertReservationSchema = createInsertSchema(reservationsTable).omit({ id: true, createdAt: true, clienteId: true });
export const selectReservationSchema = createSelectSchema(reservationsTable);

export type InsertReservation = z.infer<typeof insertReservationSchema>;
export type Reservation = typeof reservationsTable.$inferSelect;
