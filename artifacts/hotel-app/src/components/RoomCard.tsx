import { Link } from "wouter";
import { type Room } from "@workspace/api-client-react";
import { Button } from "./ui/button";
import { Bed, Users } from "lucide-react";

export default function RoomCard({ room }: { room: Room }) {
  const getRoomTypeLabel = (tipo: string) => {
    const types: Record<string, string> = {
      sencilla: "Sencilla",
      doble: "Doble",
      suite: "Suite",
      cabana: "Cabaña"
    };
    return types[tipo] || tipo;
  };

  // Fallback image if none provided
  const imgUrl = room.imageUrl || "https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=2070&auto=format&fit=crop";

  return (
    <div className="group flex flex-col bg-card border hover:shadow-lg transition-all duration-300 overflow-hidden h-full">
      <div className="relative aspect-[4/3] overflow-hidden">
        <img 
          src={imgUrl} 
          alt={room.nombre}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute top-4 left-4 bg-background/90 backdrop-blur-sm px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
          {getRoomTypeLabel(room.tipo)}
        </div>
      </div>
      
      <div className="p-6 flex flex-col flex-1">
        <h3 className="font-serif text-2xl font-semibold mb-2 text-foreground">{room.nombre}</h3>
        
        <div className="flex items-center gap-4 mb-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Users className="h-4 w-4" />
            <span>Hasta {room.capacidad} pers.</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Bed className="h-4 w-4" />
            <span>{getRoomTypeLabel(room.tipo)}</span>
          </div>
        </div>

        <p className="text-muted-foreground text-sm line-clamp-2 mb-6 flex-1">
          {room.descripcion || "Una hermosa habitación diseñada para su confort y descanso durante su estadía en Hotel Los Volcanes."}
        </p>

        <div className="flex items-center justify-between mt-auto pt-4 border-t">
          <div>
            <span className="text-2xl font-serif text-primary font-medium">${room.precioNoche}</span>
            <span className="text-xs text-muted-foreground uppercase tracking-wider ml-1">/ noche</span>
          </div>
          
          <Link href={`/rooms/${room.id}`}>
            <Button variant="ghost" className="text-primary hover:text-primary hover:bg-primary/5 uppercase tracking-wider text-xs font-bold">
              Ver Detalles
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
