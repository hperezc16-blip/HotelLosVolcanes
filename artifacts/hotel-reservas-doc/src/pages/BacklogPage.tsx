const backlogItems = [
  { id: "US-01", epic: "Autenticación", titulo: "Registro de nuevo cliente", prioridad: "Must", moscow: "M", sp: 8, sprint: 1, estado: "Ready", dor: true },
  { id: "US-02", epic: "Autenticación", titulo: "Inicio de sesión con JWT", prioridad: "Must", moscow: "M", sp: 5, sprint: 1, estado: "Ready", dor: true },
  { id: "US-04", epic: "Habitaciones", titulo: "Buscar habitaciones disponibles", prioridad: "Must", moscow: "M", sp: 13, sprint: 1, estado: "Ready", dor: true },
  { id: "US-05", epic: "Habitaciones", titulo: "Ver detalle de habitación", prioridad: "Must", moscow: "M", sp: 5, sprint: 1, estado: "Ready", dor: true },
  { id: "US-07", epic: "Reservas", titulo: "Realizar reserva online", prioridad: "Must", moscow: "M", sp: 13, sprint: 1, estado: "Ready", dor: true },
  { id: "US-11", epic: "Administración", titulo: "Dashboard de métricas", prioridad: "Must", moscow: "M", sp: 8, sprint: 2, estado: "Refinado", dor: false },
  { id: "US-15", epic: "Notificaciones", titulo: "Notificaciones automáticas por correo", prioridad: "Must", moscow: "M", sp: 8, sprint: 2, estado: "Refinado", dor: false },
  { id: "US-06", epic: "Habitaciones", titulo: "Gestionar catálogo de habitaciones", prioridad: "Must", moscow: "M", sp: 8, sprint: 2, estado: "Refinado", dor: false },
  { id: "US-08", epic: "Reservas", titulo: "Cancelar reserva", prioridad: "Must", moscow: "M", sp: 8, sprint: 2, estado: "Refinado", dor: false },
  { id: "US-12", epic: "Administración", titulo: "Gestionar todas las reservas", prioridad: "Must", moscow: "M", sp: 13, sprint: 2, estado: "Refinado", dor: false },
  { id: "US-03", epic: "Autenticación", titulo: "Recuperación de contraseña", prioridad: "Must", moscow: "M", sp: 3, sprint: 3, estado: "Pendiente", dor: false },
  { id: "US-09", epic: "Reservas", titulo: "Ver historial de reservas", prioridad: "Should", moscow: "S", sp: 5, sprint: 3, estado: "Pendiente", dor: false },
  { id: "US-13", epic: "Administración", titulo: "Generar reportes", prioridad: "Should", moscow: "S", sp: 8, sprint: 3, estado: "Pendiente", dor: false },
  { id: "US-14", epic: "Administración", titulo: "Gestionar tarifas y temporadas", prioridad: "Should", moscow: "S", sp: 5, sprint: 3, estado: "Pendiente", dor: false },
  { id: "US-10", epic: "Reservas", titulo: "Agregar servicios adicionales", prioridad: "Could", moscow: "C", sp: 5, sprint: 4, estado: "Pendiente", dor: false },
];

const sprints = [
  { num: 1, nombre: "Sprint 1 — MVP Core", duracion: "2 semanas", sp: 44, items: ["US-01", "US-02", "US-04", "US-05", "US-07"] },
  { num: 2, nombre: "Sprint 2 — Administración", duracion: "2 semanas", sp: 45, items: ["US-11", "US-15", "US-06", "US-08", "US-12"] },
  { num: 3, nombre: "Sprint 3 — Reportes y Mejoras", duracion: "2 semanas", sp: 21, items: ["US-03", "US-09", "US-13", "US-14"] },
  { num: 4, nombre: "Sprint 4 — Extras y Calidad", duracion: "2 semanas", sp: 5, items: ["US-10"] },
];

const dorItems = [
  "La historia de usuario está escrita en formato estándar (Como... quiero... para...)",
  "Los criterios de aceptación están definidos y son verificables",
  "La historia está estimada en Story Points (usando Fibonacci)",
  "No hay dependencias bloqueantes con otras historias",
  "El equipo comprende claramente el alcance de la historia",
  "Los diseños de UI/UX relevantes están disponibles (wireframes aprobados)",
  "Los criterios de aceptación técnicos están acordados con el equipo",
];

const dodItems = [
  "El código está implementado y cumple todos los criterios de aceptación",
  "El código ha pasado revisión de código (Code Review) por al menos 1 integrante",
  "Las pruebas unitarias están escritas con cobertura mínima del 70%",
  "Las pruebas de integración relevantes están implementadas y pasan",
  "El código está integrado en la rama principal (sin conflictos)",
  "El pipeline de CI/CD ha ejecutado exitosamente todos los stages",
  "La documentación técnica está actualizada (API, cambios de BD)",
  "La historia ha sido demostrada y aprobada por el Product Owner",
  "No hay deuda técnica crítica identificada sin ticket creado",
];

const sprintColors: Record<number, string> = {
  1: "bg-green-100 text-green-800",
  2: "bg-blue-100 text-blue-800",
  3: "bg-orange-100 text-orange-800",
  4: "bg-purple-100 text-purple-800",
};

export default function BacklogPage() {
  const totalSP = backlogItems.reduce((acc, i) => acc + i.sp, 0);

  return (
    <div className="space-y-8">
      <div className="border-b border-border pb-6">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-xs font-semibold uppercase tracking-widest text-primary bg-primary/10 px-3 py-1 rounded-full">Entregable 4.3</span>
          <span className="text-xs text-muted-foreground">Ponderación: 1.0 pt</span>
        </div>
        <h1 className="text-3xl font-bold text-foreground">Product Backlog</h1>
        <p className="mt-2 text-muted-foreground">Backlog priorizado por valor de negocio, estimado en Story Points y organizado en épicas y sprints</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-xl p-4 text-center">
          <div className="text-3xl font-bold text-primary">{backlogItems.length}</div>
          <div className="text-sm text-muted-foreground">Historias de Usuario</div>
        </div>
        <div className="bg-card border border-border rounded-xl p-4 text-center">
          <div className="text-3xl font-bold text-primary">{totalSP}</div>
          <div className="text-sm text-muted-foreground">Story Points Total</div>
        </div>
        <div className="bg-card border border-border rounded-xl p-4 text-center">
          <div className="text-3xl font-bold text-primary">4</div>
          <div className="text-sm text-muted-foreground">Sprints (8 semanas)</div>
        </div>
        <div className="bg-card border border-border rounded-xl p-4 text-center">
          <div className="text-3xl font-bold text-primary">5</div>
          <div className="text-sm text-muted-foreground">Épicas</div>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl p-6">
        <h2 className="text-xl font-bold text-primary mb-4">Planificación de Sprints</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {sprints.map((sprint) => (
            <div key={sprint.num} className="border border-border rounded-xl overflow-hidden">
              <div className={`px-4 py-3 font-bold text-sm ${sprintColors[sprint.num]}`}>
                {sprint.nombre}
              </div>
              <div className="p-3 space-y-2">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{sprint.duracion}</span>
                  <span className="font-bold text-foreground">{sprint.sp} SP</span>
                </div>
                <div className="space-y-1">
                  {sprint.items.map((id) => {
                    const item = backlogItems.find(i => i.id === id);
                    return item ? (
                      <div key={id} className="text-xs bg-muted/40 rounded px-2 py-1 flex justify-between items-center">
                        <span className="font-mono text-primary">{id}</span>
                        <span className="text-muted-foreground">{item.sp} SP</span>
                      </div>
                    ) : null;
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl p-6">
        <h2 className="text-xl font-bold text-primary mb-4">Backlog Completo — Priorizado por Valor de Negocio</h2>
        <div className="overflow-x-auto">
          <table className="table-doc w-full">
            <thead>
              <tr>
                <th>ID</th>
                <th>Épica</th>
                <th>Historia de Usuario</th>
                <th>MoSCoW</th>
                <th>SP (Fibonacci)</th>
                <th>T-Shirt</th>
                <th>Sprint</th>
                <th>Estado</th>
                <th>DoR</th>
              </tr>
            </thead>
            <tbody>
              {backlogItems.map((item) => (
                <tr key={item.id}>
                  <td className="font-mono text-xs font-bold text-primary">{item.id}</td>
                  <td className="text-xs">{item.epic}</td>
                  <td className="text-sm">{item.titulo}</td>
                  <td>
                    <span className={
                      item.moscow === "M" ? "badge-must" :
                      item.moscow === "S" ? "badge-should" :
                      item.moscow === "C" ? "badge-could" : "badge-wont"
                    }>
                      {item.moscow === "M" ? "Must" : item.moscow === "S" ? "Should" : item.moscow === "C" ? "Could" : "Won't"}
                    </span>
                  </td>
                  <td className="text-center font-bold">{item.sp}</td>
                  <td className="text-center">
                    <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded font-bold">
                      {item.sp <= 3 ? "XS" : item.sp <= 5 ? "S" : item.sp <= 8 ? "M" : "L"}
                    </span>
                  </td>
                  <td>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${sprintColors[item.sprint]}`}>
                      Sprint {item.sprint}
                    </span>
                  </td>
                  <td>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                      item.estado === "Ready" ? "bg-green-100 text-green-800" :
                      item.estado === "Refinado" ? "bg-yellow-100 text-yellow-800" :
                      "bg-gray-100 text-gray-600"
                    }`}>
                      {item.estado}
                    </span>
                  </td>
                  <td className="text-center">
                    {item.dor ? (
                      <span className="text-green-600 font-bold">✓</span>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-muted-foreground mt-3">
          Fibonacci: 1, 2, 3, 5, 8, 13, 21 | T-Shirt: XS(1-2), S(3-5), M(8), L(13), XL(21)
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-card border border-border rounded-xl p-6">
          <h2 className="text-xl font-bold text-green-700 mb-4">Definition of Ready (DoR)</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Una historia de usuario está lista para ser desarrollada cuando cumple TODOS los siguientes criterios:
          </p>
          <ul className="space-y-2">
            {dorItems.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-sm">
                <span className="text-green-600 shrink-0 mt-0.5 font-bold">✓</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-card border border-border rounded-xl p-6">
          <h2 className="text-xl font-bold text-blue-700 mb-4">Definition of Done (DoD)</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Una historia de usuario está COMPLETADA cuando cumple TODOS los siguientes criterios:
          </p>
          <ul className="space-y-2">
            {dodItems.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-sm">
                <span className="text-blue-600 shrink-0 mt-0.5 font-bold">✓</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
        <h3 className="font-bold text-amber-900 mb-2">Evidencia del Product Backlog</h3>
        <p className="text-sm text-amber-800 mb-3">
          El Product Backlog se gestiona en <strong>GitHub Projects</strong> del repositorio del curso.
          A continuación se describe la configuración:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="bg-white rounded-lg p-3 border border-amber-200">
            <h4 className="font-semibold text-amber-900 mb-1">Herramienta</h4>
            <p className="text-amber-800">GitHub Projects (tablero Kanban con campos personalizados)</p>
          </div>
          <div className="bg-white rounded-lg p-3 border border-amber-200">
            <h4 className="font-semibold text-amber-900 mb-1">Campos Configurados</h4>
            <p className="text-amber-800">Story Points, MoSCoW, Sprint, Estado, Épica, Asignado a</p>
          </div>
          <div className="bg-white rounded-lg p-3 border border-amber-200">
            <h4 className="font-semibold text-amber-900 mb-1">Vistas del Tablero</h4>
            <p className="text-amber-800">Vista Backlog, Vista Sprint Actual, Vista por Épica, Roadmap</p>
          </div>
        </div>
      </div>
    </div>
  );
}
