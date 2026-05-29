import { useEffect, useState } from "react";
import { axiosInstance } from "@/lib/axios-client";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import { DollarSign, CheckCircle, XCircle, Clock, TrendingUp } from "lucide-react";

const COLORS = ["#c0614a", "#6366f1", "#f59e0b", "#10b981"];
const TIPO_LABEL: Record<string, string> = { sencilla: "Sencilla", doble: "Doble", suite: "Suite", cabana: "Cabaña" };

export default function Reports() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosInstance.get("/admin/reports").then(r => { setData(r.data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="animate-pulse space-y-6"><div className="h-8 w-48 bg-muted" /><div className="h-80 bg-card border" /></div>;
  if (!data) return <p className="text-muted-foreground">No se pudieron cargar los reportes.</p>;

  const stats = [
    { label: "Ingresos Totales", value: `Q${data.totalIngresos.toLocaleString("es-GT", { minimumFractionDigits: 2 })}`, icon: DollarSign, color: "text-emerald-600 bg-emerald-100" },
    { label: "Reservas Pagadas", value: data.pagadas, icon: CheckCircle, color: "text-green-600 bg-green-100" },
    { label: "Pendientes de Pago", value: data.pendientesPago, icon: Clock, color: "text-amber-600 bg-amber-100" },
    { label: "Cancelaciones", value: data.canceladas, icon: XCircle, color: "text-red-600 bg-red-100" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-serif font-bold text-foreground">Reportes y Estadísticas</h1>
        <p className="text-muted-foreground mt-1">Análisis de ingresos, reservaciones y ocupación</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => {
          const Icon = s.icon;
          return (
            <div key={i} className="bg-card border p-5 shadow-sm">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-3 ${s.color}`}>
                <Icon className="h-5 w-5" />
              </div>
              <p className="text-xs uppercase tracking-wider text-muted-foreground">{s.label}</p>
              <p className="text-2xl font-bold mt-1">{s.value}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-card border shadow-sm p-6">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="h-5 w-5 text-primary" />
            <h2 className="font-semibold text-lg">Ingresos Mensuales (últimos 6 meses)</h2>
          </div>
          {data.ingresosMensuales.length === 0 ? (
            <div className="h-64 flex items-center justify-center text-muted-foreground">Sin datos suficientes</div>
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={data.ingresosMensuales}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="mes" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} tickFormatter={v => `Q${(v/1000).toFixed(0)}k`} />
                <Tooltip formatter={(v: number) => [`Q${v.toLocaleString("es-GT", { minimumFractionDigits: 2 })}`, "Ingresos"]} />
                <Bar dataKey="ingresos" fill="#c0614a" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="bg-card border shadow-sm p-6">
          <h2 className="font-semibold text-lg mb-6">Reservas por Tipo de Habitación</h2>
          {data.porTipoHabitacion.length === 0 ? (
            <div className="h-64 flex items-center justify-center text-muted-foreground">Sin datos</div>
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie data={data.porTipoHabitacion} dataKey="value" nameKey="tipo" cx="50%" cy="50%" outerRadius={90} label={({ tipo, percent }) => `${TIPO_LABEL[tipo] || tipo} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                  {data.porTipoHabitacion.map((_: any, i: number) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Legend formatter={(v) => TIPO_LABEL[v] || v} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      <div className="bg-card border shadow-sm p-6">
        <h2 className="font-semibold text-lg mb-4">Reservas por Mes</h2>
        {data.ingresosMensuales.length === 0 ? (
          <p className="text-muted-foreground text-sm">Sin datos suficientes</p>
        ) : (
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={data.ingresosMensuales}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="mes" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="reservas" fill="#6366f1" radius={[4, 4, 0, 0]} name="Reservas" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
