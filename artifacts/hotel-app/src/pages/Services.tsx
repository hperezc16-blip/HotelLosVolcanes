import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Waves, UtensilsCrossed, Mountain, Car, Wifi, Coffee, Dumbbell, Shield, Star, Clock, Phone } from "lucide-react";

const SERVICES = [
  { icon: Waves, title: "Piscina & Spa", desc: "Relájese en nuestra piscina climatizada con vistas a los volcanes. El spa ofrece masajes, tratamientos faciales y terapias con productos naturales guatemaltecos.", color: "text-blue-600 bg-blue-50", horario: "6:00 AM – 10:00 PM" },
  { icon: UtensilsCrossed, title: "Restaurante Los Volcanes", desc: "Cocina guatemalteca e internacional de alta calidad. Disfrute del desayuno buffet, almuerzo a la carta y cena romántica con vista panorámica.", color: "text-orange-600 bg-orange-50", horario: "7:00 AM – 11:00 PM" },
  { icon: Mountain, title: "Tours Ecológicos", desc: "Explore los volcanes de Guatemala con nuestros guías certificados. Caminatas al Volcán de Agua, Acatenango y visitas a fincas de café.", color: "text-green-600 bg-green-50", horario: "Salidas: 5:00 AM y 8:00 AM" },
  { icon: Car, title: "Transporte & Traslados", desc: "Traslados desde y hacia el aeropuerto La Aurora, Ciudad de Guatemala y Panajachel. Vehículos privados con conductor bilingüe.", color: "text-purple-600 bg-purple-50", horario: "24 horas con reserva previa" },
  { icon: Coffee, title: "Café & Lounge", desc: "Lounge exclusivo para huéspedes con cafés de origen guatemalteco, cócteles artesanales y snacks durante todo el día.", color: "text-amber-600 bg-amber-50", horario: "7:00 AM – 12:00 AM" },
  { icon: Dumbbell, title: "Gimnasio", desc: "Equipamiento moderno de cardio y pesas. Clases de yoga al aire libre con vista a los volcanes los lunes, miércoles y viernes.", color: "text-red-600 bg-red-50", horario: "5:00 AM – 11:00 PM" },
  { icon: Wifi, title: "WiFi de Alta Velocidad", desc: "Conectividad de fibra óptica en todas las habitaciones, áreas comunes, piscina y jardines. Velocidad mínima garantizada de 100 Mbps.", color: "text-indigo-600 bg-indigo-50", horario: "Disponible 24 horas" },
  { icon: Shield, title: "Seguridad 24/7", desc: "Personal de seguridad en todos los accesos, cámaras de vigilancia, caja fuerte en habitaciones y estacionamiento privado vigilado.", color: "text-slate-600 bg-slate-50", horario: "24 horas, los 365 días" },
];

export default function Services() {
  const [, setLocation] = useLocation();
  return (
    <div className="bg-background">
      <div className="w-full h-64 relative overflow-hidden">
        <img src="https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1400&h=400&fit=crop" alt="Servicios" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/20 flex items-end">
          <div className="container mx-auto px-4 pb-10">
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-white">Nuestros Servicios</h1>
            <p className="text-white/80 mt-2 text-lg">Todo lo que necesita para una estadía perfecta</p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <p className="text-muted-foreground max-w-2xl mx-auto">En Hotel Los Volcanes nos dedicamos a brindar experiencias únicas. Cada servicio ha sido diseñado pensando en su confort y bienestar.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-16">
          {SERVICES.map((s, i) => {
            const Icon = s.icon;
            return (
              <div key={i} className="bg-card border shadow-sm hover:shadow-md transition-shadow p-6 group">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${s.color}`}>
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{s.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-3">{s.desc}</p>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" /> {s.horario}
                </div>
              </div>
            );
          })}
        </div>

        <div className="bg-primary text-white p-8 text-center">
          <Star className="h-10 w-10 mx-auto mb-4 text-yellow-300" />
          <h2 className="font-serif text-3xl font-bold mb-3">Servicios con cargo adicional</h2>
          <p className="text-white/80 mb-6 max-w-xl mx-auto">Algunos servicios tienen un costo adicional. Consulte disponibilidad y tarifas en recepción o llámenos.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button onClick={() => setLocation("/rooms")} className="bg-white text-primary hover:bg-white/90 font-semibold">
              Reservar Habitación
            </Button>
            <Button onClick={() => setLocation("/contact")} variant="outline" className="border-white text-white hover:bg-white/10 gap-2">
              <Phone className="h-4 w-4" /> Contáctenos
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
