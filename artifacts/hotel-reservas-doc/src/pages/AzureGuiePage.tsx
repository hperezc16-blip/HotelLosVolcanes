export default function AzureGuiePage() {
  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="text-center space-y-2 pb-4 border-b border-border">
        <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-blue-700 bg-blue-50 px-4 py-1.5 rounded-full">
          Guía Paso a Paso
        </div>
        <h1 className="text-3xl font-bold">Qué hacer en Azure DevOps</h1>
        <p className="text-muted-foreground">Instrucciones completas para configurar tu proyecto en Azure DevOps para la Fase I</p>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
        <strong>Nota:</strong> Azure DevOps es <strong>gratuito</strong> para proyectos con menos de 5 usuarios. Solo necesitas crear una cuenta en <strong>dev.azure.com</strong> con tu correo UMG.
      </div>

      {/* PASO 1 */}
      <StepSection num={1} title="Crear tu cuenta y organización en Azure DevOps">
        <ol className="list-decimal list-inside space-y-2 text-sm">
          <li>Ve a <strong>dev.azure.com</strong> desde tu navegador</li>
          <li>Haz clic en <strong>"Start free"</strong> (es gratis)</li>
          <li>Inicia sesión con tu correo de Microsoft o crea una cuenta con tu correo institucional <strong>hperezc16@miumg.edu.gt</strong></li>
          <li>Azure te pedirá crear una <strong>Organización</strong> — ponle un nombre como <code className="bg-muted px-1 rounded">HazelUMG</code> o <code className="bg-muted px-1 rounded">ReservasHotel2025</code></li>
          <li>Cuando te pregunte por el país, selecciona <strong>United States</strong> (para tener acceso completo)</li>
        </ol>
      </StepSection>

      {/* PASO 2 */}
      <StepSection num={2} title="Crear el Proyecto en Azure DevOps">
        <ol className="list-decimal list-inside space-y-2 text-sm">
          <li>Dentro de tu organización, haz clic en <strong>"New Project"</strong> (botón azul arriba a la derecha)</li>
          <li>Llena los datos del proyecto:
            <div className="mt-2 bg-muted/50 rounded-lg p-3 space-y-1 text-xs font-mono">
              <div><span className="text-muted-foreground">Nombre:</span> <strong>SistemaReservasHotel</strong></div>
              <div><span className="text-muted-foreground">Descripción:</span> <strong>Sistema de Reservas para Hotel o Casa Rural — Ingeniería de Software UMG</strong></div>
              <div><span className="text-muted-foreground">Visibilidad:</span> <strong>Private</strong></div>
              <div><span className="text-muted-foreground">Control de versiones:</span> <strong>Git</strong></div>
              <div><span className="text-muted-foreground">Proceso de trabajo:</span> <strong>Scrum</strong> ← MUY IMPORTANTE</div>
            </div>
          </li>
          <li>Haz clic en <strong>"Create"</strong></li>
        </ol>
        <div className="mt-3 bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs text-blue-800">
          Seleccionar el proceso <strong>Scrum</strong> es importante porque automáticamente tendrás Product Backlog, Sprints y tableros Kanban disponibles.
        </div>
      </StepSection>

      {/* PASO 3 */}
      <StepSection num={3} title="Configurar el Product Backlog (Historias de Usuario)">
        <p className="text-sm text-muted-foreground mb-3">Ve a la sección <strong>Boards → Backlogs</strong> en el menú izquierdo.</p>
        <p className="text-sm font-semibold mb-2">Debes crear las siguientes Épicas primero:</p>
        <div className="overflow-x-auto">
          <table className="table-doc text-xs">
            <thead>
              <tr>
                <th>Épica</th>
                <th>Descripción</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["EP-01: Autenticación y Usuarios", "Registro, login, recuperación de contraseña"],
                ["EP-02: Gestión de Habitaciones", "Búsqueda, detalle, catálogo de habitaciones"],
                ["EP-03: Sistema de Reservas", "Hacer reservas, cancelar, historial, servicios adicionales"],
                ["EP-04: Administración del Sistema", "Dashboard, reportes, gestión de reservas, tarifas"],
                ["EP-05: Notificaciones", "Emails automáticos al hacer/cancelar reservas"],
              ].map(([epic, desc]) => (
                <tr key={epic}>
                  <td className="font-semibold">{epic}</td>
                  <td>{desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="text-sm font-semibold mt-4 mb-2">Luego crea estas 15 Historias de Usuario (Product Backlog Items):</p>
        <div className="overflow-x-auto">
          <table className="table-doc text-xs">
            <thead>
              <tr>
                <th>ID</th>
                <th>Historia de Usuario</th>
                <th>Épica</th>
                <th>Prioridad</th>
                <th>Story Points</th>
                <th>Sprint</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["US-01", "Como cliente quiero registrarme para crear una cuenta", "EP-01", "Must", "8", "Sprint 1"],
                ["US-02", "Como usuario quiero iniciar sesión con JWT para acceder al sistema", "EP-01", "Must", "5", "Sprint 1"],
                ["US-03", "Como usuario quiero recuperar mi contraseña por email", "EP-01", "Must", "3", "Sprint 3"],
                ["US-04", "Como cliente quiero buscar habitaciones disponibles por fechas", "EP-02", "Must", "13", "Sprint 1"],
                ["US-05", "Como cliente quiero ver el detalle y fotos de una habitación", "EP-02", "Must", "5", "Sprint 1"],
                ["US-06", "Como admin quiero gestionar el catálogo de habitaciones", "EP-02", "Must", "8", "Sprint 2"],
                ["US-07", "Como cliente quiero realizar una reserva en línea", "EP-03", "Must", "13", "Sprint 1"],
                ["US-08", "Como cliente quiero cancelar una reserva con reembolso", "EP-03", "Must", "8", "Sprint 2"],
                ["US-09", "Como cliente quiero ver mi historial de reservas", "EP-03", "Should", "5", "Sprint 3"],
                ["US-10", "Como cliente quiero agregar servicios adicionales a mi reserva", "EP-03", "Could", "5", "Sprint 4"],
                ["US-11", "Como admin quiero ver un dashboard con métricas del hotel", "EP-04", "Must", "8", "Sprint 2"],
                ["US-12", "Como admin quiero gestionar todas las reservas del sistema", "EP-04", "Must", "13", "Sprint 2"],
                ["US-13", "Como admin quiero generar reportes de ocupación", "EP-04", "Should", "8", "Sprint 3"],
                ["US-14", "Como admin quiero gestionar tarifas y temporadas", "EP-04", "Should", "5", "Sprint 3"],
                ["US-15", "Como sistema quiero enviar notificaciones automáticas por correo", "EP-05", "Must", "8", "Sprint 2"],
              ].map(([id, hu, epic, prio, sp, sprint]) => (
                <tr key={id}>
                  <td className="font-mono font-bold text-primary">{id}</td>
                  <td>{hu}</td>
                  <td className="text-xs text-muted-foreground">{epic}</td>
                  <td>
                    <span className={prio === "Must" ? "badge-must" : prio === "Should" ? "badge-should" : prio === "Could" ? "badge-could" : "badge-wont"}>
                      {prio}
                    </span>
                  </td>
                  <td className="text-center font-semibold">{sp}</td>
                  <td className="text-xs">{sprint}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-3 bg-green-50 border border-green-200 rounded-lg p-3 text-xs text-green-800">
          <strong>Cómo agregar cada historia en Azure:</strong> En Backlogs → clic en "+ New Work Item" → selecciona "Product Backlog Item" → escribe el título → guarda → luego abre cada una para agregar Story Points, Épica, Sprint y descripción completa.
        </div>
      </StepSection>

      {/* PASO 4 */}
      <StepSection num={4} title="Crear los Sprints">
        <p className="text-sm text-muted-foreground mb-3">Ve a <strong>Boards → Sprints</strong> en el menú izquierdo.</p>
        <ol className="list-decimal list-inside space-y-2 text-sm">
          <li>Haz clic en <strong>"New Sprint"</strong></li>
          <li>Crea los 4 sprints con estas fechas (ajusta según tu calendario real de clases):</li>
        </ol>
        <div className="overflow-x-auto mt-3">
          <table className="table-doc text-sm">
            <thead>
              <tr>
                <th>Sprint</th>
                <th>Nombre</th>
                <th>Duración</th>
                <th>Story Points</th>
                <th>Historias incluidas</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["Sprint 1", "MVP Core", "2 semanas", "44 SP", "US-01, US-02, US-04, US-05, US-07"],
                ["Sprint 2", "Administración", "2 semanas", "45 SP", "US-06, US-08, US-11, US-12, US-15"],
                ["Sprint 3", "Reportes y Mejoras", "2 semanas", "21 SP", "US-03, US-09, US-13, US-14"],
                ["Sprint 4", "Extras y Calidad", "2 semanas", "5 SP", "US-10"],
              ].map(([sprint, nombre, dur, sp, his]) => (
                <tr key={sprint}>
                  <td className="font-bold">{sprint}</td>
                  <td>{nombre}</td>
                  <td>{dur}</td>
                  <td className="font-semibold text-primary">{sp}</td>
                  <td className="text-xs font-mono">{his}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <ol className="list-decimal list-inside space-y-2 text-sm mt-3" start={3}>
          <li>Arrastra cada Historia de Usuario al sprint correspondiente desde el Backlog</li>
          <li>Configura el <strong>Sprint Goal</strong> para el Sprint 1: <em>"Implementar el flujo completo de búsqueda y reserva de habitaciones para el cliente"</em></li>
        </ol>
      </StepSection>

      {/* PASO 5 */}
      <StepSection num={5} title="Agregar criterios de aceptación a cada Historia">
        <p className="text-sm text-muted-foreground mb-3">
          Abre cada Historia de Usuario y en el campo <strong>"Description"</strong> o <strong>"Acceptance Criteria"</strong> agrega los criterios. Ejemplo para US-07:
        </p>
        <div className="bg-muted/50 rounded-lg p-4 text-xs font-mono space-y-1 border border-border">
          <div className="font-bold text-foreground mb-2">US-07: Como cliente quiero realizar una reserva en línea</div>
          <div className="text-muted-foreground">CRITERIOS DE ACEPTACIÓN:</div>
          <div>✓ El cliente puede seleccionar fechas de entrada y salida</div>
          <div>✓ El sistema valida disponibilidad en tiempo real</div>
          <div>✓ El sistema calcula el precio total automáticamente</div>
          <div>✓ El cliente recibe confirmación por correo al completar la reserva</div>
          <div>✓ La reserva queda registrada con estado "Confirmada" en el sistema</div>
          <div>✓ Si no hay disponibilidad, el sistema muestra un mensaje claro</div>
        </div>
      </StepSection>

      {/* PASO 6 */}
      <StepSection num={6} title="Configurar el Tablero Kanban">
        <p className="text-sm text-muted-foreground mb-2">Ve a <strong>Boards → Boards</strong> para ver el tablero Kanban.</p>
        <ol className="list-decimal list-inside space-y-2 text-sm">
          <li>Verás columnas: <strong>New → Active → Resolved → Closed</strong></li>
          <li>Puedes personalizar las columnas: haz clic en el ícono de engranaje (⚙️) arriba a la derecha del tablero</li>
          <li>Agrega columnas intermedias: <strong>"In Progress"</strong> y <strong>"In Review"</strong></li>
          <li>Mueve las historias del Sprint 1 a <strong>"Active"</strong> cuando empieces a trabajar en ellas</li>
        </ol>
        <div className="mt-3 bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs text-blue-800">
          <strong>Para la entrega:</strong> Toma una captura de pantalla del tablero con las historias organizadas. Incluye esa captura en tu PDF como evidencia.
        </div>
      </StepSection>

      {/* PASO 7 */}
      <StepSection num={7} title="Conectar con tu repositorio Git (para la Fase II)">
        <p className="text-sm text-muted-foreground mb-2">Esto lo usarás en la Fase II, pero puedes dejarlo listo ahora:</p>
        <ol className="list-decimal list-inside space-y-2 text-sm">
          <li>Ve a <strong>Repos</strong> en el menú izquierdo</li>
          <li>Azure ya creó un repositorio Git vacío con el nombre de tu proyecto</li>
          <li>Puedes clonar el repositorio con el comando que te da la pantalla</li>
          <li>Alternativamente, también puedes usar <strong>GitHub</strong> y vincularlo a Azure DevOps desde <strong>Project Settings → Service Connections → GitHub</strong></li>
        </ol>
      </StepSection>

      {/* Resumen */}
      <div className="bg-primary/5 border border-primary/20 rounded-xl p-6">
        <h3 className="font-bold text-primary mb-3">Resumen: Capturas que necesitas para tu PDF</h3>
        <ul className="space-y-2 text-sm">
          {[
            "Pantalla del Backlog con las 15 historias de usuario creadas",
            "Vista de los 4 Sprints con sus historias asignadas",
            "Detalle de al menos 3 historias mostrando criterios de aceptación y Story Points",
            "Tablero Kanban con las columnas configuradas",
            "Sprint Goal del Sprint 1 visible",
          ].map((item, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="text-primary font-bold shrink-0">{i + 1}.</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function StepSection({ num, title, children }: { num: number; title: string; children: React.ReactNode }) {
  return (
    <div className="border border-border rounded-xl overflow-hidden">
      <div className="bg-primary text-primary-foreground px-5 py-3 flex items-center gap-3">
        <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center font-bold text-sm shrink-0">
          {num}
        </div>
        <h2 className="font-bold text-base">{title}</h2>
      </div>
      <div className="p-5 space-y-3">{children}</div>
    </div>
  );
}
