import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { axiosInstance } from "@/lib/axios-client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle2, ArrowLeft, Lock } from "lucide-react";

export default function ResetPassword() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [token, setToken] = useState("");
  const [form, setForm] = useState({ nueva: "", confirmar: "" });
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const t = params.get("token");
    if (t) setToken(t);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) { toast({ variant: "destructive", title: "Token de recuperación requerido" }); return; }
    if (!form.nueva || !form.confirmar) { toast({ variant: "destructive", title: "Completa todos los campos" }); return; }
    if (form.nueva !== form.confirmar) { toast({ variant: "destructive", title: "Las contraseñas no coinciden" }); return; }
    if (form.nueva.length < 8) { toast({ variant: "destructive", title: "Mínimo 8 caracteres" }); return; }
    setLoading(true);
    try {
      await axiosInstance.post("/auth/reset-password", { token, nuevaPassword: form.nueva });
      setDone(true);
      toast({ title: "Contraseña actualizada correctamente" });
    } catch (e: any) {
      toast({ variant: "destructive", title: "Error", description: e.response?.data?.message || "Token inválido o expirado" });
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <div className="flex-1 flex items-center justify-center py-12 px-4 bg-muted/30">
        <div className="max-w-md w-full bg-card border p-8 shadow-sm text-center">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="font-serif text-2xl font-bold mb-2">Contraseña actualizada</h2>
          <p className="text-muted-foreground text-sm mb-6">Su contraseña fue cambiada exitosamente. Ya puede iniciar sesión.</p>
          <Button onClick={() => setLocation("/login")} className="bg-primary text-white w-full">
            Ir a Iniciar Sesión
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex items-center justify-center py-12 px-4 bg-muted/30">
      <div className="max-w-md w-full bg-card border p-8 shadow-sm">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <Lock className="h-7 w-7 text-primary" />
          </div>
          <h1 className="font-serif text-3xl font-bold text-foreground mb-2">Nueva Contraseña</h1>
          <p className="text-muted-foreground text-sm">Ingrese y confirme su nueva contraseña</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label className="text-xs uppercase tracking-wider text-muted-foreground">Token de recuperación</Label>
            <Input
              value={token}
              onChange={e => setToken(e.target.value)}
              placeholder="Pegue el código recibido"
              className="font-mono text-sm"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-xs uppercase tracking-wider text-muted-foreground">Nueva contraseña</Label>
            <Input
              type="password"
              value={form.nueva}
              onChange={e => setForm(f => ({ ...f, nueva: e.target.value }))}
              placeholder="Mínimo 8 caracteres"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-xs uppercase tracking-wider text-muted-foreground">Confirmar contraseña</Label>
            <Input
              type="password"
              value={form.confirmar}
              onChange={e => setForm(f => ({ ...f, confirmar: e.target.value }))}
              placeholder="Repita la contraseña"
            />
          </div>
          <Button type="submit" disabled={loading} className="w-full bg-primary text-white">
            {loading ? "Actualizando..." : "Cambiar Contraseña"}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <Link href="/login" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors">
            <ArrowLeft className="h-3 w-3" /> Volver al inicio de sesión
          </Link>
        </div>
      </div>
    </div>
  );
}
