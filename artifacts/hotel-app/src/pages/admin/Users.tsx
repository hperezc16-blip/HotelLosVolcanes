import { useEffect, useState } from "react";
import { axiosInstance } from "@/lib/axios-client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Users, Search, ShieldCheck, UserX, UserCheck, Mail, Phone } from "lucide-react";
import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";

type UserRow = { id: string; nombre: string; email: string; rol: string; telefono?: string | null; activo: boolean; createdAt: string };

export default function AdminUsers() {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [toggling, setToggling] = useState<string | null>(null);
  const { toast } = useToast();

  const load = () => axiosInstance.get("/admin/users").then(r => { setUsers(r.data); setLoading(false); }).catch(() => setLoading(false));

  useEffect(() => { load(); }, []);

  const toggle = async (user: UserRow) => {
    setToggling(user.id);
    try {
      await axiosInstance.patch(`/admin/users/${user.id}`, { activo: !user.activo });
      toast({ title: user.activo ? "Usuario desactivado" : "Usuario activado" });
      load();
    } catch (e: any) {
      toast({ variant: "destructive", title: "Error", description: e.response?.data?.message || "No se pudo actualizar" });
    } finally {
      setToggling(null);
    }
  };

  const filtered = users.filter(u => {
    const q = search.toLowerCase();
    return !q || u.nombre.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
  });

  const clientes = users.filter(u => u.rol === "cliente").length;
  const activos = users.filter(u => u.activo).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-serif font-bold text-foreground">Gestión de Usuarios</h1>
        <p className="text-muted-foreground mt-1">Administra cuentas de clientes y administradores</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Total Usuarios", value: users.length, icon: Users, color: "text-blue-600 bg-blue-100" },
          { label: "Clientes", value: clientes, icon: UserCheck, color: "text-green-600 bg-green-100" },
          { label: "Activos", value: activos, icon: ShieldCheck, color: "text-emerald-600 bg-emerald-100" },
        ].map((s, i) => {
          const Icon = s.icon;
          return (
            <div key={i} className="bg-card border p-5 shadow-sm flex items-center gap-4">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${s.color}`}>
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-muted-foreground">{s.label}</p>
                <p className="text-2xl font-bold">{s.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Buscar por nombre o email..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2 text-sm border rounded bg-card focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
      </div>

      {loading ? (
        <div className="space-y-3">{[1,2,3,4].map(i => <div key={i} className="h-16 bg-card border animate-pulse rounded" />)}</div>
      ) : (
        <div className="bg-card border shadow-sm rounded overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 border-b text-xs text-muted-foreground uppercase tracking-wide">
                <tr>
                  <th className="px-4 py-3 text-left">Usuario</th>
                  <th className="px-4 py-3 text-left">Contacto</th>
                  <th className="px-4 py-3 text-left">Rol</th>
                  <th className="px-4 py-3 text-left">Registro</th>
                  <th className="px-4 py-3 text-left">Estado</th>
                  <th className="px-4 py-3 text-center">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filtered.map(u => (
                  <tr key={u.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-sm font-bold shrink-0">
                          {u.nombre.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-medium">{u.nombre}</div>
                          <div className="text-xs text-muted-foreground font-mono">{u.id.slice(0, 8).toUpperCase()}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1"><Mail className="h-3 w-3" />{u.email}</div>
                      {u.telefono && <div className="flex items-center gap-1 text-xs text-muted-foreground"><Phone className="h-3 w-3" />{u.telefono}</div>}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-block text-xs px-2 py-1 rounded-full font-medium ${u.rol === "admin" ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"}`}>
                        {u.rol === "admin" ? "Administrador" : "Cliente"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">
                      {format(parseISO(u.createdAt), "dd MMM yyyy", { locale: es })}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full font-medium ${u.activo ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                        {u.activo ? <UserCheck className="h-3 w-3" /> : <UserX className="h-3 w-3" />}
                        {u.activo ? "Activo" : "Inactivo"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      {u.rol !== "admin" && (
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={toggling === u.id}
                          onClick={() => toggle(u)}
                          className={`h-7 px-3 text-xs ${u.activo ? "text-red-600 border-red-300 hover:bg-red-50" : "text-green-600 border-green-300 hover:bg-green-50"}`}
                        >
                          {u.activo ? "Desactivar" : "Activar"}
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr><td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">No hay usuarios que coincidan</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
