import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MapPin, Phone, Mail, Clock, Send, ChevronDown, ChevronUp } from "lucide-react";

const FAQS = [
  { q: "¿Cuál es el horario de check-in y check-out?", a: "El check-in es a partir de las 3:00 PM y el check-out hasta las 12:00 PM. Podemos guardar su equipaje si llega antes o sale después." },
  { q: "¿Admiten mascotas?", a: "Contamos con habitaciones pet-friendly. Por favor indíquelo al hacer su reservación. Se aplica un cargo adicional de Q150 por noche." },
  { q: "¿Tienen estacionamiento?", a: "Sí, contamos con estacionamiento privado y vigilado sin costo adicional para huéspedes." },
  { q: "¿Incluye desayuno?", a: "El desayuno buffet está incluido en todas las tarifas superiores (Suite y Cabaña). Para habitaciones Sencilla y Doble está disponible con un costo adicional de Q85 por persona." },
  { q: "¿Ofrecen traslado del aeropuerto?", a: "Sí, ofrecemos traslados privados desde el Aeropuerto La Aurora con reserva previa. El costo es Q350 por trayecto para hasta 4 personas." },
  { q: "¿Tienen WiFi en todas las áreas?", a: "Sí, contamos con WiFi de fibra óptica en todas las habitaciones y áreas comunes, incluyendo piscina y jardines, con velocidad mínima garantizada de 100 Mbps." },
  { q: "¿Cuál es la política de cancelación?", a: "Cancelaciones gratuitas hasta 48 horas antes del check-in. Cancelaciones dentro de las 48 horas tienen un cargo equivalente a 1 noche." },
];

const CONTACT_INFO = [
  { icon: MapPin, label: "Dirección", value: "Calle del Arco 15, Antigua Guatemala, Sacatepéquez" },
  { icon: Phone, label: "Teléfono", value: "+502 7832-4567 / +502 5555-0001 (WhatsApp)" },
  { icon: Mail, label: "Correo", value: "reservas@hotellosvolcanes.com" },
  { icon: Clock, label: "Atención", value: "Lunes a Domingo, 24 horas" },
];

export default function Contact() {
  const { toast } = useToast();
  const [form, setForm] = useState({ nombre: "", email: "", telefono: "", mensaje: "" });
  const [sending, setSending] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nombre || !form.email || !form.mensaje) {
      toast({ variant: "destructive", title: "Completa los campos requeridos" });
      return;
    }
    setSending(true);
    await new Promise(r => setTimeout(r, 1200));
    setSending(false);
    toast({ title: "Mensaje enviado", description: "Le responderemos en menos de 24 horas." });
    setForm({ nombre: "", email: "", telefono: "", mensaje: "" });
  };

  return (
    <div className="bg-background">
      <div className="w-full h-64 relative overflow-hidden">
        <img src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1400&h=400&fit=crop" alt="Contacto" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/20 flex items-end">
          <div className="container mx-auto px-4 pb-10">
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-white">Contáctenos</h1>
            <p className="text-white/80 mt-2 text-lg">Estamos aquí para ayudarle en todo momento</p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Formulario */}
          <div>
            <h2 className="font-serif text-2xl font-bold mb-6">Envíenos un Mensaje</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label className="text-xs uppercase tracking-wider text-muted-foreground">Nombre *</Label>
                  <Input value={form.nombre} onChange={e => setForm(f => ({ ...f, nombre: e.target.value }))} placeholder="Su nombre completo" />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs uppercase tracking-wider text-muted-foreground">Correo electrónico *</Label>
                  <Input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="su@correo.com" />
                </div>
              </div>
              <div className="space-y-1">
                <Label className="text-xs uppercase tracking-wider text-muted-foreground">Teléfono</Label>
                <Input value={form.telefono} onChange={e => setForm(f => ({ ...f, telefono: e.target.value }))} placeholder="+502 0000 0000" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs uppercase tracking-wider text-muted-foreground">Mensaje *</Label>
                <textarea
                  value={form.mensaje}
                  onChange={e => setForm(f => ({ ...f, mensaje: e.target.value }))}
                  placeholder="¿En qué podemos ayudarle?"
                  rows={5}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
                />
              </div>
              <Button type="submit" disabled={sending} className="gap-2 bg-primary text-white w-full sm:w-auto px-8">
                <Send className="h-4 w-4" />
                {sending ? "Enviando..." : "Enviar Mensaje"}
              </Button>
            </form>
          </div>

          {/* Info de contacto */}
          <div>
            <h2 className="font-serif text-2xl font-bold mb-6">Información de Contacto</h2>
            <div className="space-y-4 mb-8">
              {CONTACT_INFO.map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-start gap-4 p-4 bg-card border rounded-lg">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">{label}</p>
                    <p className="text-sm font-medium mt-0.5">{value}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-primary/5 border border-primary/20 rounded-lg p-5">
              <h3 className="font-semibold mb-2 text-primary">Reservaciones directas</h3>
              <p className="text-sm text-muted-foreground">Para reservaciones inmediatas llame directamente al <strong className="text-foreground">+502 7832-4567</strong> o contáctenos por WhatsApp al <strong className="text-foreground">+502 5555-0001</strong>.</p>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="max-w-3xl mx-auto" id="faq">
          <div className="text-center mb-10">
            <h2 className="font-serif text-3xl font-bold mb-3">Preguntas Frecuentes</h2>
            <p className="text-muted-foreground">Respuestas a las consultas más comunes de nuestros huéspedes</p>
          </div>
          <div className="space-y-3">
            {FAQS.map((faq, i) => (
              <div key={i} className="bg-card border rounded-lg overflow-hidden">
                <button
                  className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-muted/30 transition-colors"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <span className="font-medium text-sm pr-4">{faq.q}</span>
                  {openFaq === i ? <ChevronUp className="h-4 w-4 text-primary shrink-0" /> : <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />}
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-4 text-sm text-muted-foreground leading-relaxed border-t bg-muted/20 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
