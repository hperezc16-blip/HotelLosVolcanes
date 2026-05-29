import { useEffect, useState } from "react";
import { axiosInstance } from "@/lib/axios-client";
import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import { LogIn, LogOut, Bed, User, Clock, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

type ResEnriched = {
  id: string; fechaEntrada: string; fechaSalida: string;
  precioTotal: string; estado: string; estadoPago: string; notas?: string | null;
  room: { nombre: string; tipo: string } | null;
  cliente: { nombre: string; email: string; telefono?: string | null } | null;
};

async function patchReservation(id: string, body: Record<string, string>) {
  const res = await axiosInstance.patch(`/reservations/${id}`, body);
  return res.data;
}

function ResCard({ res, type, onAction }: { res: ResEnriched; type: "arrival" | "departure"; onAction: () => void }) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const isCompleted = res.estado === "completada";

  const handle = async () => {
    setLoading(true);
    try {
      const body = type === "arrival"
        ? { estado: "confirmada" }
        : { estado: "completada" };
      await patchReservation(res.id, body);
      toast({ title: type === "arrival" ? "Check-in registrado" : "Check-out registrado" });
      onAction();
    } catch (e: any) {
      toast({ variant: "destructive", title: "Error", description: e.response?.data?.message || "No se pudo actualizar" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`bg-card border rounded-lg p-4 shadow-sm ${isCompleted && type === "departure" ? "opacity-60" : ""}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span className="font-mono text-xs text-muted-foreground">#{res.id.slice(0, 8).toUpperCase()}</span>
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
              res.estado === "confirmada" ? "bg-green-100 text-green-700" :
              res.estado === "completada" ? "bg-blue-100 text-blue-700" :
              "bg-yellow-100 text-yellow-700"
            }`}>{res.estado}</span>
          </div>
          <div className="flex items-center gap-2 mb-1">
            <User className="h-4 w-4 text-primary shrink-0" />
            <span className="font-semibold text-sm truncate">{res.cliente?.nombre}</span>
          </div>
          {res.cliente?.telefono && <p className="text-xs text-muted-foreground ml-6">{res.cliente.telefono}</p>}
          <div className="flex items-center gap-2 mt-2">
            <Bed className="h-4 w-4 text-muted-foreground shrink-0" />
            <span className="text-sm text-muted-foreground truncate">{res.room?.nombre}</span>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <Clock className="h-4 w-4 text-muted-foreground shrink-0" />
            <span className="text-xs text-muted-foreground">
              {type === "arrival" ? "Check-in: 3:00 PM" : "Check-out: 12:00 PM"}
            </span>
          </div>
          <p className="text-sm font-semibold text-primary mt-2">Q{parseFloat(res.precioTotal).toLocaleString("es-GT", { minimumFractionDigits: 2 })}</p>
        </div>

        <div className="shrink-0">
          {!isCompleted || type === "arrival" ? (
            <Button size="sm" onClick={handle} disabled={loading}
              className={`gap-1 text-xs ${type === "arrival" ? "bg-green-600 hover:bg-green-700 text-white" : "bg-blue-600 hover:bg-blue-700 text-white"}`}>
              {type === "arrival" ? <LogIn className="h-3 w-3" /> : <LogOut className="h-3 w-3" />}
              {type === "arrival" ? "Check-in" : "Check-out"}
            </Button>
          ) : (
            <span className="flex items-center gap-1 text-xs text-blue-600 font-medium">
              <CheckCircle2 className="h-4 w-4" /> Completado
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default function CheckInOut() {
  const [data, setData] = useState<{ arrivals: ResEnriched[]; departures: ResEnriched[]; fecha: string } | null>(null);
  const [loading, setLoading] = useState(true);

  const load = () => {
    axiosInstance.get("/admin/checkinout")
      .then(r => { setData(r.data); setLoading(false); })
      .catch(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  if (loading) return <div className="animate-pulse space-y-6"><div className="h-8 w-64 bg-muted" /></div>;

  const today = data?.fecha ? format(parseISO(data.fecha), "EEEE d 'de' MMMM yyyy", { locale: es }) : "";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-serif font-bold text-foreground">Check-in / Check-out</h1>
        <p className="text-muted-foreground mt-1 capitalize">{today}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* LLEGADAS */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-green-100 rounded-lg"><LogIn className="h-5 w-5 text-green-600" /></div>
            <div>
              <h2 className="font-semibold text-lg">Llegadas de Hoy</h2>
              <p className="text-xs text-muted-foreground">{data?.arrivals.length || 0} huéspedes esperados</p>
            </div>
          </div>
          {data?.arrivals.length === 0 ? (
            <div className="bg-card border rounded-lg p-8 text-center text-muted-foreground text-sm">
              No hay llegadas programadas para hoy
            </div>
          ) : (
            <div className="space-y-3">
              {data?.arrivals.map(r => <ResCard key={r.id} res={r} type="arrival" onAction={load} />)}
            </div>
          )}
        </div>

        {/* SALIDAS */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-100 rounded-lg"><LogOut className="h-5 w-5 text-blue-600" /></div>
            <div>
              <h2 className="font-semibold text-lg">Salidas de Hoy</h2>
              <p className="text-xs text-muted-foreground">{data?.departures.length || 0} huéspedes por salir</p>
            </div>
          </div>
          {data?.departures.length === 0 ? (
            <div className="bg-card border rounded-lg p-8 text-center text-muted-foreground text-sm">
              No hay salidas programadas para hoy
            </div>
          ) : (
            <div className="space-y-3">
              {data?.departures.map(r => <ResCard key={r.id} res={r} type="departure" onAction={load} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
