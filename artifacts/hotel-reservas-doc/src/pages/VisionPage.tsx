export default function VisionPage() {
  return (
    <div className="space-y-8">
      <div className="border-b border-border pb-6">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-xs font-semibold uppercase tracking-widest text-primary bg-primary/10 px-3 py-1 rounded-full">Entregable 4.1</span>
          <span className="text-xs text-muted-foreground">Ponderación: 1.5 pts</span>
        </div>
        <h1 className="text-3xl font-bold text-foreground">Documento de Visión del Producto</h1>
        <p className="mt-2 text-muted-foreground">Sistema de Reservas para Hotel o Casa Rural</p>
      </div>

      <section className="bg-card border border-border rounded-xl p-6 space-y-4">
        <h2 className="text-xl font-bold text-primary flex items-center gap-2">
          <span className="w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">1</span>
          Descripción del Problema
        </h2>
        <div className="space-y-3 text-foreground leading-relaxed">
          <p>
            El sector hotelero y de casas rurales en Guatemala enfrenta importantes desafíos en la gestión manual de reservaciones.
            Actualmente, muchos establecimientos de hospedaje de pequeño y mediano tamaño dependen de registros físicos, llamadas
            telefónicas y hojas de cálculo para administrar sus reservas, lo que genera una serie de problemas críticos.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h3 className="font-semibold text-red-800 mb-2">Impacto en Clientes</h3>
              <ul className="text-sm text-red-700 space-y-1">
                <li>Proceso de reserva lento y propenso a errores</li>
                <li>Sin confirmaciones inmediatas</li>
                <li>Imposibilidad de reservar fuera del horario de atención</li>
                <li>Dobles reservaciones y pérdida de datos</li>
              </ul>
            </div>
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <h3 className="font-semibold text-orange-800 mb-2">Impacto Operativo</h3>
              <ul className="text-sm text-orange-700 space-y-1">
                <li>Pérdida estimada del 30% de reservas potenciales</li>
                <li>Overbooking frecuente</li>
                <li>Sin reportes ni métricas de ocupación</li>
                <li>Gestión ineficiente del personal</li>
              </ul>
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <h3 className="font-semibold text-amber-800 mb-2">Impacto Económico</h3>
              <ul className="text-sm text-amber-700 space-y-1">
                <li>Pérdida de Q3,000–Q8,000 mensuales por reservas fallidas</li>
                <li>Competencia con plataformas digitales</li>
                <li>Dificultad para escalar el negocio</li>
                <li>Clientes insatisfechos y sin retención</li>
              </ul>
            </div>
          </div>
          <p className="mt-3">
            <strong>Afectados:</strong> Propietarios y administradores de hoteles/casas rurales, clientes nacionales e internacionales,
            personal de recepción y limpieza, y el sector turístico guatemalteco en general.
          </p>
        </div>
      </section>

      <section className="bg-card border border-border rounded-xl p-6 space-y-4">
        <h2 className="text-xl font-bold text-primary flex items-center gap-2">
          <span className="w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">2</span>
          Objetivos del Sistema
        </h2>
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-bold text-blue-900 mb-2">Objetivo General</h3>
            <p className="text-blue-800">
              Desarrollar un sistema web de gestión de reservas para hoteles y casas rurales que automatice el proceso de reservación,
              mejore la experiencia del cliente y optimice la administración de habitaciones, incrementando la ocupación en un 25%
              durante los primeros seis meses de implementación.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-3 text-foreground">Objetivos Específicos (SMART)</h3>
            <div className="space-y-3">
              {[
                {
                  num: "OE-01",
                  text: "Implementar un módulo de reservas en línea que permita a los clientes reservar habitaciones en menos de 5 minutos, disponible las 24 horas, en un plazo de 3 meses.",
                  smart: ["Específico", "Medible (5 min)", "Alcanzable", "Relevante", "Tiempo: 3 meses"]
                },
                {
                  num: "OE-02",
                  text: "Reducir el índice de overbooking a 0% mediante un sistema de control de disponibilidad en tiempo real, medible desde el primer mes de operación.",
                  smart: ["Específico", "Medible (0%)", "Alcanzable", "Relevante", "Tiempo: 1 mes"]
                },
                {
                  num: "OE-03",
                  text: "Proveer un panel de administración que genere reportes de ocupación, ingresos y tendencias con actualización diaria automática, en un plazo de 4 meses.",
                  smart: ["Específico", "Medible", "Alcanzable", "Relevante", "Tiempo: 4 meses"]
                },
                {
                  num: "OE-04",
                  text: "Integrar un sistema de notificaciones automáticas por correo electrónico que confirme reservas en menos de 30 segundos después de realizadas, implementado en 2 meses.",
                  smart: ["Específico", "Medible (30 seg)", "Alcanzable", "Relevante", "Tiempo: 2 meses"]
                },
                {
                  num: "OE-05",
                  text: "Implementar autenticación segura de usuarios con roles diferenciados (cliente, administrador, recepcionista) que cumpla con estándares OWASP, en un plazo de 2 meses.",
                  smart: ["Específico", "Medible (OWASP)", "Alcanzable", "Relevante", "Tiempo: 2 meses"]
                },
              ].map((obj) => (
                <div key={obj.num} className="flex gap-3 bg-muted/30 rounded-lg p-3">
                  <span className="shrink-0 text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded h-fit mt-0.5">{obj.num}</span>
                  <div className="flex-1">
                    <p className="text-sm text-foreground">{obj.text}</p>
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {obj.smart.map((s, i) => (
                        <span key={i} className="text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded">{s}</span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-card border border-border rounded-xl p-6 space-y-4">
        <h2 className="text-xl font-bold text-primary flex items-center gap-2">
          <span className="w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">3</span>
          Alcance del Sistema
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-green-700 mb-3 flex items-center gap-2">
              <span className="w-5 h-5 bg-green-600 text-white rounded-full flex items-center justify-center text-xs font-bold">+</span>
              Funcionalidades INCLUIDAS
            </h3>
            <ul className="space-y-2">
              {[
                "Registro y autenticación de usuarios (clientes y administradores)",
                "Catálogo de habitaciones con fotos, descripción y tarifas",
                "Búsqueda de disponibilidad por fechas y tipo de habitación",
                "Proceso de reserva online con selección de servicios adicionales",
                "Sistema de confirmación por correo electrónico",
                "Panel de administración con gestión de reservas",
                "Control de disponibilidad en tiempo real (sin overbooking)",
                "Generación de reportes: ocupación, ingresos, cancelaciones",
                "Gestión de check-in y check-out",
                "Sistema de cancelación con políticas configurables",
                "Historial de reservas para clientes registrados",
                "Módulo de tarifas con precios especiales y temporadas",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-foreground">
                  <span className="text-green-600 mt-0.5 shrink-0">✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-red-700 mb-3 flex items-center gap-2">
              <span className="w-5 h-5 bg-red-600 text-white rounded-full flex items-center justify-center text-xs font-bold">-</span>
              Funcionalidades EXCLUIDAS
            </h3>
            <ul className="space-y-2">
              {[
                "Pasarela de pagos en línea (pago en sitio o transferencia manual)",
                "Integración con canales OTA (Booking.com, Airbnb, Expedia)",
                "Sistema de punto de venta (POS) para restaurante u otros servicios",
                "Gestión de inventario de suministros del hotel",
                "Aplicación móvil nativa (iOS/Android)",
                "Sistema de fidelización o puntos de cliente",
                "Integración con sistemas de contabilidad externos",
                "Sistema de chat en vivo con el cliente",
                "Gestión de housekeeping con asignación de personal",
                "Módulo de spa, restaurante u otros servicios adicionales complejos",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-foreground">
                  <span className="text-red-500 mt-0.5 shrink-0">✗</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="bg-card border border-border rounded-xl p-6 space-y-4">
        <h2 className="text-xl font-bold text-primary flex items-center gap-2">
          <span className="w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">4</span>
          Stakeholders
        </h2>
        <div className="overflow-x-auto">
          <table className="table-doc w-full">
            <thead>
              <tr>
                <th>ID</th>
                <th>Stakeholder</th>
                <th>Rol</th>
                <th>Responsabilidades</th>
                <th>Interés</th>
                <th>Influencia</th>
              </tr>
            </thead>
            <tbody>
              {[
                {
                  id: "SH-01", name: "Propietario/Gerente", rol: "Patrocinador del proyecto", resp: "Aprueba presupuesto, define objetivos de negocio, acepta entregables", interes: "Alta", influencia: "Alta"
                },
                {
                  id: "SH-02", name: "Administrador del Sistema", rol: "Usuario administrador", resp: "Gestiona reservas, habitaciones, tarifas y reportes del sistema", interes: "Alta", influencia: "Media"
                },
                {
                  id: "SH-03", name: "Recepcionista", rol: "Usuario operativo", resp: "Registra reservas presenciales, gestiona check-in/check-out, atiende clientes", interes: "Alta", influencia: "Media"
                },
                {
                  id: "SH-04", name: "Clientes (Huéspedes)", rol: "Usuario final", resp: "Realizan búsquedas, reservas, cancelaciones y consultan historial", interes: "Alta", influencia: "Alta"
                },
                {
                  id: "SH-05", name: "Equipo de Desarrollo", rol: "Desarrollador del sistema", resp: "Diseña, implementa, prueba y despliega el sistema siguiendo requerimientos", interes: "Media", influencia: "Alta"
                },
                {
                  id: "SH-06", name: "Proveedor de Hosting", rol: "Proveedor tecnológico", resp: "Provee infraestructura cloud, garantiza disponibilidad y rendimiento del servidor", interes: "Baja", influencia: "Media"
                },
                {
                  id: "SH-07", name: "Personal de Limpieza", rol: "Usuario informado", resp: "Consulta calendario de ocupación para planificar limpieza de habitaciones", interes: "Media", influencia: "Baja"
                },
                {
                  id: "SH-08", name: "Catedrático UMG", rol: "Evaluador académico", resp: "Evalúa cumplimiento de entregables académicos y calidad del proyecto", interes: "Alta", influencia: "Alta"
                },
              ].map((sh) => (
                <tr key={sh.id}>
                  <td className="font-mono text-xs text-primary font-bold">{sh.id}</td>
                  <td className="font-semibold">{sh.name}</td>
                  <td className="text-sm">{sh.rol}</td>
                  <td className="text-sm">{sh.resp}</td>
                  <td>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${sh.interes === 'Alta' ? 'bg-green-100 text-green-800' : sh.interes === 'Media' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-600'}`}>
                      {sh.interes}
                    </span>
                  </td>
                  <td>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${sh.influencia === 'Alta' ? 'bg-blue-100 text-blue-800' : sh.influencia === 'Media' ? 'bg-orange-100 text-orange-800' : 'bg-gray-100 text-gray-600'}`}>
                      {sh.influencia}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="bg-card border border-border rounded-xl p-6 space-y-4">
        <h2 className="text-xl font-bold text-primary flex items-center gap-2">
          <span className="w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">5</span>
          Restricciones y Supuestos
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold mb-3 text-foreground">Restricciones</h3>
            <div className="space-y-3">
              {[
                { tipo: "Técnica", color: "bg-blue-50 border-blue-200", tcolor: "text-blue-800", desc: "El sistema debe funcionar en navegadores Chrome (v100+), Firefox (v95+), Safari (v15+) y Edge (v90+). No se requiere compatibilidad con Internet Explorer." },
                { tipo: "Tiempo", color: "bg-purple-50 border-purple-200", tcolor: "text-purple-800", desc: "La Fase I debe completarse en el período académico del semestre (aproximadamente 4 meses). El desarrollo total del proyecto (Fase II) no debe superar 8 meses." },
                { tipo: "Presupuesto", color: "bg-green-50 border-green-200", tcolor: "text-green-800", desc: "El presupuesto máximo para herramientas y hosting durante el desarrollo académico es Q5,000 GTQ. Se priorizarán herramientas gratuitas o de código abierto." },
                { tipo: "Regulatoria", color: "bg-orange-50 border-orange-200", tcolor: "text-orange-800", desc: "El sistema debe cumplir con la Ley de Protección de Datos Personales de Guatemala (Decreto 57-2008 pendiente) y con las políticas de INGUAT para establecimientos turísticos." },
                { tipo: "Recursos", color: "bg-red-50 border-red-200", tcolor: "text-red-800", desc: "El equipo de desarrollo está compuesto por máximo 3 estudiantes de la UMG con dedicación part-time (20 horas semanales por integrante)." },
              ].map((r, i) => (
                <div key={i} className={`border rounded-lg p-3 ${r.color}`}>
                  <span className={`text-xs font-bold ${r.tcolor} uppercase tracking-wide`}>{r.tipo}</span>
                  <p className="text-sm mt-1 text-foreground">{r.desc}</p>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h3 className="font-semibold mb-3 text-foreground">Supuestos</h3>
            <div className="space-y-3">
              {[
                { id: "SA-01", text: "El hotel/casa rural cuenta con acceso a internet estable con un ancho de banda mínimo de 10 Mbps para garantizar el funcionamiento del sistema." },
                { id: "SA-02", text: "Los clientes potenciales tienen acceso a un dispositivo con navegador web moderno y conexión a internet para realizar sus reservas." },
                { id: "SA-03", text: "El personal del establecimiento (administradores y recepcionistas) tiene conocimientos básicos de computación suficientes para operar el sistema sin capacitación extensa." },
                { id: "SA-04", text: "El proveedor de hosting garantizará una disponibilidad del 99.5% del tiempo, con ventanas de mantenimiento programadas fuera del horario pico (2:00-4:00 AM)." },
                { id: "SA-05", text: "El establecimiento ya cuenta con una lista digital o física de sus habitaciones, tipos, características y tarifas base para ingresarlas al sistema." },
                { id: "SA-06", text: "Los pagos se realizarán fuera del sistema (efectivo, transferencia o en recepción), sin requerir integración con pasarela de pagos en la versión inicial." },
              ].map((s) => (
                <div key={s.id} className="flex gap-3 bg-muted/30 rounded-lg p-3">
                  <span className="shrink-0 text-xs font-bold text-muted-foreground bg-muted px-2 py-1 rounded h-fit">{s.id}</span>
                  <p className="text-sm text-foreground">{s.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
