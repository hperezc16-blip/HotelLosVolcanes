import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { axiosInstance } from "@/lib/axios-client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Mail, Phone, Lock, Save, CalendarCheck } from "lucide-react";
import { useLocation } from "wouter";

export default function Profile() {
  const { user, updateUser } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ nombre: user?.nombre || "", telefono: user?.telefono || "" });
  const [passForm, setPassForm] = useState({ actual: "", nueva: "", confirmar: "" });

  if (!user) { setLocation("/login"); return null; }

  const saveProfile = async () => {
    if (!form.nombre.trim()) { toast({ variant: "destructive", title: "El nombre es requerido" }); return; }
    setSaving(true);
    try {
      const { data } = await axiosInstance.patch("/auth/profile", { nombre: form.nombre, telefono: form.telefono });
      updateUser(data);
      toast({ title: "Perfil actualizado correctamente" });
    } catch (e: any) {
      toast({ variant: "destructive", title: "Error", description: e.response?.data?.message || "No se pudo actualizar" });
    } finally { setSaving(false); }
  };

  const savePassword = async () => {
    if (!passForm.actual || !passForm.nueva || !passForm.confirmar) {
      toast({ variant: "destructive", title: "Completa todos los campos de contraseña" }); return;
    }
    if (passForm.nueva !== passForm.confirmar) {
      toast({ variant: "destructive", title: "Las contraseñas no coinciden" }); return;
    }
    if (passForm.nueva.length < 8) {
      toast({ variant: "destructive", title: "La nueva contraseña debe tener al menos 8 caracteres" }); return;
    }
    setSaving(true);
    try {
      await axiosInstance.patch("/auth/profile", { passwordActual: passForm.actual, passwordNueva: passForm.nueva });
      toast({ title: "Contraseña actualizada" });
      setPassForm({ actual: "", nueva: "", confirmar: "" });
    } catch (e: any) {
      toast({ variant: "destructive", title: "Error", description: e.response?.data?.message || "Contraseña actual incorrecta" });
    } finally { setSaving(false); }
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-2xl">
      <h1 className="font-serif text-3xl font-bold mb-8">Mi Perfil</h1>

      <div className="flex items-center gap-4 mb-8 bg-card border p-6 shadow-sm">
        <div className="w-16 h-16 rounded-full bg-primary text-white flex items-center justify-center text-2xl font-bold shrink-0">
          {user.nombre.charAt(0).toUpperCase()}
        </div>
        <div>
          <h2 className="font-semibold text-xl">{user.nombre}</h2>
          <p className="text-muted-foreground text-sm">{user.email}</p>
          <span className={`inline-block text-xs mt-1 px-2 py-0.5 rounded-full font-medium ${user.rol === "admin" ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"}`}>
            {user.rol === "admin" ? "Administrador" : "Cliente"}
          </span>
        </div>
      </div>

      <div className="space-y-6">
        {/* Datos personales */}
        <div className="bg-card border shadow-sm p-6">
          <h2 className="font-semibold text-lg mb-5 flex items-center gap-2"><User className="h-5 w-5 text-primary" /> Datos Personales</h2>
          <div className="space-y-4">
            <div className="space-y-1">
              <Label className="text-xs uppercase tracking-wider text-muted-foreground">Nombre completo</Label>
              <Input value={form.nombre} onChange={e => setForm(f => ({ ...f, nombre: e.target.value }))} placeholder="Tu nombre completo" />
            </div>
            <div className="space-y-1">
              <Label className="text-xs uppercase tracking-wider text-muted-foreground">Correo electrónico</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input value={user.email} disabled className="pl-9 bg-muted/50 cursor-not-allowed" />
              </div>
              <p className="text-xs text-muted-foreground">El correo no puede modificarse</p>
            </div>
            <div className="space-y-1">
              <Label className="text-xs uppercase tracking-wider text-muted-foreground">Teléfono</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input value={form.telefono} onChange={e => setForm(f => ({ ...f, telefono: e.target.value }))} placeholder="+502 0000 0000" className="pl-9" />
              </div>
            </div>
            <Button onClick={saveProfile} disabled={saving} className="gap-2 bg-primary text-white">
              <Save className="h-4 w-4" /> Guardar Cambios
            </Button>
          </div>
        </div>

        {/* Cambiar contraseña */}
        <div className="bg-card border shadow-sm p-6">
          <h2 className="font-semibold text-lg mb-5 flex items-center gap-2"><Lock className="h-5 w-5 text-primary" /> Cambiar Contraseña</h2>
          <div className="space-y-4">
            <div className="space-y-1">
              <Label className="text-xs uppercase tracking-wider text-muted-foreground">Contraseña actual</Label>
              <Input type="password" value={passForm.actual} onChange={e => setPassForm(f => ({ ...f, actual: e.target.value }))} placeholder="••••••••" />
            </div>
            <div className="space-y-1">
              <Label className="text-xs uppercase tracking-wider text-muted-foreground">Nueva contraseña</Label>
              <Input type="password" value={passForm.nueva} onChange={e => setPassForm(f => ({ ...f, nueva: e.target.value }))} placeholder="Mínimo 8 caracteres" />
            </div>
            <div className="space-y-1">
              <Label className="text-xs uppercase tracking-wider text-muted-foreground">Confirmar nueva contraseña</Label>
              <Input type="password" value={passForm.confirmar} onChange={e => setPassForm(f => ({ ...f, confirmar: e.target.value }))} placeholder="Repite la contraseña" />
            </div>
            <Button onClick={savePassword} disabled={saving} variant="outline" className="gap-2">
              <Lock className="h-4 w-4" /> Actualizar Contraseña
            </Button>
          </div>
        </div>

        <Button variant="outline" className="w-full gap-2" onClick={() => setLocation("/my-reservations")}>
          <CalendarCheck className="h-4 w-4" /> Ver Mis Reservaciones
        </Button>
      </div>
    </div>
  );
}
