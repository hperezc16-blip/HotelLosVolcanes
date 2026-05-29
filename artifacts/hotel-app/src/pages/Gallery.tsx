import { useState } from "react";
import { X, ChevronLeft, ChevronRight, Camera } from "lucide-react";

const CATEGORIES = ["Todas", "Habitaciones", "Restaurante", "Piscina & Spa", "Jardines", "Áreas Comunes"];

const PHOTOS = [
  { id: 1, src: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&h=600&fit=crop", title: "Suite Volcán de Agua", category: "Habitaciones" },
  { id: 2, src: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&h=600&fit=crop", title: "Habitación Doble Deluxe", category: "Habitaciones" },
  { id: 3, src: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800&h=600&fit=crop", title: "Suite con Vista Panorámica", category: "Habitaciones" },
  { id: 4, src: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=600&fit=crop", title: "Piscina Climatizada", category: "Piscina & Spa" },
  { id: 5, src: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&h=600&fit=crop", title: "Spa & Wellness Center", category: "Piscina & Spa" },
  { id: 6, src: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=600&fit=crop", title: "Restaurante Los Volcanes", category: "Restaurante" },
  { id: 7, src: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop", title: "Terraza con Vista", category: "Restaurante" },
  { id: 8, src: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&h=600&fit=crop", title: "Desayuno Buffet", category: "Restaurante" },
  { id: 9, src: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop", title: "Jardines Coloniales", category: "Jardines" },
  { id: 10, src: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop", title: "Jardín Tropical", category: "Jardines" },
  { id: 11, src: "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&h=600&fit=crop", title: "Lobby Principal", category: "Áreas Comunes" },
  { id: 12, src: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&h=600&fit=crop", title: "Sala de Estar", category: "Áreas Comunes" },
  { id: 13, src: "https://images.unsplash.com/photo-1574691250077-03a929faece5?w=800&h=600&fit=crop", title: "Cabaña Privada", category: "Habitaciones" },
  { id: 14, src: "https://images.unsplash.com/photo-1455587734955-081b22074882?w=800&h=600&fit=crop", title: "Bar Café & Lounge", category: "Áreas Comunes" },
  { id: 15, src: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop", title: "Vista Aérea del Hotel", category: "Jardines" },
];

export default function Gallery() {
  const [activeCategory, setActiveCategory] = useState("Todas");
  const [lightbox, setLightbox] = useState<number | null>(null);

  const filtered = activeCategory === "Todas" ? PHOTOS : PHOTOS.filter(p => p.category === activeCategory);

  const prev = () => {
    if (lightbox === null) return;
    const idx = filtered.findIndex(p => p.id === lightbox);
    setLightbox(filtered[(idx - 1 + filtered.length) % filtered.length].id);
  };

  const next = () => {
    if (lightbox === null) return;
    const idx = filtered.findIndex(p => p.id === lightbox);
    setLightbox(filtered[(idx + 1) % filtered.length].id);
  };

  const currentPhoto = lightbox !== null ? filtered.find(p => p.id === lightbox) : null;

  return (
    <div className="bg-background">
      <div className="w-full h-64 relative overflow-hidden">
        <img src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1400&h=400&fit=crop" alt="Galería" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/20 flex items-end">
          <div className="container mx-auto px-4 pb-10">
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-white">Galería</h1>
            <p className="text-white/80 mt-2 text-lg">Descubra la belleza de Hotel Los Volcanes</p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-wrap gap-2 justify-center mb-10">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeCategory === cat
                  ? "bg-primary text-white"
                  : "bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {filtered.map((photo, idx) => (
            <div
              key={photo.id}
              className={`relative overflow-hidden cursor-pointer group rounded-lg ${idx % 7 === 0 ? "col-span-2 row-span-2" : ""}`}
              onClick={() => setLightbox(photo.id)}
            >
              <img
                src={photo.src}
                alt={photo.title}
                className="w-full h-full object-cover aspect-square transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300 flex items-end">
                <div className="p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <p className="text-white text-sm font-medium">{photo.title}</p>
                  <p className="text-white/70 text-xs flex items-center gap-1"><Camera className="h-3 w-3" />{photo.category}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {lightbox !== null && currentPhoto && (
        <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center" onClick={() => setLightbox(null)}>
          <button onClick={e => { e.stopPropagation(); prev(); }} className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-primary transition-colors p-2">
            <ChevronLeft className="h-8 w-8" />
          </button>
          <div className="max-w-4xl max-h-screen p-4" onClick={e => e.stopPropagation()}>
            <img src={currentPhoto.src} alt={currentPhoto.title} className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl" />
            <div className="text-center mt-4">
              <p className="text-white font-semibold text-lg">{currentPhoto.title}</p>
              <p className="text-white/60 text-sm">{currentPhoto.category}</p>
            </div>
          </div>
          <button onClick={e => { e.stopPropagation(); next(); }} className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-primary transition-colors p-2">
            <ChevronRight className="h-8 w-8" />
          </button>
          <button onClick={() => setLightbox(null)} className="absolute top-4 right-4 text-white/70 hover:text-white p-2">
            <X className="h-6 w-6" />
          </button>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/50 text-xs">
            {filtered.findIndex(p => p.id === lightbox) + 1} / {filtered.length}
          </div>
        </div>
      )}
    </div>
  );
}
