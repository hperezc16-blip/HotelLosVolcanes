function WireframeLogin() {
  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden text-xs shadow-sm">
      <div className="bg-blue-700 text-white text-center py-2 font-bold text-xs tracking-wide">HOTEL VISTA VERDE — Login</div>
      <div className="p-4 space-y-3">
        <div className="flex justify-center">
          <div className="w-12 h-12 bg-blue-100 rounded-full border-2 border-blue-300 flex items-center justify-center text-blue-600 font-bold text-sm">HV</div>
        </div>
        <div className="text-center text-xs font-semibold text-gray-600">Iniciar Sesión</div>
        <div className="space-y-2">
          <div className="bg-gray-50 border border-gray-300 rounded px-2 py-1.5 text-gray-400">✉️ correo@ejemplo.com</div>
          <div className="bg-gray-50 border border-gray-300 rounded px-2 py-1.5 text-gray-400">🔒 ••••••••</div>
        </div>
        <div className="text-right text-blue-500 text-xs">¿Olvidaste tu contraseña?</div>
        <div className="bg-blue-600 text-white text-center py-1.5 rounded font-semibold">Iniciar Sesión</div>
        <div className="border-t pt-2 text-center text-gray-500">¿No tienes cuenta? <span className="text-blue-500">Regístrate</span></div>
      </div>
    </div>
  );
}

function WireframeHome() {
  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden text-xs shadow-sm">
      <div className="bg-blue-700 text-white px-3 py-1.5 flex justify-between items-center">
        <span className="font-bold">HOTEL VISTA VERDE</span>
        <div className="flex gap-2 text-xs">
          <span>Habitaciones</span><span>|</span><span>Mi Cuenta</span>
        </div>
      </div>
      <div className="bg-gradient-to-b from-blue-100 to-white p-4 space-y-3">
        <div className="text-center">
          <div className="text-sm font-bold text-blue-900">Tu escapada perfecta en la naturaleza</div>
          <div className="text-xs text-gray-500 mt-1">Reserva directo y obtén el mejor precio</div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-sm space-y-2">
          <div className="text-xs font-bold text-gray-600 mb-1">Buscar Disponibilidad</div>
          <div className="grid grid-cols-2 gap-1">
            <div className="border border-gray-200 rounded px-2 py-1 text-gray-400">📅 Entrada</div>
            <div className="border border-gray-200 rounded px-2 py-1 text-gray-400">📅 Salida</div>
          </div>
          <div className="grid grid-cols-2 gap-1">
            <div className="border border-gray-200 rounded px-2 py-1 text-gray-400">👥 Adultos: 2</div>
            <div className="border border-gray-200 rounded px-2 py-1 text-gray-400">🏠 Tipo: Todos</div>
          </div>
          <div className="bg-blue-600 text-white text-center py-1.5 rounded font-semibold">🔍 Buscar</div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {["Suite Doble", "Cabaña Familiar"].map((h) => (
            <div key={h} className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="bg-blue-50 h-10 flex items-center justify-center text-blue-300 text-lg">🏨</div>
              <div className="p-1.5">
                <div className="font-semibold text-xs">{h}</div>
                <div className="text-blue-600 font-bold text-xs">Q350/noche</div>
                <div className="bg-blue-100 text-blue-700 text-center py-0.5 rounded text-xs mt-1">Ver más</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function WireframeResultados() {
  const rooms = [
    { name: "Suite Deluxe", type: "Suite", capacity: "2 adultos", price: 850, available: true },
    { name: "Habitación Familiar", type: "Familiar", capacity: "4 adultos + 2 niños", price: 1200, available: true },
    { name: "Habitación Simple", type: "Simple", capacity: "1 adulto", price: 350, available: false },
  ];
  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden text-xs shadow-sm">
      <div className="bg-blue-700 text-white px-3 py-1.5 flex justify-between items-center">
        <span className="font-bold">HOTEL VISTA VERDE</span>
        <div className="flex gap-2 text-xs">
          <span>Habitaciones</span><span>|</span><span className="text-blue-200">👤 Mi Cuenta</span>
        </div>
      </div>
      <div className="p-3 space-y-2">
        <div className="bg-blue-50 border border-blue-200 rounded px-2 py-1 flex justify-between">
          <span className="text-gray-600">📅 15 Jun → 18 Jun | 👥 2 adultos</span>
          <span className="text-blue-600">Editar</span>
        </div>
        <div className="text-xs font-bold text-gray-600">3 habitaciones encontradas</div>
        <div className="space-y-2">
          {rooms.map((room) => (
            <div key={room.name} className={`border rounded-lg p-2 ${room.available ? 'border-gray-200' : 'border-gray-100 opacity-50'}`}>
              <div className="flex gap-2">
                <div className="w-12 h-10 bg-blue-50 rounded flex items-center justify-center text-blue-300 shrink-0">🏨</div>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <div>
                      <div className="font-bold">{room.name}</div>
                      <div className="text-gray-400">{room.type} | {room.capacity}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-blue-700">Q{room.price}</div>
                      <div className="text-gray-400">por noche</div>
                    </div>
                  </div>
                  {room.available ? (
                    <div className="bg-blue-600 text-white text-center py-0.5 rounded mt-1 text-xs">Reservar</div>
                  ) : (
                    <div className="bg-gray-200 text-gray-500 text-center py-0.5 rounded mt-1 text-xs">Sin disponibilidad</div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function WireframeReserva() {
  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden text-xs shadow-sm">
      <div className="bg-blue-700 text-white px-3 py-1.5 font-bold">Confirmar Reserva</div>
      <div className="p-3 space-y-2">
        <div className="flex gap-2 justify-center text-xs mb-2">
          {["1. Selección", "2. Servicios", "3. Revisión", "4. Confirmar"].map((step, i) => (
            <div key={step} className="flex items-center gap-1">
              <div className={`w-4 h-4 rounded-full flex items-center justify-center text-xs font-bold ${i <= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-400'}`}>{i+1}</div>
              {i < 3 && <span className="text-gray-300">›</span>}
            </div>
          ))}
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-2">
          <div className="font-bold">Suite Deluxe</div>
          <div className="text-gray-600 mt-0.5">📅 15 Jun 2025 → 18 Jun 2025 (3 noches)</div>
          <div className="text-gray-600">👥 2 adultos</div>
        </div>
        <div className="space-y-1">
          <div className="font-bold text-gray-600">Servicios Adicionales (Opcional)</div>
          {["🍳 Desayuno buffet — Q75/persona/día", "🚗 Traslado aeropuerto — Q250 por viaje"].map((s) => (
            <div key={s} className="flex items-center gap-2 border border-gray-200 rounded px-2 py-1">
              <div className="w-3 h-3 border border-gray-300 rounded"></div>
              <span>{s}</span>
            </div>
          ))}
        </div>
        <div className="border-t pt-2 space-y-0.5">
          <div className="flex justify-between"><span>3 noches × Q850</span><span>Q2,550</span></div>
          <div className="flex justify-between text-gray-500"><span>Servicios adicionales</span><span>Q0</span></div>
          <div className="flex justify-between font-bold text-blue-700 border-t pt-1"><span>TOTAL</span><span>Q2,550</span></div>
        </div>
        <div className="bg-green-600 text-white text-center py-1.5 rounded font-bold">✓ Confirmar Reserva</div>
        <div className="text-gray-400 text-center text-xs">Cancelación gratuita hasta 48h antes del check-in</div>
      </div>
    </div>
  );
}

function WireframeDashboard() {
  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden text-xs shadow-sm">
      <div className="bg-gray-800 text-white px-3 py-1.5 flex justify-between items-center">
        <span className="font-bold">Panel de Administración</span>
        <span className="text-gray-400 text-xs">Admin: María García</span>
      </div>
      <div className="flex">
        <div className="w-24 bg-gray-100 border-r border-gray-200 p-2 space-y-0.5">
          {["📊 Dashboard", "📅 Reservas", "🏨 Habitaciones", "📈 Reportes", "⚙️ Config."].map((m) => (
            <div key={m} className={`px-1 py-1 rounded text-xs text-gray-600 ${m.startsWith('📊') ? 'bg-blue-100 text-blue-700 font-semibold' : ''}`}>{m}</div>
          ))}
        </div>
        <div className="flex-1 p-2 space-y-2">
          <div className="grid grid-cols-3 gap-1">
            {[
              { label: "Ocupación Hoy", val: "78%", color: "bg-green-50 text-green-700" },
              { label: "Ingresos (mes)", val: "Q45,200", color: "bg-blue-50 text-blue-700" },
              { label: "Check-in Hoy", val: "5", color: "bg-orange-50 text-orange-700" },
            ].map((m) => (
              <div key={m.label} className={`rounded-lg p-2 ${m.color}`}>
                <div className="font-bold text-base">{m.val}</div>
                <div className="text-gray-500 text-xs">{m.label}</div>
              </div>
            ))}
          </div>
          <div className="border border-gray-200 rounded-lg p-2">
            <div className="font-bold text-gray-600 mb-1">Reservas de Hoy</div>
            {[
              { code: "HTL-001", guest: "Juan P.", time: "14:00", status: "check-in" },
              { code: "HTL-002", guest: "Ana M.", time: "12:00", status: "check-out" },
            ].map((r) => (
              <div key={r.code} className="flex justify-between items-center py-0.5 border-b border-gray-100 last:border-0">
                <span className="font-mono font-bold text-blue-600">{r.code}</span>
                <span>{r.guest}</span>
                <span className="text-gray-400">{r.time}</span>
                <span className={`text-xs px-1 py-0.5 rounded-full ${r.status === 'check-in' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>{r.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const screens = [
  { id: "SCR-01", name: "Login / Autenticación", desc: "Pantalla de inicio de sesión con formulario de correo y contraseña. Acceso rápido a registro y recuperación.", wireframe: <WireframeLogin /> },
  { id: "SCR-02", name: "Página Principal / Búsqueda", desc: "Landing page con motor de búsqueda de habitaciones por fechas, huéspedes y tipo. Vista previa del catálogo.", wireframe: <WireframeHome /> },
  { id: "SCR-03", name: "Resultados de Búsqueda", desc: "Listado de habitaciones disponibles con filtros, precios y botón de reserva. Indicador de sin disponibilidad.", wireframe: <WireframeResultados /> },
  { id: "SCR-04", name: "Proceso de Reserva", desc: "Flujo paso a paso: selección, servicios adicionales, revisión y confirmación. Resumen de precios.", wireframe: <WireframeReserva /> },
  { id: "SCR-05", name: "Dashboard Administrador", desc: "Panel de métricas con ocupación, ingresos y reservas del día. Navegación lateral con módulos del sistema.", wireframe: <WireframeDashboard /> },
];

const userFlows = [
  {
    title: "Flujo 1: Cliente realiza una reserva",
    color: "bg-blue-50 border-blue-200",
    steps: [
      { step: "1", action: "Accede al sitio web", note: "Landing page" },
      { step: "2", action: "Ingresa fechas y filtros", note: "Motor de búsqueda" },
      { step: "3", action: "Ve habitaciones disponibles", note: "Resultados" },
      { step: "4", action: "Selecciona habitación", note: "Ver detalle" },
      { step: "5", action: "Inicia sesión (si no está autenticado)", note: "Login / Registro" },
      { step: "6", action: "Agrega servicios opcionales", note: "Extras" },
      { step: "7", action: "Revisa resumen de reserva", note: "Checkout" },
      { step: "8", action: "Confirma la reserva", note: "POST /api/reservas" },
      { step: "9", action: "Recibe correo de confirmación", note: "Email automático" },
      { step: "10", action: "Ve código de reserva", note: "Página de éxito" },
    ]
  },
  {
    title: "Flujo 2: Administrador gestiona reservas del día",
    color: "bg-orange-50 border-orange-200",
    steps: [
      { step: "1", action: "Inicia sesión como administrador", note: "Login" },
      { step: "2", action: "Ve dashboard con métricas", note: "Panel principal" },
      { step: "3", action: "Revisa check-ins pendientes", note: "Lista del día" },
      { step: "4", action: "Registra check-in de huésped", note: "Cambia estado" },
      { step: "5", action: "Gestiona solicitudes especiales", note: "Notas de reserva" },
      { step: "6", action: "Registra check-out", note: "Libera habitación" },
      { step: "7", action: "Genera reporte del día", note: "Exportar PDF" },
    ]
  },
  {
    title: "Flujo 3: Cliente cancela una reserva",
    color: "bg-red-50 border-red-200",
    steps: [
      { step: "1", action: "Inicia sesión", note: "Autenticación" },
      { step: "2", action: "Accede a 'Mis Reservas'", note: "Panel de cliente" },
      { step: "3", action: "Selecciona la reserva activa", note: "Detalle de reserva" },
      { step: "4", action: "Hace clic en 'Cancelar Reserva'", note: "Botón de acción" },
      { step: "5", action: "Lee política de cancelación", note: "Modal informativo" },
      { step: "6", action: "Confirma la cancelación", note: "Confirmación" },
      { step: "7", action: "El sistema libera la habitación", note: "Actualización BD" },
      { step: "8", action: "Recibe correo de cancelación", note: "Email automático" },
    ]
  },
];

export default function UIUXPage() {
  return (
    <div className="space-y-8">
      <div className="border-b border-border pb-6">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-xs font-semibold uppercase tracking-widest text-primary bg-primary/10 px-3 py-1 rounded-full">Entregable 4.5</span>
          <span className="text-xs text-muted-foreground">Ponderación: 3.0 pts</span>
        </div>
        <h1 className="text-3xl font-bold text-foreground">Diseño de UI/UX</h1>
        <p className="mt-2 text-muted-foreground">Wireframes de las pantallas principales, prototipo interactivo y flujos de usuario</p>
      </div>

      <div className="bg-card border border-border rounded-xl p-6 space-y-4">
        <h2 className="text-xl font-bold text-primary">Principios de Diseño</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          {[
            { icon: "🎯", title: "Simplicidad", desc: "Reserva en máximo 5 pasos. Sin complejidad innecesaria." },
            { icon: "📱", title: "Responsivo", desc: "Diseño adaptable: mobile-first para 320px–1920px." },
            { icon: "♿", title: "Accesibilidad", desc: "ARIA labels, contraste WCAG AA, navegación por teclado." },
            { icon: "⚡", title: "Rendimiento", desc: "Carga inicial < 3 segundos. Skeleton loaders." },
          ].map((p) => (
            <div key={p.title} className="bg-muted/30 rounded-xl p-4 text-center">
              <div className="text-3xl mb-2">{p.icon}</div>
              <div className="font-bold">{p.title}</div>
              <div className="text-xs text-muted-foreground mt-1">{p.desc}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl p-6 space-y-6">
        <h2 className="text-xl font-bold text-primary">Wireframes de Pantallas Principales</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {screens.map((screen) => (
            <div key={screen.id} className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded">{screen.id}</span>
                <span className="text-sm font-semibold">{screen.name}</span>
              </div>
              {screen.wireframe}
              <p className="text-xs text-muted-foreground">{screen.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl p-6 space-y-6">
        <h2 className="text-xl font-bold text-primary">Flujos de Usuario</h2>
        <div className="space-y-6">
          {userFlows.map((flow) => (
            <div key={flow.title} className={`border rounded-xl p-5 ${flow.color}`}>
              <h3 className="font-bold text-sm mb-4">{flow.title}</h3>
              <div className="flex flex-wrap gap-2">
                {flow.steps.map((step, i) => (
                  <div key={i} className="flex items-center gap-1.5">
                    <div className="flex flex-col items-center">
                      <div className="w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">{step.step}</div>
                      <div className="text-center mt-1">
                        <div className="text-xs font-semibold">{step.action}</div>
                        <div className="text-xs text-muted-foreground italic">{step.note}</div>
                      </div>
                    </div>
                    {i < flow.steps.length - 1 && (
                      <div className="text-muted-foreground text-lg mt-[-20px]">→</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl p-6 space-y-4">
        <h2 className="text-xl font-bold text-primary">Inventario de Pantallas del Sistema</h2>
        <div className="overflow-x-auto">
          <table className="table-doc w-full">
            <thead>
              <tr>
                <th>ID</th>
                <th>Pantalla</th>
                <th>Ruta URL</th>
                <th>Rol de Acceso</th>
                <th>Componentes Principales</th>
                <th>Estado Wireframe</th>
              </tr>
            </thead>
            <tbody>
              {[
                { id: "SCR-01", name: "Login", url: "/login", rol: "Todos (público)", comp: "Formulario, validación, redireccionamiento por rol", status: "✓ Completado" },
                { id: "SCR-02", name: "Registro de Cliente", url: "/register", rol: "Todos (público)", comp: "Formulario multi-campo, validación en tiempo real", status: "✓ Completado" },
                { id: "SCR-03", name: "Recuperar Contraseña", url: "/forgot-password", rol: "Todos (público)", comp: "Input email, mensaje confirmación, enlace expiración", status: "✓ Completado" },
                { id: "SCR-04", name: "Inicio / Búsqueda", url: "/", rol: "Todos (público)", comp: "Hero, motor de búsqueda, catálogo preview", status: "✓ Completado" },
                { id: "SCR-05", name: "Resultados de Búsqueda", url: "/habitaciones", rol: "Todos (público)", comp: "Filtros, cards de habitación, paginación", status: "✓ Completado" },
                { id: "SCR-06", name: "Detalle de Habitación", url: "/habitaciones/:id", rol: "Todos (público)", comp: "Galería, descripción, amenidades, CTA reservar", status: "Pendiente" },
                { id: "SCR-07", name: "Proceso de Reserva", url: "/reservar", rol: "Cliente autenticado", comp: "Stepper, servicios extra, resumen precios, CTA confirmar", status: "✓ Completado" },
                { id: "SCR-08", name: "Confirmación de Reserva", url: "/reserva/exitosa/:id", rol: "Cliente autenticado", comp: "Código reserva, detalles, PDF download, regresar inicio", status: "Pendiente" },
                { id: "SCR-09", name: "Mis Reservas (cliente)", url: "/mi-cuenta/reservas", rol: "Cliente autenticado", comp: "Lista filtrable, estado, botón cancelar, descargar", status: "Pendiente" },
                { id: "SCR-10", name: "Dashboard Admin", url: "/admin", rol: "Administrador", comp: "KPI cards, lista check-ins hoy, gráfica ocupación", status: "✓ Completado" },
                { id: "SCR-11", name: "Gestión de Reservas Admin", url: "/admin/reservas", rol: "Admin / Recepcionista", comp: "Tabla con filtros, acciones estado, búsqueda, exportar", status: "Pendiente" },
                { id: "SCR-12", name: "Gestión de Habitaciones", url: "/admin/habitaciones", rol: "Administrador", comp: "CRUD habitaciones, carga imágenes, activar/desactivar", status: "Pendiente" },
                { id: "SCR-13", name: "Reportes", url: "/admin/reportes", rol: "Administrador", comp: "Filtro fechas, gráficas ocupación/ingresos, exportar PDF/XLS", status: "Pendiente" },
              ].map((s) => (
                <tr key={s.id}>
                  <td className="font-mono text-xs font-bold text-primary">{s.id}</td>
                  <td className="font-semibold text-sm">{s.name}</td>
                  <td className="font-mono text-xs text-muted-foreground">{s.url}</td>
                  <td className="text-xs">{s.rol}</td>
                  <td className="text-xs">{s.comp}</td>
                  <td>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${s.status.startsWith('✓') ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                      {s.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
