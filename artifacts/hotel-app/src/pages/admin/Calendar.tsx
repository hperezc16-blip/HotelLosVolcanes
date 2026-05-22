import { useState, useEffect } from "react";
import { format, addDays, startOfWeek, addWeeks, subWeeks, differenceInDays, parseISO, isWithinInterval } from "date-fns";
import { es } from "date-fns/locale";
import { ChevronLeft, ChevronRight, CalendarDays, Bed, CheckCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

const TIPO_COLOR: Record<string, string> = {
  sencilla: "bg-blue-100 text-blue-800 border-blue-300",
  doble: "bg-purple-100 text-purple-800 border-purple-300",
  suite: "bg-amber-100 text-amber-800 border-amber-300",
  cabana: "bg-green-100 text-green-800 border-green-300",
};

const ESTADO_COLOR: Record<string, string> = {
  pendiente: "bg-yellow-400",
  confirmada: "bg-primary",
  completada: "bg-blue-500",
};

interface Room {
  id: string;
  nombre: string;
  tipo: string;
  precioNoche: string;
}

interface CalReservation {
  id: string;
  habitacionId: string;
  fechaEntrada: string;
  fechaSalida: string;
  estado: string;
  estadoPago: string;
  precioTotal: string;
  cliente: { nombre: string; email: string };
}

function addLocalDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function toLocalDate(dateStr: string): Date {
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export default function Calendar() {
  const [weekStart, setWeekStart] = useState(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dow = today.getDay();
    const diff = dow === 0 ? -6 : 1 - dow;
    const mon = new Date(today);
    mon.setDate(today.getDate() + diff);
    return mon;
  });
  const [calData, setCalData] = useState<{ rooms: Room[]; reservations: CalReservation[] } | null>(null);
  const [loading, setLoading] = useState(true);
  const [tooltip, setTooltip] = useState<{ res: CalReservation; x: number; y: number } | null>(null);

  const DAYS = 14;
  const days = Array.from({ length: DAYS }, (_, i) => addLocalDays(weekStart, i));
  const desde = format(days[0], "yyyy-MM-dd");
  const hasta = format(days[DAYS - 1], "yyyy-MM-dd");

  useEffect(() => {
    const token = localStorage.getItem("hotel_token");
    setLoading(true);
    fetch(`/api/admin/calendar?desde=${desde}&hasta=${hasta}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => {
        setCalData(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [desde, hasta]);

  const getReservationForCell = (roomId: string, day: Date) => {
    if (!calData) return null;
    return calData.reservations.find((r) => {
      if (r.habitacionId !== roomId) return false;
      const entrada = toLocalDate(r.fechaEntrada);
      const salida = toLocalDate(r.fechaSalida);
      const dayStr = format(day, "yyyy-MM-dd");
      return r.fechaEntrada <= dayStr && r.fechaSalida > dayStr;
    }) || null;
  };

  const getCellSpan = (roomId: string, day: Date) => {
    if (!calData) return null;
    const res = calData.reservations.find((r) => {
      if (r.habitacionId !== roomId) return false;
      return format(day, "yyyy-MM-dd") === r.fechaEntrada;
    });
    if (!res) return null;
    const entrada = toLocalDate(res.fechaEntrada);
    const salida = toLocalDate(res.fechaSalida);
    const visibleStart = days[0] <= entrada ? entrada : days[0];
    const visibleEnd = salida <= addLocalDays(days[DAYS - 1], 1) ? salida : addLocalDays(days[DAYS - 1], 1);
    const startIndex = days.findIndex(d => format(d, "yyyy-MM-dd") === format(visibleStart, "yyyy-MM-dd"));
    const nights = Math.round((visibleEnd.getTime() - visibleStart.getTime()) / 86400000);
    return { res, startIndex, nights };
  };

  const todayStr = format(new Date(), "yyyy-MM-dd");
  const rooms = calData?.rooms || [];
  const reservations = calData?.reservations || [];

  const totalOccupied = new Set(
    reservations
      .filter(r => r.estado !== "cancelada" && r.fechaEntrada <= todayStr && r.fechaSalida > todayStr)
      .map(r => r.habitacionId)
  ).size;
  const totalRooms = rooms.length;
  const available = totalRooms - totalOccupied;

  return (
    <div onClick={() => setTooltip(null)}>
      <div className="mb-6 flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-foreground flex items-center gap-2">
            <CalendarDays className="h-7 w-7 text-primary" />
            Calendario de Ocupación
          </h1>
          <p className="text-muted-foreground mt-1">Vista de 2 semanas — haga click en una reservación para ver detalles</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-sm bg-card border px-4 py-2">
            <Bed className="h-4 w-4 text-primary" />
            <span><strong>{totalOccupied}</strong> ocupadas</span>
            <span className="text-muted-foreground">/</span>
            <span><strong className="text-green-600">{available}</strong> disponibles</span>
            <span className="text-muted-foreground">/ {totalRooms} total</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 mb-4">
        <Button variant="outline" size="sm" onClick={() => setWeekStart(w => addLocalDays(w, -14))} className="gap-1">
          <ChevronLeft className="h-4 w-4" /> Anterior
        </Button>
        <span className="font-medium text-sm">
          {format(days[0], "d MMM", { locale: es })} – {format(days[DAYS - 1], "d MMM yyyy", { locale: es })}
        </span>
        <Button variant="outline" size="sm" onClick={() => setWeekStart(w => addLocalDays(w, 14))} className="gap-1">
          Siguiente <ChevronRight className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm" onClick={() => {
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          const dow = today.getDay();
          const diff = dow === 0 ? -6 : 1 - dow;
          const mon = new Date(today);
          mon.setDate(today.getDate() + diff);
          setWeekStart(mon);
        }}>
          Hoy
        </Button>
      </div>

      <div className="flex gap-3 mb-4 text-xs">
        <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm bg-yellow-400"></div> Pendiente</div>
        <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm bg-primary"></div> Confirmada</div>
        <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm bg-blue-500"></div> Completada</div>
        <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm bg-muted border"></div> Disponible</div>
      </div>

      {loading ? (
        <div className="bg-card border p-12 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-3" />
          <p className="text-muted-foreground text-sm">Cargando calendario...</p>
        </div>
      ) : (
        <div className="bg-card border shadow-sm overflow-x-auto">
          <table className="w-full border-collapse text-xs min-w-[800px]">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="text-left px-4 py-3 w-40 font-semibold text-muted-foreground uppercase tracking-wide sticky left-0 bg-muted/50 z-10">Habitación</th>
                {days.map((day) => {
                  const isToday = format(day, "yyyy-MM-dd") === todayStr;
                  const isWeekend = day.getDay() === 0 || day.getDay() === 6;
                  return (
                    <th key={format(day, "yyyy-MM-dd")} className={`text-center py-2 px-1 min-w-[52px] font-medium ${isToday ? "bg-primary/10 text-primary" : isWeekend ? "text-muted-foreground/70" : "text-muted-foreground"}`}>
                      <div className="uppercase text-[10px]">{format(day, "EEE", { locale: es })}</div>
                      <div className={`text-sm font-bold ${isToday ? "bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center mx-auto" : ""}`}>
                        {format(day, "d")}
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody className="divide-y">
              {rooms.length === 0 ? (
                <tr><td colSpan={DAYS + 1} className="text-center py-12 text-muted-foreground">No hay habitaciones disponibles</td></tr>
              ) : rooms.map((room) => (
                <tr key={room.id} className="hover:bg-muted/20 group">
                  <td className="px-4 py-2 sticky left-0 bg-card group-hover:bg-muted/20 z-10 border-r">
                    <div className="font-medium text-foreground truncate max-w-[130px]">{room.nombre}</div>
                    <span className={`inline-block mt-0.5 text-[10px] px-1.5 py-0.5 border rounded-full ${TIPO_COLOR[room.tipo] || "bg-gray-100 text-gray-700"}`}>
                      {room.tipo}
                    </span>
                  </td>
                  {days.map((day) => {
                    const dayStr = format(day, "yyyy-MM-dd");
                    const isStart = calData?.reservations.some(r => r.habitacionId === room.id && r.fechaEntrada === dayStr);
                    const res = getReservationForCell(room.id, day);
                    const isToday = dayStr === todayStr;
                    const isWeekend = day.getDay() === 0 || day.getDay() === 6;

                    if (isStart) {
                      const info = getCellSpan(room.id, day);
                      if (info) {
                        const visibleNights = Math.min(info.nights, DAYS - info.startIndex);
                        return (
                          <td
                            key={dayStr}
                            colSpan={visibleNights}
                            className="py-1.5 px-0.5 cursor-pointer"
                            onClick={(e) => {
                              e.stopPropagation();
                              setTooltip({ res: info.res, x: e.clientX, y: e.clientY });
                            }}
                          >
                            <div className={`h-8 ${ESTADO_COLOR[info.res.estado] || "bg-gray-400"} rounded text-white flex items-center px-2 gap-1 truncate shadow-sm hover:opacity-90 transition-opacity`}>
                              <span className="truncate font-medium">{info.res.cliente.nombre.split(" ")[0]}</span>
                              {info.res.estadoPago === "anticipo" && <span className="text-[9px] bg-white/30 px-1 rounded-full shrink-0">Anti.</span>}
                              {info.res.estadoPago === "pagado" && <CheckCircle className="h-3 w-3 shrink-0" />}
                            </div>
                          </td>
                        );
                      }
                    }

                    if (!isStart && res) return null;

                    return (
                      <td key={dayStr} className={`py-1.5 px-0.5 ${isToday ? "bg-primary/5" : isWeekend ? "bg-muted/30" : ""}`}>
                        <div className="h-8 rounded border border-dashed border-muted-foreground/20 bg-green-50/50" />
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tooltip && (
        <div
          className="fixed z-50 bg-card border shadow-xl rounded-lg p-4 text-sm w-64"
          style={{ left: Math.min(tooltip.x + 10, window.innerWidth - 280), top: Math.min(tooltip.y + 10, window.innerHeight - 200) }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-2">
            <span className={`text-xs px-2 py-0.5 rounded-full border font-semibold ${
              tooltip.res.estado === "confirmada" ? "bg-green-100 text-green-800 border-green-300" :
              tooltip.res.estado === "pendiente" ? "bg-yellow-100 text-yellow-800 border-yellow-300" :
              tooltip.res.estado === "completada" ? "bg-blue-100 text-blue-800 border-blue-300" :
              "bg-gray-100 text-gray-800 border-gray-300"
            }`}>{tooltip.res.estado}</span>
            <span className={`text-xs px-2 py-0.5 rounded-full ${
              tooltip.res.estadoPago === "pagado" ? "bg-green-100 text-green-700" :
              tooltip.res.estadoPago === "anticipo" ? "bg-amber-100 text-amber-700" :
              "bg-gray-100 text-gray-700"
            }`}>
              Pago: {tooltip.res.estadoPago}
            </span>
          </div>
          <p className="font-semibold text-foreground">{tooltip.res.cliente.nombre}</p>
          <p className="text-muted-foreground text-xs">{tooltip.res.cliente.email}</p>
          <div className="mt-2 pt-2 border-t text-xs space-y-1 text-muted-foreground">
            <div className="flex justify-between"><span>Entrada:</span><span className="font-medium text-foreground">{format(toLocalDate(tooltip.res.fechaEntrada), "dd/MM/yyyy")}</span></div>
            <div className="flex justify-between"><span>Salida:</span><span className="font-medium text-foreground">{format(toLocalDate(tooltip.res.fechaSalida), "dd/MM/yyyy")}</span></div>
            <div className="flex justify-between"><span>Total:</span><span className="font-semibold text-foreground">Q{parseFloat(tooltip.res.precioTotal).toLocaleString("es-GT", { minimumFractionDigits: 2 })}</span></div>
          </div>
        </div>
      )}
    </div>
  );
}
