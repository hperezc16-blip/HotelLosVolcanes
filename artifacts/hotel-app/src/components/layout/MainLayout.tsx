import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  Menu, X, User, LogOut, Settings, ChevronDown,
  BedDouble, CalendarCheck
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const NAV_LINKS = [
  { href: "/rooms", label: "Habitaciones" },
  { href: "/services", label: "Servicios" },
  { href: "/gallery", label: "Galería" },
  { href: "/contact", label: "Contacto" },
];

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const [, setLocation] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setLocation("/");
    setMobileOpen(false);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b bg-white/95 backdrop-blur-md sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 h-18 py-3 flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <BedDouble className="h-6 w-6 text-primary" />
            <span className="font-serif text-xl font-bold text-foreground tracking-tight">Hotel Los Volcanes</span>
          </Link>

          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium">
            {NAV_LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="text-muted-foreground hover:text-primary transition-colors"
                data-testid={`nav-${label.toLowerCase()}`}
              >
                {label}
              </Link>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-3">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-2 border-primary text-primary hover:bg-primary hover:text-white rounded-full pl-3 pr-4" data-testid="button-user-menu">
                    <div className="h-7 w-7 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold">
                      {user.nombre.charAt(0).toUpperCase()}
                    </div>
                    <span className="max-w-24 truncate">{user.nombre}</span>
                    <ChevronDown className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col">
                      <p className="font-semibold text-sm">{user.nombre}</p>
                      <p className="text-muted-foreground text-xs">{user.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setLocation("/profile")} className="gap-2 cursor-pointer" data-testid="menu-profile">
                    <User className="h-4 w-4" />
                    Mi Perfil
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setLocation("/my-reservations")} className="gap-2 cursor-pointer" data-testid="menu-my-reservations">
                    <CalendarCheck className="h-4 w-4" />
                    Mis Reservaciones
                  </DropdownMenuItem>
                  {user.rol === "admin" && (
                    <DropdownMenuItem onClick={() => setLocation("/admin")} className="gap-2 cursor-pointer text-primary" data-testid="menu-admin">
                      <Settings className="h-4 w-4" />
                      Panel de Administracion
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-destructive gap-2 cursor-pointer" data-testid="menu-logout">
                    <LogOut className="h-4 w-4" />
                    Cerrar Sesion
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center gap-3">
                <Link href="/login">
                  <Button variant="ghost" className="text-muted-foreground hover:text-primary" data-testid="button-login">
                    Iniciar Sesion
                  </Button>
                </Link>
                <Link href="/register">
                  <Button className="bg-primary hover:bg-primary/90 text-white rounded-full px-6" data-testid="button-register">
                    Registrarse
                  </Button>
                </Link>
              </div>
            )}
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            data-testid="button-mobile-menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        {mobileOpen && (
          <div className="lg:hidden border-t bg-white px-4 py-4 space-y-2">
            {NAV_LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setMobileOpen(false)}
                className="block py-2 text-muted-foreground hover:text-primary text-sm font-medium"
              >
                {label}
              </Link>
            ))}
            <div className="border-t pt-3 space-y-2">
              {user ? (
                <>
                  <Link href="/my-reservations" onClick={() => setMobileOpen(false)}>
                    <Button variant="outline" className="w-full gap-2 justify-start" data-testid="mobile-my-reservations">
                      <CalendarCheck className="h-4 w-4" />
                      Mis Reservaciones
                    </Button>
                  </Link>
                  {user.rol === "admin" && (
                    <Link href="/admin" onClick={() => setMobileOpen(false)}>
                      <Button variant="outline" className="w-full gap-2 justify-start text-primary border-primary">
                        <Settings className="h-4 w-4" />
                        Panel Admin
                      </Button>
                    </Link>
                  )}
                  <Button variant="destructive" className="w-full" onClick={handleLogout}>
                    Cerrar Sesion
                  </Button>
                </>
              ) : (
                <>
                  <Link href="/login" onClick={() => setMobileOpen(false)}>
                    <Button variant="outline" className="w-full">Iniciar Sesion</Button>
                  </Link>
                  <Link href="/register" onClick={() => setMobileOpen(false)}>
                    <Button className="w-full bg-primary text-white">Registrarse</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </header>

      <main className="flex-1 flex flex-col">
        {children}
      </main>

      <footer className="bg-secondary text-secondary-foreground">
        <div className="container mx-auto px-4 py-16 grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <BedDouble className="h-6 w-6 text-primary" />
              <span className="font-serif text-xl font-bold">Hotel Los Volcanes</span>
            </div>
            <p className="text-secondary-foreground/70 max-w-sm text-sm leading-relaxed mb-4">
              Un refugio de elegancia y calidez en el corazon de Antigua Guatemala. Su escape perfecto comienza aqui.
            </p>
            <p className="text-secondary-foreground/50 text-xs">Calle del Arco 15, Antigua Guatemala, Sacatepequez, Guatemala</p>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-primary uppercase tracking-wider text-xs">El Hotel</h4>
            <ul className="space-y-2 text-sm text-secondary-foreground/70">
              <li><Link href="/rooms" className="hover:text-primary transition-colors">Habitaciones</Link></li>
              <li><Link href="/services" className="hover:text-primary transition-colors">Servicios</Link></li>
              <li><Link href="/gallery" className="hover:text-primary transition-colors">Galería</Link></li>
              <li><Link href="/contact" className="hover:text-primary transition-colors">Contacto</Link></li>
              <li><Link href="/contact#faq" className="hover:text-primary transition-colors">Preguntas Frecuentes</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-primary uppercase tracking-wider text-xs">Contacto</h4>
            <ul className="space-y-2 text-sm text-secondary-foreground/70">
              <li>+502 7832 4567</li>
              <li>+502 5555 0001 (WhatsApp)</li>
              <li>reservas@hotellosvolcanes.com</li>
              <li className="pt-2 text-secondary-foreground/50 text-xs">Lunes a Domingo, 24 horas</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-secondary-foreground/10">
          <div className="container mx-auto px-4 py-5 flex flex-col md:flex-row items-center justify-between gap-2 text-xs text-secondary-foreground/40">
            <span>© {new Date().getFullYear()} Hotel Los Volcanes. Todos los derechos reservados.</span>
            <span>Sistema de Reservas — Desarrollado por Hazel Perez, UMG Ingenieria de Software 2025</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
