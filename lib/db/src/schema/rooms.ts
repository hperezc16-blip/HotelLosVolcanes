import { pgTable, uuid, varchar, text, decimal, smallint, boolean, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const tipoHabitacionEnum = pgEnum("tipo_habitacion", ["sencilla", "doble", "suite", "cabana"]);

export const roomsTable = pgTable("rooms", {
  id: uuid("id").primaryKey().defaultRandom(),
  nombre: varchar("nombre", { length: 100 }).notNull(),
  descripcion: text("descripcion"),
  tipo: tipoHabitacionEnum("tipo").notNull().default("sencilla"),
  precioNoche: decimal("precio_noche", { precision: 10, scale: 2 }).notNull(),
  capacidad: smallint("capacidad").notNull().default(2),
  imageUrl: varchar("image_url", { length: 500 }),
  amenidades: text("amenidades"),
  estadoManual: varchar("estado_manual", { length: 20 }),
  activo: boolean("activo").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertRoomSchema = createInsertSchema(roomsTable).omit({ id: true, createdAt: true });
export const selectRoomSchema = createSelectSchema(roomsTable);

export type InsertRoom = z.infer<typeof insertRoomSchema>;
export type Room = typeof roomsTable.$inferSelect;
