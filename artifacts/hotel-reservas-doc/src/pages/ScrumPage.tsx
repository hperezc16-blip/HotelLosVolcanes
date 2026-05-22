export default function ScrumPage() {
  return (
    <div className="space-y-8">
      <div className="border-b border-border pb-6">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-xs font-semibold uppercase tracking-widest text-primary bg-primary/10 px-3 py-1 rounded-full">Entregable 4.7</span>
          <span className="text-xs text-muted-foreground">Ponderación: 0.5 pts</span>
        </div>
        <h1 className="text-3xl font-bold text-foreground">Planificación Scrum</h1>
        <p className="mt-2 text-muted-foreground">Equipo, roles, calendario de sprints, Definition of Ready y Definition of Done</p>
      </div>

      <section className="bg-card border border-border rounded-xl p-6 space-y-4">
        <h2 className="text-xl font-bold text-primary">Equipo Scrum</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              rol: "Product Owner",
              nombre: "Hazel Ruvi Pérez Cárcamo",
              id: "0900-21-13727",
              email: "hperezc16@miumg.edu.gt",
              color: "bg-blue-50 border-blue-200",
              iconColor: "bg-blue-600",
              icon: "👑",
              responsabilidades: [
                "Definir y priorizar el Product Backlog",
                "Representar los intereses del negocio",
                "Aceptar o rechazar entregables del Sprint",
                "Clarificar requerimientos con el equipo",
                "Gestionar expectativas de stakeholders"
              ]
            },
            {
              rol: "Scrum Master",
              nombre: "Por asignar en Fase II",
              id: "—",
              email: "—",
              color: "bg-green-50 border-green-200",
              iconColor: "bg-green-600",
              icon: "🛡️",
              responsabilidades: [
                "Facilitar ceremonias Scrum",
                "Remover impedimentos del equipo",
                "Proteger al equipo de interrupciones externas",
                "Guiar adopción de prácticas Agile",
                "Fomentar mejora continua"
              ]
            },
            {
              rol: "Development Team",
              nombre: "Hasta 3 integrantes (Fase II)",
              id: "—",
              email: "—",
              color: "bg-orange-50 border-orange-200",
              iconColor: "bg-orange-600",
              icon: "⚡",
              responsabilidades: [
                "Diseñar e implementar funcionalidades",
                "Estimar historias de usuario en SP",
                "Participar en el refinamiento del backlog",
                "Escribir pruebas unitarias e integración",
                "Mantener el pipeline CI/CD actualizado"
              ]
            }
          ].map((member) => (
            <div key={member.rol} className={`border rounded-xl p-5 ${member.color}`}>
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-10 h-10 rounded-full ${member.iconColor} text-white flex items-center justify-center text-xl`}>{member.icon}</div>
                <div>
                  <div className="font-bold text-sm">{member.rol}</div>
                  <div className="text-xs text-muted-foreground">{member.nombre}</div>
                </div>
              </div>
              {member.id !== "—" && (
                <div className="bg-white/60 rounded-lg p-2 mb-3 text-xs space-y-0.5">
                  <div><span className="font-semibold">Carné:</span> {member.id}</div>
                  <div><span className="font-semibold">Email:</span> {member.email}</div>
                </div>
              )}
              <div>
                <div className="text-xs font-bold mb-1 text-muted-foreground uppercase">Responsabilidades</div>
                <ul className="space-y-1">
                  {member.responsabilidades.map((r, i) => (
                    <li key={i} className="flex items-start gap-1.5 text-xs">
                      <span className="text-green-600 shrink-0 mt-0.5">•</span>
                      {r}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-card border border-border rounded-xl p-6 space-y-4">
        <h2 className="text-xl font-bold text-primary">Calendario de Sprints — Fase II</h2>
        <div className="overflow-x-auto">
          <table className="table-doc w-full">
            <thead>
              <tr>
                <th>Sprint</th>
                <th>Nombre</th>
                <th>Duración</th>
                <th>Fecha Inicio</th>
                <th>Fecha Fin</th>
                <th>Story Points</th>
                <th>Objetivo</th>
              </tr>
            </thead>
            <tbody>
              {[
                { num: "Sprint 0", nombre: "Planificación (Fase I)", dur: "4 semanas", inicio: "Semana 1", fin: "Semana 4", sp: "—", obj: "Análisis, diseño, requerimientos y arquitectura" },
                { num: "Sprint 1", nombre: "MVP Core — Auth + Búsqueda + Reserva", dur: "2 semanas", inicio: "Semana 5", fin: "Semana 6", sp: "44", obj: "Registro, login, búsqueda de habitaciones y reserva funcional" },
                { num: "Sprint 2", nombre: "Administración y Notificaciones", dur: "2 semanas", inicio: "Semana 7", fin: "Semana 8", sp: "45", obj: "Dashboard admin, gestión de reservas y notificaciones email" },
                { num: "Sprint 3", nombre: "Reportes, Historial y Mejoras", dur: "2 semanas", inicio: "Semana 9", fin: "Semana 10", sp: "21", obj: "Generación de reportes, historial de reservas y tarifas" },
                { num: "Sprint 4", nombre: "Extras, Pruebas y Despliegue", dur: "2 semanas", inicio: "Semana 11", fin: "Semana 12", sp: "5+", obj: "Servicios adicionales, pruebas completas, despliegue a producción" },
              ].map((sprint, i) => (
                <tr key={sprint.num}>
                  <td>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                      i === 0 ? 'bg-gray-100 text-gray-700' :
                      i === 1 ? 'bg-green-100 text-green-800' :
                      i === 2 ? 'bg-blue-100 text-blue-800' :
                      i === 3 ? 'bg-orange-100 text-orange-800' :
                      'bg-purple-100 text-purple-800'
                    }`}>{sprint.num}</span>
                  </td>
                  <td className="font-semibold text-sm">{sprint.nombre}</td>
                  <td className="text-xs">{sprint.dur}</td>
                  <td className="text-xs font-mono">{sprint.inicio}</td>
                  <td className="text-xs font-mono">{sprint.fin}</td>
                  <td className="text-center font-bold">{sprint.sp}</td>
                  <td className="text-xs">{sprint.obj}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="bg-card border border-border rounded-xl p-6 space-y-4">
        <h2 className="text-xl font-bold text-primary">Ceremonias Scrum</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            {
              nombre: "Sprint Planning",
              duración: "2 horas máx.",
              frecuencia: "Inicio de cada sprint",
              color: "bg-blue-50 border-blue-200",
              puntos: [
                "Revisar y seleccionar historias del Backlog",
                "Definir Sprint Goal claro y alcanzable",
                "Estimar y asignar tareas técnicas",
                "Verificar DoR de las historias seleccionadas",
                "Crear el Sprint Backlog en GitHub Projects",
              ]
            },
            {
              nombre: "Daily Scrum",
              duración: "15 minutos",
              frecuencia: "Cada día del Sprint",
              color: "bg-green-50 border-green-200",
              puntos: [
                "¿Qué hice ayer para avanzar al Sprint Goal?",
                "¿Qué haré hoy para avanzar al Sprint Goal?",
                "¿Hay algún impedimento que me bloquea?",
                "El Scrum Master registra los impedimentos",
                "Se realiza por videoconferencia (Teams/Meet)",
              ]
            },
            {
              nombre: "Sprint Review",
              duración: "1 hora máx.",
              frecuencia: "Final de cada sprint",
              color: "bg-orange-50 border-orange-200",
              puntos: [
                "Demo funcional de las historias completadas",
                "Product Owner acepta o rechaza entregables",
                "Feedback de stakeholders registrado",
                "Actualizar el Product Backlog según feedback",
                "Actualizar el Release Plan si es necesario",
              ]
            },
            {
              nombre: "Sprint Retrospective",
              duración: "45 minutos",
              frecuencia: "Post Sprint Review",
              color: "bg-purple-50 border-purple-200",
              puntos: [
                "¿Qué hicimos bien en este Sprint?",
                "¿Qué podemos mejorar en el próximo?",
                "Identificar acciones concretas de mejora",
                "Verificar acciones del sprint anterior",
                "Formato: Start / Stop / Continue",
              ]
            },
            {
              nombre: "Backlog Refinement",
              duración: "1 hora",
              frecuencia: "Mitad de cada sprint",
              color: "bg-teal-50 border-teal-200",
              puntos: [
                "Revisar y estimar historias del próximo sprint",
                "Verificar DoR de historias candidatas",
                "Dividir historias grandes (épicas) en tareas",
                "Clarificar criterios de aceptación ambiguos",
                "Re-priorizar el Backlog si es necesario",
              ]
            },
          ].map((c) => (
            <div key={c.nombre} className={`border rounded-xl p-4 ${c.color}`}>
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="font-bold">{c.nombre}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{c.frecuencia}</div>
                </div>
                <span className="text-xs bg-white/60 px-2 py-0.5 rounded-full font-semibold">{c.duración}</span>
              </div>
              <ul className="space-y-1">
                {c.puntos.map((p, i) => (
                  <li key={i} className="flex items-start gap-1.5 text-xs">
                    <span className="text-primary shrink-0">•</span>
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-card border border-border rounded-xl p-6 space-y-4">
        <h2 className="text-xl font-bold text-primary">Métricas de Seguimiento</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="bg-muted/30 rounded-xl p-4">
            <h3 className="font-bold mb-2">Burndown Chart</h3>
            <div className="text-xs text-muted-foreground space-y-1">
              <p>Actualizado diariamente en GitHub Projects</p>
              <p>Muestra SP completados vs planificados</p>
              <p>Permite detectar riesgo de no completar sprint a tiempo</p>
            </div>
          </div>
          <div className="bg-muted/30 rounded-xl p-4">
            <h3 className="font-bold mb-2">Velocity</h3>
            <div className="text-xs text-muted-foreground space-y-1">
              <p>Promedio de SP completados por sprint</p>
              <p>Calculado a partir del Sprint 2</p>
              <p>Usado para predecir capacidad de sprints futuros</p>
            </div>
          </div>
          <div className="bg-muted/30 rounded-xl p-4">
            <h3 className="font-bold mb-2">Lead Time y Cycle Time</h3>
            <div className="text-xs text-muted-foreground space-y-1">
              <p>Tiempo desde creación hasta entrega de la historia</p>
              <p>Tiempo desde inicio del desarrollo hasta entrega</p>
              <p>Seguimiento en tablero Kanban de GitHub Projects</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
