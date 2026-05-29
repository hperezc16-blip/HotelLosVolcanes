import { Link, useLocation } from "wouter";
import { useAuth } from "../../contexts/AuthContext";
import { Button } from "../ui/button";
import { LogOut, Home, CalendarRange, Bed, LayoutDashboard, CalendarDays, BarChart2, Users, Package, LogIn } from "lucide-react";
import { useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, logout, isLoading } = useAuth();
  const [location, setLocation] = useLocation();

  useEffect(() => {
    if (!isLoading && (!user || user.rol !== 'admin')) {
      setLocation('/');
    }
  }, [user, isLoading, setLocation]);

  if (isLoading) return null;
  if (!user || user.rol !== 'admin') return null;

  const handleLogout = () => {
    logout();
    setLocation("~/");
  };

  const navItems = [
    { href: "/", label: "Dashboard", icon: LayoutDashboard },
    { href: "/reservations", label: "Reservaciones", icon: CalendarRange },
    { href: "/calendar", label: "Calendario", icon: CalendarDays },
    { href: "/rooms", label: "Habitaciones", icon: Bed },
    { href: "/checkinout", label: "Check-in / Check-out", icon: LogIn },
    { href: "/inventory", label: "Inventario", icon: Package },
    { href: "/reports", label: "Reportes", icon: BarChart2 },
    { href: "/users", label: "Usuarios", icon: Users },
  ];

  return (
    <div className="min-h-screen bg-muted/40 flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-card border-r flex flex-col shrink-0">
        <div className="h-16 flex items-center px-6 border-b">
          <Link href="/" className="font-serif text-xl font-bold text-primary">
            Admin Panel
          </Link>
        </div>
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location === item.href || (item.href !== '/' && location.startsWith(item.href));
            
            return (
              <Link key={item.href} href={item.href}>
                <div className={`flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition-colors ${
                  isActive 
                    ? "bg-primary/10 text-primary font-medium" 
                    : "text-foreground/70 hover:bg-muted hover:text-foreground"
                }`}>
                  <Icon className="h-5 w-5" />
                  {item.label}
                </div>
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t">
          <Link href="~/">
            <Button variant="outline" className="w-full justify-start gap-2 text-foreground/70">
              <Home className="h-4 w-4" />
              Volver al sitio
            </Button>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-card border-b flex items-center justify-between px-6 shrink-0 sticky top-0 z-10">
          <div>
            <h2 className="font-medium text-lg">Hotel Los Volcanes</h2>
            <p className="text-xs text-muted-foreground hidden md:block">
              {new Date().toLocaleDateString("es-GT", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
            </p>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="gap-2 rounded-full pl-2 pr-4 bg-muted hover:bg-muted/80">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  {user.nombre.charAt(0).toUpperCase()}
                </div>
                <span className="text-foreground hidden md:inline">{user.nombre}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{user.nombre}</p>
                  <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-destructive gap-2 cursor-pointer">
                <LogOut className="h-4 w-4" />
                Cerrar Sesión
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>

        <main className="flex-1 p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
