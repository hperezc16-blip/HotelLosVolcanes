import { useState } from "react";
import { Link } from "wouter";
import { axiosInstance } from "@/lib/axios-client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, ArrowLeft, KeyRound } from "lucide-react";

export default function ForgotPassword() {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ token?: string; note?: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) { toast({ variant: "destructive", title: "Ingrese su correo electrónico" }); return; }
    setLoading(true);
    try {
      const { data } = await axiosInstance.post("/auth/forgot-password", { email });
      setResult(data);
      toast({ title: "Solicitud enviada", description: "Revise las instrucciones a continuación." });
    } catch (e: any) {
      toast({ variant: "destructive", title: "Error", description: e.response?.data?.message || "No se pudo procesar la solicitud" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center py-12 px-4 bg-muted/30">
      <div className="max-w-md w-full bg-card border p-8 shadow-sm">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <KeyRound className="h-7 w-7 text-primary" />
          </div>
          <h1 className="font-serif text-3xl font-bold text-foreground mb-2">Recuperar Contraseña</h1>
          <p className="text-muted-foreground text-sm">Ingrese su correo para recibir instrucciones de recuperación</p>
        </div>

        {!result ? (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email">Correo Electrónico</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="su@correo.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            <Button type="submit" disabled={loading} className="w-full bg-primary text-white">
              {loading ? "Enviando..." : "Enviar Instrucciones"}
            </Button>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-sm text-green-800">
              <p className="font-semibold mb-1">Solicitud procesada</p>
              <p>Si el correo existe en nuestro sistema, recibirás instrucciones.</p>
            </div>
            {result.token && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <p className="text-xs font-semibold text-amber-800 uppercase tracking-wider mb-2">Modo Demo — Código de recuperación</p>
                <p className="font-mono text-sm bg-white border rounded px-3 py-2 break-all select-all">{result.token}</p>
                <p className="text-xs text-amber-700 mt-2">{result.note}</p>
                <Link href={`/reset-password?token=${result.token}`}>
                  <Button size="sm" className="mt-3 w-full bg-amber-600 hover:bg-amber-700 text-white text-xs">
                    Ir a restablecer contraseña →
                  </Button>
                </Link>
              </div>
            )}
          </div>
        )}

        <div className="mt-6 text-center">
          <Link href="/login" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors">
            <ArrowLeft className="h-3 w-3" /> Volver al inicio de sesión
          </Link>
        </div>
      </div>
    </div>
  );
}
