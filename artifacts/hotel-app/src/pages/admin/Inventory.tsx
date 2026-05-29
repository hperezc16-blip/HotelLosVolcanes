import { useEffect, useState } from "react";
import { axiosInstance } from "@/lib/axios-client";
import { useToast } from "@/hooks/use-toast";
import { Bed, CheckCircle, Clock, Wrench, Sparkles, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

type RoomInv = { id: string; nombre: string; tipo: string; precioNoche: string; capacidad: number; estadoOcupacion: string; amenidades?: string | null };
type InventoryData = { inventory: RoomInv[]; todayArrivals: number; todayDepartures: number };

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: React.ElementType; bg: string }> = {
  disponible: { label: "Disponible", color: "text-green-700", bg: "bg-green-50 border-green-200", icon: CheckCircle },
  ocupada:    { label: "Ocupada",    color: "text-red-700",   bg: "bg-red-50 border-red-200",     icon: Bed },
  limpieza:   { label: "En Limpieza", color: "text-blue-700", bg: "bg-blue-50 border-blue-200",   icon: Sparkles },
  mantenimiento: { label: "Mantenimiento", color: "text-amber-700", bg: "bg-amber-50 border-amber-200", icon: Wrench },
};
const TIPO_LABEL: Record<string, string> = { sencilla: "Sencilla", doble: "Doble", suite: "Suite", cabana: "Cabaña" };
const TIPO_COLOR: Record<string, string> = { sencilla: "bg-blue-100 text-blue-700", doble: "bg-purple-100 text-purple-700", suite: "bg-amber-100 text-amber-700", cabana: "bg-green-100 text-green-700" };

export default function Inventory() {
  const [data, setData] = useState<InventoryData | null>(null);
  const [manualStatus, setManualStatus] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    axiosInstance.get("/admin/inventory")
      .then(r => { setData(r.data); setLoading(false); })
      .catch(() => setLoading(false));
    const saved = localStorage.getItem("room_status_overrides");
    if (saved) setManualStatus(JSON.parse(saved));
  }, []);

  const setRoomStatus = (roomId: string, status: string) => {
    const updated = { ...manualStatus, [roomId]: status };
    setManualStatus(updated);
    localStorage.setItem("room_status_overrides", JSON.stringify(updated));
    toast({ title: `Estado actualizado: ${STATUS_CONFIG[status]?.label}` });
  };

  const getEffectiveStatus = (room: RoomInv) => {
    if (manualStatus[room.id] && manualStatus[room.id] !== "disponible") return manualStatus[room.id];
    return room.estadoOcupacion;
  };

  if (loading) return <div className="animate-pulse space-y-6"><div className="h-8 w-48 bg-muted" /><div className="grid grid-cols-2 lg:grid-cols-4 gap-4">{[1,2,3,4].map(i=><div key={i} className="h-40 bg-card border" />)}</div></div>;
  if (!data) return <p className="text-muted-foreground">No se pudo cargar el inventario.</p>;

  const rooms = data.inventory;
  const counts = Object.keys(STATUS_CONFIG).map(k => ({ key: k, count: rooms.filter(r => getEffectiveStatus(r) === k).length }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-serif font-bold text-foreground">Inventario de Habitaciones</h1>
        <p className="text-muted-foreground mt-1">Estado actual de cada habitación en tiempo real</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {counts.map(({ key, count }) => {
          const cfg = STATUS_CONFIG[key];
          const Icon = cfg.icon;
          return (
            <div key={key} className={`p-4 border rounded-lg ${cfg.bg}`}>
              <div className="flex items-center gap-2 mb-1">
                <Icon className={`h-4 w-4 ${cfg.color}`} />
                <span className={`text-xs font-semibold uppercase ${cfg.color}`}>{cfg.label}</span>
              </div>
              <p className={`text-3xl font-bold ${cfg.color}`}>{count}</p>
            </div>
          );
        })}
      </div>

      <div className="flex gap-4 text-sm text-muted-foreground bg-muted/50 border rounded p-3">
        <span>📅 Llegadas hoy: <strong className="text-foreground">{data.todayArrivals}</strong></span>
        <span>|</span>
        <span>🚪 Salidas hoy: <strong className="text-foreground">{data.todayDepartures}</strong></span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {rooms.map(room => {
          const status = getEffectiveStatus(room);
          const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.disponible;
          const Icon = cfg.icon;
          return (
            <div key={room.id} className={`bg-card border-2 rounded-lg p-4 shadow-sm ${cfg.bg}`}>
              <div className="flex items-start justify-between mb-3">
                <div>
                  <span className={`inline-block text-xs px-2 py-0.5 rounded-full font-medium mb-1 ${TIPO_COLOR[room.tipo]}`}>
                    {TIPO_LABEL[room.tipo] || room.tipo}
                  </span>
                  <h3 className="font-semibold text-sm text-foreground leading-tight">{room.nombre}</h3>
                </div>
                <div className={`p-1.5 rounded-full ${cfg.bg}`}>
                  <Icon className={`h-4 w-4 ${cfg.color}`} />
                </div>
              </div>

              <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                <span className="flex items-center gap-1"><Users className="h-3 w-3" /> {room.capacidad} pax</span>
                <span>Q{parseFloat(room.precioNoche).toFixed(0)}/noche</span>
              </div>

              <div className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full font-semibold mb-3 ${cfg.color} ${cfg.bg} border`}>
                <Icon className="h-3 w-3" /> {cfg.label}
              </div>

              {status !== "ocupada" && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {Object.entries(STATUS_CONFIG).filter(([k]) => k !== "ocupada" && k !== status).map(([k, c]) => (
                    <Button key={k} size="sm" variant="outline" onClick={() => setRoomStatus(room.id, k)}
                      className="h-6 px-2 text-xs">
                      {c.label}
                    </Button>
                  ))}
                  {manualStatus[room.id] && manualStatus[room.id] !== "disponible" && (
                    <Button size="sm" variant="outline" onClick={() => setRoomStatus(room.id, "disponible")}
                      className="h-6 px-2 text-xs text-green-700 border-green-300">
                      ✓ Disponible
                    </Button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
