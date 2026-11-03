export type RoomFilters = { tipo: string; capacidad: string; fechaEntrada: string; fechaSalida: string };

/** Convierte los filtros del formulario en los parametros que espera la API. */
export function buildRoomQuery(filters: RoomFilters): Record<string, string | number> {
  const query: Record<string, string | number> = {};
  if (filters.tipo !== "all") query.tipo = filters.tipo;
  if (filters.capacidad) query.capacidad = Number.parseInt(filters.capacidad, 10);
  if (filters.fechaEntrada) query.fechaEntrada = filters.fechaEntrada;
  if (filters.fechaSalida) query.fechaSalida = filters.fechaSalida;
  return query;
}

/** Numero de noches entre dos fechas; 0 si falta alguna. */
export function countNights(fechaEntrada: string, fechaSalida: string): number {
  if (!fechaEntrada || !fechaSalida) return 0;
  return Math.ceil((new Date(fechaSalida).getTime() - new Date(fechaEntrada).getTime()) / 86400000);
}

export const IMPUESTO = 0.12;

/** Noches, subtotal, impuesto (12 %) y total de una estadía. Todo en 0 si las fechas no son válidas. */
export function calcStayPrice(fechaEntrada: string, fechaSalida: string, precioNoche?: string) {
  const nights = precioNoche ? countNights(fechaEntrada, fechaSalida) : 0;
  if (nights <= 0) return { nights: 0, subtotal: 0, impuesto: 0, total: 0 };
  const subtotal = nights * Number.parseFloat(precioNoche as string);
  const impuesto = subtotal * IMPUESTO;
  return { nights, subtotal, impuesto, total: subtotal + impuesto };
}
