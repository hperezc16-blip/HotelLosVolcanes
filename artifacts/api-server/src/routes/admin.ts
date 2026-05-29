import { Router } from "express";
import { db } from "@workspace/db";
import { reservationsTable, roomsTable, usersTable } from "@workspace/db";
import { eq, count, and, gte, lte, ne, sql, desc } from "drizzle-orm";
import { requireAdmin, type AuthRequest } from "../middlewares/auth.js";

const router: Router = Router();

router.get("/admin/stats", requireAdmin, async (req: AuthRequest, res) => {
  const today = new Date().toISOString().split("T")[0];
  const firstOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split("T")[0];

  const [totalRes] = await db.select({ count: count() }).from(reservationsTable);
  const [resHoy] = await db.select({ count: count() }).from(reservationsTable)
    .where(and(eq(reservationsTable.fechaEntrada, today), ne(reservationsTable.estado, "cancelada")));
  const [totalRooms] = await db.select({ count: count() }).from(roomsTable).where(eq(roomsTable.activo, true));

  const occupiedToday = await db.select({ id: reservationsTable.habitacionId }).from(reservationsTable)
    .where(and(
      ne(reservationsTable.estado, "cancelada"),
      lte(reservationsTable.fechaEntrada, today),
      gte(reservationsTable.fechaSalida, today)
    ));
  const occupiedSet = new Set(occupiedToday.map(r => r.id));
  const habitacionesDisponibles = (totalRooms.count as number) - occupiedSet.size;

  const ingresosResult = await db.select({ total: sql<number>`SUM(CAST(precio_total AS DECIMAL))` })
    .from(reservationsTable)
    .where(and(
      ne(reservationsTable.estado, "cancelada"),
      gte(reservationsTable.createdAt, new Date(firstOfMonth))
    ));

  const reservasRecientes = await db.select().from(reservationsTable)
    .orderBy(desc(reservationsTable.createdAt))
    .limit(5);

  const enriched = await Promise.all(reservasRecientes.map(async (r) => {
    const [room] = await db.select().from(roomsTable).where(eq(roomsTable.id, r.habitacionId)).limit(1);
    const [user] = await db.select().from(usersTable).where(eq(usersTable.id, r.clienteId)).limit(1);
    const { passwordHash: _, ...publicUser } = user!;
    return { ...r, room, cliente: publicUser };
  }));

  const total = totalRooms.count as number;
  const ocupacion = total > 0 ? Math.round((occupiedSet.size / total) * 100) : 0;

  res.json({
    totalReservaciones: Number(totalRes.count),
    reservacionesHoy: Number(resHoy.count),
    habitacionesDisponibles,
    totalHabitaciones: total,
    ingresosMes: Number(ingresosResult[0]?.total ?? 0),
    ocupacionPorcentaje: ocupacion,
    reservasRecientes: enriched,
  });
});

router.get("/admin/calendar", requireAdmin, async (req: AuthRequest, res) => {
  const { desde, hasta } = req.query as { desde?: string; hasta?: string };

  const today = new Date();
  const startDate = desde || today.toISOString().split("T")[0];
  const endOfRange = new Date(today);
  endOfRange.setDate(endOfRange.getDate() + 29);
  const endDate = hasta || endOfRange.toISOString().split("T")[0];

  const rooms = await db.select().from(roomsTable).where(eq(roomsTable.activo, true));

  const reservations = await db.select().from(reservationsTable).where(
    and(
      ne(reservationsTable.estado, "cancelada"),
      lte(reservationsTable.fechaEntrada, endDate),
      gte(reservationsTable.fechaSalida, startDate)
    )
  );

  const enrichedReservations = await Promise.all(reservations.map(async (r) => {
    const [user] = await db.select().from(usersTable).where(eq(usersTable.id, r.clienteId)).limit(1);
    const { passwordHash: _, ...publicUser } = user!;
    return { ...r, cliente: publicUser };
  }));

  res.json({
    rooms: rooms.map(r => ({ id: r.id, nombre: r.nombre, tipo: r.tipo, precioNoche: r.precioNoche })),
    reservations: enrichedReservations,
    desde: startDate,
    hasta: endDate,
  });
});

router.get("/admin/users", requireAdmin, async (_req, res) => {
  const users = await db.select({
    id: usersTable.id,
    nombre: usersTable.nombre,
    email: usersTable.email,
    rol: usersTable.rol,
    telefono: usersTable.telefono,
    activo: usersTable.activo,
    createdAt: usersTable.createdAt,
  }).from(usersTable).orderBy(desc(usersTable.createdAt));
  res.json(users);
});

router.patch("/admin/users/:id", requireAdmin, async (req: AuthRequest, res) => {
  const id = req.params.id as string;
  if (id === req.user!.id) {
    res.status(400).json({ error: "Bad Request", message: "No puedes modificar tu propio usuario" });
    return;
  }
  const { activo } = req.body as { activo?: boolean };
  if (activo === undefined) {
    res.status(400).json({ error: "Bad Request", message: "Campo activo requerido" });
    return;
  }
  const [updated] = await db.update(usersTable)
    .set({ activo })
    .where(eq(usersTable.id, id))
    .returning({ id: usersTable.id, nombre: usersTable.nombre, email: usersTable.email, rol: usersTable.rol, activo: usersTable.activo });
  if (!updated) {
    res.status(404).json({ error: "Not Found", message: "Usuario no encontrado" });
    return;
  }
  res.json(updated);
});

router.get("/admin/reports", requireAdmin, async (_req, res) => {
  const reservations = await db.select({
    id: reservationsTable.id,
    precioTotal: reservationsTable.precioTotal,
    estado: reservationsTable.estado,
    estadoPago: reservationsTable.estadoPago,
    fechaEntrada: reservationsTable.fechaEntrada,
    createdAt: reservationsTable.createdAt,
    habitacionId: reservationsTable.habitacionId,
  }).from(reservationsTable);

  const rooms = await db.select().from(roomsTable);

  const monthlyMap: Record<string, { mes: string; ingresos: number; reservas: number }> = {};
  for (const r of reservations) {
    if (r.estado === "cancelada") continue;
    const date = new Date(r.createdAt);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    const label = date.toLocaleDateString("es-GT", { month: "short", year: "numeric" });
    if (!monthlyMap[key]) monthlyMap[key] = { mes: label, ingresos: 0, reservas: 0 };
    monthlyMap[key].ingresos += parseFloat(r.precioTotal);
    monthlyMap[key].reservas += 1;
  }
  const ingresosMensuales = Object.entries(monthlyMap)
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-6)
    .map(([, v]) => v);

  const tipoCount: Record<string, number> = {};
  for (const r of reservations) {
    if (r.estado === "cancelada") continue;
    const room = rooms.find(rm => rm.id === r.habitacionId);
    if (room) {
      tipoCount[room.tipo] = (tipoCount[room.tipo] || 0) + 1;
    }
  }
  const porTipoHabitacion = Object.entries(tipoCount).map(([tipo, value]) => ({ tipo, value }));

  const pagadas = reservations.filter(r => r.estadoPago === "pagado" && r.estado !== "cancelada").length;
  const pendientesPago = reservations.filter(r => r.estadoPago !== "pagado" && r.estado !== "cancelada").length;
  const canceladas = reservations.filter(r => r.estado === "cancelada").length;
  const totalIngresos = reservations
    .filter(r => r.estadoPago === "pagado" && r.estado !== "cancelada")
    .reduce((sum, r) => sum + parseFloat(r.precioTotal), 0);

  res.json({ ingresosMensuales, porTipoHabitacion, pagadas, pendientesPago, canceladas, totalIngresos });
});

router.get("/admin/inventory", requireAdmin, async (_req, res) => {
  const today = new Date().toISOString().split("T")[0];
  const rooms = await db.select().from(roomsTable).where(eq(roomsTable.activo, true));
  const activeRes = await db.select({
    habitacionId: reservationsTable.habitacionId,
    estado: reservationsTable.estado,
    fechaEntrada: reservationsTable.fechaEntrada,
    fechaSalida: reservationsTable.fechaSalida,
    clienteId: reservationsTable.clienteId,
  }).from(reservationsTable).where(
    and(
      ne(reservationsTable.estado, "cancelada"),
      lte(reservationsTable.fechaEntrada, today),
      gte(reservationsTable.fechaSalida, today)
    )
  );

  const occupiedIds = new Set(activeRes.map(r => r.habitacionId));

  const todayArrivals = await db.select().from(reservationsTable)
    .where(and(eq(reservationsTable.fechaEntrada, today), ne(reservationsTable.estado, "cancelada")));

  const todayDepartures = await db.select().from(reservationsTable)
    .where(and(eq(reservationsTable.fechaSalida, today), ne(reservationsTable.estado, "cancelada")));

  const inventory = rooms.map(r => ({
    ...r,
    estadoOcupacion: occupiedIds.has(r.id) ? "ocupada" : "disponible",
  }));

  res.json({ inventory, todayArrivals: todayArrivals.length, todayDepartures: todayDepartures.length });
});

router.get("/admin/checkinout", requireAdmin, async (_req, res) => {
  const today = new Date().toISOString().split("T")[0];

  const arrivals = await db.select().from(reservationsTable)
    .where(and(eq(reservationsTable.fechaEntrada, today), ne(reservationsTable.estado, "cancelada")))
    .orderBy(reservationsTable.createdAt);

  const departures = await db.select().from(reservationsTable)
    .where(and(eq(reservationsTable.fechaSalida, today), ne(reservationsTable.estado, "cancelada")))
    .orderBy(reservationsTable.createdAt);

  async function enrich(list: typeof arrivals) {
    return Promise.all(list.map(async r => {
      const [room] = await db.select().from(roomsTable).where(eq(roomsTable.id, r.habitacionId)).limit(1);
      const [user] = await db.select().from(usersTable).where(eq(usersTable.id, r.clienteId)).limit(1);
      const { passwordHash: _, ...publicUser } = user!;
      return { ...r, room, cliente: publicUser };
    }));
  }

  res.json({ arrivals: await enrich(arrivals), departures: await enrich(departures), fecha: today });
});

export default router;
