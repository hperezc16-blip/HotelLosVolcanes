import { Router } from "express";
import { db } from "@workspace/db";
import { reservationsTable, roomsTable, usersTable } from "@workspace/db";
import { eq, and, or, lte, gte, ne, desc } from "drizzle-orm";
import { requireAuth, type AuthRequest } from "../middlewares/auth.js";

const router: Router = Router();

const ESTADOS_RESERVA = ["pendiente", "confirmada", "cancelada", "completada"];

async function enrichReservation(r: typeof reservationsTable.$inferSelect) {
  const [room] = await db.select().from(roomsTable).where(eq(roomsTable.id, r.habitacionId)).limit(1);
  const [user] = await db.select().from(usersTable).where(eq(usersTable.id, r.clienteId)).limit(1);
  const { passwordHash: _, ...publicUser } = user!;
  return { ...r, room, cliente: publicUser };
}

router.get("/reservations", requireAuth, async (req: AuthRequest, res) => {
  const { estado } = req.query as { estado?: string };
  const isAdmin = req.user!.rol === "admin";

  if (estado && !ESTADOS_RESERVA.includes(estado)) {
    res.status(400).json({ error: "Bad Request", message: "Estado inválido" });
    return;
  }

  let query = db.select().from(reservationsTable).orderBy(desc(reservationsTable.createdAt));
  let reservations;

  if (isAdmin) {
    reservations = estado
      ? await db.select().from(reservationsTable).where(eq(reservationsTable.estado, estado as "confirmada" | "cancelada" | "completada")).orderBy(desc(reservationsTable.createdAt))
      : await db.select().from(reservationsTable).orderBy(desc(reservationsTable.createdAt));
  } else {
    reservations = estado
      ? await db.select().from(reservationsTable).where(and(eq(reservationsTable.clienteId, req.user!.id), eq(reservationsTable.estado, estado as "confirmada" | "cancelada" | "completada"))).orderBy(desc(reservationsTable.createdAt))
      : await db.select().from(reservationsTable).where(eq(reservationsTable.clienteId, req.user!.id)).orderBy(desc(reservationsTable.createdAt));
  }

  const enriched = await Promise.all(reservations.map(enrichReservation));
  res.json(enriched);
});

router.post("/reservations", requireAuth, async (req: AuthRequest, res) => {
  const { habitacionId, fechaEntrada, fechaSalida, notas } = req.body;
  if (!habitacionId || !fechaEntrada || !fechaSalida) {
    res.status(400).json({ error: "Bad Request", message: "habitacionId, fechaEntrada y fechaSalida son requeridos" });
    return;
  }

  const entradaDate = new Date(fechaEntrada);
  const salidaDate = new Date(fechaSalida);
  if (isNaN(entradaDate.getTime()) || isNaN(salidaDate.getTime())) {
    res.status(400).json({ error: "Bad Request", message: "Formato de fecha inválido" });
    return;
  }
  if (entradaDate >= salidaDate) {
    res.status(400).json({ error: "Bad Request", message: "La fecha de salida debe ser posterior a la de entrada" });
    return;
  }

  const [room] = await db.select().from(roomsTable).where(and(eq(roomsTable.id, habitacionId), eq(roomsTable.activo, true))).limit(1);
  if (!room) {
    res.status(400).json({ error: "Bad Request", message: "Habitación no encontrada o no disponible" });
    return;
  }

  const conflicts = await db.select().from(reservationsTable).where(
    and(
      eq(reservationsTable.habitacionId, habitacionId),
      ne(reservationsTable.estado, "cancelada"),
      or(
        and(lte(reservationsTable.fechaEntrada, fechaEntrada), gte(reservationsTable.fechaSalida, fechaEntrada)),
        and(lte(reservationsTable.fechaEntrada, fechaSalida), gte(reservationsTable.fechaSalida, fechaSalida)),
        and(gte(reservationsTable.fechaEntrada, fechaEntrada), lte(reservationsTable.fechaSalida, fechaSalida))
      )
    )
  );

  if (conflicts.length > 0) {
    res.status(400).json({ error: "Conflict", message: "La habitación no está disponible en las fechas seleccionadas" });
    return;
  }

  const nights = Math.ceil((salidaDate.getTime() - entradaDate.getTime()) / (1000 * 60 * 60 * 24));
  const precioTotal = (parseFloat(room.precioNoche) * nights).toFixed(2);

  const [reservation] = await db.insert(reservationsTable).values({
    clienteId: req.user!.id,
    habitacionId,
    fechaEntrada,
    fechaSalida,
    precioTotal,
    notas: notas || null,
    estado: "confirmada",
  }).returning();

  const enriched = await enrichReservation(reservation);
  res.status(201).json(enriched);
});

router.get("/reservations/:id", requireAuth, async (req: AuthRequest, res) => {
  const id = req.params.id as string;
  const [reservation] = await db.select().from(reservationsTable).where(eq(reservationsTable.id, id)).limit(1);
  if (!reservation) {
    res.status(404).json({ error: "Not Found", message: "Reserva no encontrada" });
    return;
  }
  if (req.user!.rol !== "admin" && reservation.clienteId !== req.user!.id) {
    res.status(403).json({ error: "Forbidden", message: "No autorizado" });
    return;
  }
  const enriched = await enrichReservation(reservation);
  res.json(enriched);
});

const ESTADOS_PAGO = ["pendiente", "anticipo", "pagado"];

type AdminUpdate = { error: string } | { fields: Record<string, string> };

/** Valida el cuerpo que envía el administrador y arma los campos a actualizar. */
export function buildAdminUpdate(body: { estado?: string; estadoPago?: string; notas?: string }): AdminUpdate {
  const { estado, estadoPago, notas } = body;
  if (estado && !ESTADOS_RESERVA.includes(estado)) return { error: "Estado inválido" };
  if (estadoPago && !ESTADOS_PAGO.includes(estadoPago)) return { error: "Estado de pago inválido" };

  const fields: Record<string, string> = {};
  if (estado) fields["estado"] = estado;
  if (estadoPago) fields["estadoPago"] = estadoPago;
  if (notas !== undefined) fields["notas"] = notas;

  if (Object.keys(fields).length === 0) return { error: "No se enviaron campos para actualizar" };
  return { fields };
}

async function updateReservation(id: string, fields: Record<string, string>) {
  const [updated] = await db.update(reservationsTable)
    .set(fields as Partial<typeof reservationsTable.$inferInsert>)
    .where(eq(reservationsTable.id, id))
    .returning();
  return enrichReservation(updated);
}

router.patch("/reservations/:id", requireAuth, async (req: AuthRequest, res) => {
  const id = req.params.id as string;
  const [reservation] = await db.select().from(reservationsTable).where(eq(reservationsTable.id, id)).limit(1);
  if (!reservation) {
    res.status(404).json({ error: "Not Found", message: "Reserva no encontrada" });
    return;
  }
  const isAdmin = req.user!.rol === "admin";
  if (!isAdmin && reservation.clienteId !== req.user!.id) {
    res.status(403).json({ error: "Forbidden", message: "No autorizado" });
    return;
  }

  if (isAdmin) {
    const result = buildAdminUpdate(req.body);
    if ("error" in result) {
      res.status(400).json({ error: "Bad Request", message: result.error });
      return;
    }
    res.json(await updateReservation(id, result.fields));
    return;
  }

  // El cliente solo puede cancelar su propia reservación.
  if (reservation.estado === "cancelada") {
    res.status(400).json({ error: "Bad Request", message: "La reserva ya está cancelada" });
    return;
  }
  res.json(await updateReservation(id, { estado: "cancelada" }));
});

router.post("/reservations/:id/pay", requireAuth, async (req: AuthRequest, res) => {
  const id = req.params.id as string;
  const [reservation] = await db.select().from(reservationsTable).where(eq(reservationsTable.id, id)).limit(1);

  if (!reservation) {
    res.status(404).json({ error: "Not Found", message: "Reserva no encontrada" });
    return;
  }
  if (req.user!.rol !== "admin" && reservation.clienteId !== req.user!.id) {
    res.status(403).json({ error: "Forbidden", message: "No autorizado" });
    return;
  }
  if (reservation.estadoPago === "pagado") {
    res.status(400).json({ error: "Bad Request", message: "La reserva ya está pagada" });
    return;
  }

  const { metodoPago = "tarjeta" } = req.body as { metodoPago?: string };
  const codigoAutorizacion = Math.random().toString(36).substring(2, 10).toUpperCase();
  const numeroFactura = `FV-${Date.now().toString().slice(-8)}`;

  const [updated] = await db.update(reservationsTable)
    .set({ estadoPago: "pagado" })
    .where(eq(reservationsTable.id, id))
    .returning();

  const enriched = await enrichReservation(updated);
  res.json({
    ...enriched,
    codigoAutorizacion,
    numeroFactura,
    metodoPago,
    fechaPago: new Date().toISOString(),
    facturaEmail: true,
  });
});

export default router;
