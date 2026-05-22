const userStories = [
  {
    epic: "EP-01: Gestión de Usuarios y Autenticación",
    epicColor: "bg-purple-100 text-purple-800",
    stories: [
      {
        id: "US-01",
        title: "Registro de nuevo cliente",
        story: "Como cliente potencial, quiero registrarme en el sistema proporcionando mis datos básicos (nombre, correo, teléfono), para poder realizar reservaciones y acceder a mi historial.",
        criteria: [
          "El formulario valida el formato del correo electrónico en tiempo real",
          "La contraseña debe tener mínimo 8 caracteres, 1 mayúscula, 1 número",
          "Se envía correo de confirmación en menos de 2 minutos",
          "El usuario puede iniciar sesión inmediatamente tras confirmar el correo",
          "El sistema rechaza correos ya registrados con mensaje de error claro",
        ],
        priority: "Must",
        points: 8,
        tshirt: "M"
      },
      {
        id: "US-02",
        title: "Inicio de sesión",
        story: "Como usuario registrado (cliente, administrador o recepcionista), quiero iniciar sesión con mi correo y contraseña, para acceder a las funciones de mi rol.",
        criteria: [
          "El sistema muestra error claro si las credenciales son incorrectas",
          "Bloquea la cuenta tras 5 intentos fallidos consecutivos por 30 minutos",
          "La sesión persiste por 24 horas sin actividad (configurable por admin)",
          "Redirige al usuario a su panel correspondiente según su rol",
          "El botón 'Recordarme' extiende la sesión a 7 días",
        ],
        priority: "Must",
        points: 5,
        tshirt: "S"
      },
      {
        id: "US-03",
        title: "Recuperación de contraseña",
        story: "Como usuario registrado, quiero recuperar mi contraseña olvidada a través de mi correo electrónico, para recuperar el acceso a mi cuenta sin contactar al administrador.",
        criteria: [
          "El enlace de recuperación expira en 60 minutos",
          "Se envía correo con enlace único de recuperación en menos de 2 minutos",
          "El sistema confirma el cambio con un mensaje de éxito",
          "La nueva contraseña no puede ser igual a las últimas 3 contraseñas",
        ],
        priority: "Must",
        points: 3,
        tshirt: "S"
      },
    ]
  },
  {
    epic: "EP-02: Catálogo y Búsqueda de Habitaciones",
    epicColor: "bg-blue-100 text-blue-800",
    stories: [
      {
        id: "US-04",
        title: "Buscar habitaciones disponibles",
        story: "Como cliente, quiero buscar habitaciones disponibles filtrando por fecha de entrada, fecha de salida, número de huéspedes y tipo de habitación, para encontrar opciones que se adapten a mis necesidades.",
        criteria: [
          "La fecha de entrada no puede ser anterior a la fecha actual",
          "La fecha de salida debe ser al menos 1 día después de la entrada",
          "Los resultados se actualizan en tiempo real (sin recargar la página)",
          "Se muestra el mensaje 'Sin disponibilidad' si no hay habitaciones",
          "Los resultados muestran precio por noche y precio total",
          "El tiempo de respuesta de búsqueda es menor a 2 segundos",
        ],
        priority: "Must",
        points: 13,
        tshirt: "L"
      },
      {
        id: "US-05",
        title: "Ver detalle de habitación",
        story: "Como cliente, quiero ver el detalle completo de una habitación (fotos, descripción, amenidades, políticas y precios), para tomar una decisión informada antes de reservar.",
        criteria: [
          "Muestra galería de imágenes con navegación (mínimo 3 fotos por habitación)",
          "Lista claramente todas las amenidades incluidas y su disponibilidad",
          "Muestra el precio por noche y el precio total para las fechas seleccionadas",
          "El botón de reserva está visible y activo si hay disponibilidad",
          "La página carga en menos de 3 segundos",
        ],
        priority: "Must",
        points: 5,
        tshirt: "M"
      },
      {
        id: "US-06",
        title: "Gestionar catálogo de habitaciones (admin)",
        story: "Como administrador, quiero agregar, editar y desactivar habitaciones del catálogo con toda su información, para mantener actualizado el inventario disponible.",
        criteria: [
          "Puede subir hasta 10 imágenes por habitación (máximo 5MB cada una)",
          "Los campos obligatorios son: nombre, tipo, capacidad, precio base y descripción",
          "Los cambios se reflejan inmediatamente en el catálogo público",
          "Las habitaciones desactivadas no aparecen en búsquedas de clientes",
          "El sistema mantiene historial de cambios de precio",
        ],
        priority: "Must",
        points: 8,
        tshirt: "M"
      },
    ]
  },
  {
    epic: "EP-03: Proceso de Reserva",
    epicColor: "bg-green-100 text-green-800",
    stories: [
      {
        id: "US-07",
        title: "Realizar reserva online",
        story: "Como cliente autenticado, quiero completar el proceso de reserva seleccionando habitación, fechas, número de huéspedes y servicios adicionales, para asegurar mi estadía.",
        criteria: [
          "El proceso completo de reserva no debe tomar más de 5 clics",
          "Se muestra resumen con desglose de costos antes de confirmar",
          "El sistema verifica disponibilidad en tiempo real antes de confirmar",
          "Se genera código único de confirmación alfanumérico (ej: HTL-2024-0001)",
          "El correo de confirmación llega en menos de 30 segundos tras la reserva",
          "La habitación queda bloqueada durante el proceso de reserva (máximo 15 min)",
        ],
        priority: "Must",
        points: 13,
        tshirt: "L"
      },
      {
        id: "US-08",
        title: "Cancelar reserva",
        story: "Como cliente, quiero cancelar una reserva activa desde mi panel de usuario aplicando la política de cancelación vigente, para recuperar la disponibilidad y conocer las condiciones.",
        criteria: [
          "Muestra claramente la política de cancelación y penalidades antes de cancelar",
          "Genera confirmación de cancelación por correo en menos de 1 minuto",
          "Actualiza el estado de la habitación a disponible inmediatamente",
          "No permite cancelar reservas con check-in en menos de 24 horas (configurable)",
          "El administrador puede cancelar cualquier reserva con justificación",
        ],
        priority: "Must",
        points: 8,
        tshirt: "M"
      },
      {
        id: "US-09",
        title: "Ver historial de reservas",
        story: "Como cliente registrado, quiero ver el historial completo de mis reservas (activas, pasadas y canceladas) con todos los detalles, para llevar un control de mis estadías.",
        criteria: [
          "Muestra reservas ordenadas por fecha (más recientes primero)",
          "Permite filtrar por estado: Confirmada, Completada, Cancelada",
          "Cada reserva muestra: código, habitación, fechas, total, estado",
          "Permite descargar el comprobante de reserva en PDF",
        ],
        priority: "Should",
        points: 5,
        tshirt: "M"
      },
      {
        id: "US-10",
        title: "Agregar servicios adicionales",
        story: "Como cliente, quiero agregar servicios adicionales (desayuno, traslado, tour) al momento de reservar, para personalizar mi estadía y conocer el costo total.",
        criteria: [
          "Los servicios adicionales muestran precio unitario y total",
          "Los servicios seleccionados se incluyen en el resumen de reserva",
          "El administrador puede activar/desactivar servicios adicionales",
          "Los servicios tienen disponibilidad configurable por fechas",
        ],
        priority: "Could",
        points: 5,
        tshirt: "M"
      },
    ]
  },
  {
    epic: "EP-04: Panel de Administración",
    epicColor: "bg-orange-100 text-orange-800",
    stories: [
      {
        id: "US-11",
        title: "Dashboard de métricas",
        story: "Como administrador, quiero ver un panel principal con métricas clave del establecimiento (ocupación, ingresos, reservas pendientes), para tomar decisiones operativas informadas.",
        criteria: [
          "Muestra porcentaje de ocupación del día actual y de la semana",
          "Muestra ingresos del mes actual vs mes anterior",
          "Lista las reservas con check-in y check-out del día",
          "El dashboard se actualiza cada 5 minutos automáticamente",
          "Los datos son precisos con margen de error máximo del 1%",
        ],
        priority: "Must",
        points: 8,
        tshirt: "M"
      },
      {
        id: "US-12",
        title: "Gestionar todas las reservas",
        story: "Como administrador, quiero ver, filtrar, editar y actualizar el estado de todas las reservas del sistema, para tener control total de la operación del establecimiento.",
        criteria: [
          "Puede filtrar por estado, fecha, habitación y nombre de cliente",
          "Puede cambiar estado de reserva: Confirmada → Check-in → Check-out",
          "Puede editar fecha o habitación de una reserva (con notificación al cliente)",
          "Muestra alertas de reservas con check-in próximo (24, 12, 2 horas)",
          "Exporta listado de reservas a Excel/CSV",
        ],
        priority: "Must",
        points: 13,
        tshirt: "L"
      },
      {
        id: "US-13",
        title: "Generar reportes",
        story: "Como administrador, quiero generar reportes de ocupación, ingresos y cancelaciones filtrando por rango de fechas, para analizar el rendimiento del establecimiento.",
        criteria: [
          "Genera reporte de ocupación por habitación y por período",
          "Genera reporte de ingresos agrupado por semana, mes o habitación",
          "Muestra gráfica visual de ocupación en el tiempo",
          "Los reportes se pueden exportar en formato PDF y Excel",
          "El tiempo de generación no supera los 10 segundos para períodos de hasta 1 año",
        ],
        priority: "Should",
        points: 8,
        tshirt: "M"
      },
      {
        id: "US-14",
        title: "Gestionar tarifas y temporadas",
        story: "Como administrador, quiero configurar tarifas diferenciadas por temporada alta, baja y días especiales, para optimizar los ingresos del establecimiento según la demanda.",
        criteria: [
          "Puede definir períodos de temporada con fechas de inicio y fin",
          "Puede asignar multiplicadores de precio por temporada (ej: +30% temporada alta)",
          "Las tarifas se aplican automáticamente en el proceso de reserva",
          "Puede configurar tarifas especiales por día de semana (fin de semana)",
        ],
        priority: "Should",
        points: 5,
        tshirt: "M"
      },
    ]
  },
  {
    epic: "EP-05: Notificaciones y Comunicación",
    epicColor: "bg-red-100 text-red-800",
    stories: [
      {
        id: "US-15",
        title: "Notificaciones automáticas por correo",
        story: "Como cliente, quiero recibir correos automáticos para confirmación, recordatorios y cancelación de mis reservas, para estar siempre informado del estado de mi estadía.",
        criteria: [
          "Confirmación de reserva llega en menos de 30 segundos",
          "Recordatorio 48 horas antes del check-in con instrucciones de llegada",
          "Notificación inmediata si la reserva es modificada o cancelada por el hotel",
          "Los correos están en español con diseño profesional del establecimiento",
          "El cliente puede desactivar recordatorios desde su perfil",
        ],
        priority: "Must",
        points: 8,
        tshirt: "M"
      },
    ]
  }
];

const nfrs = [
  {
    id: "RNF-01", categoria: "Rendimiento", titulo: "Tiempo de respuesta",
    descripcion: "El sistema debe responder a todas las solicitudes de usuarios en menos de 2 segundos bajo carga normal (hasta 100 usuarios concurrentes). Las búsquedas de disponibilidad no deben superar los 1.5 segundos.",
    metrica: "≤ 2 seg al 95% de las solicitudes; ≤ 1.5 seg en búsquedas",
    color: "bg-blue-50 border-blue-200 text-blue-800"
  },
  {
    id: "RNF-02", categoria: "Seguridad", titulo: "Autenticación y autorización",
    descripcion: "Implementar autenticación JWT con refresh tokens. Todas las rutas protegidas deben verificar el token. El sistema debe cumplir con OWASP Top 10. Las contraseñas se almacenarán con hash bcrypt (costo mínimo 12). Las comunicaciones deben usar HTTPS (TLS 1.3).",
    metrica: "0 vulnerabilidades críticas OWASP; JWT expira en 24h; HTTPS forzado en producción",
    color: "bg-red-50 border-red-200 text-red-800"
  },
  {
    id: "RNF-03", categoria: "Disponibilidad", titulo: "Uptime del sistema",
    descripcion: "El sistema debe tener una disponibilidad del 99.5% mensual (máximo 3.6 horas de caída al mes). Las ventanas de mantenimiento programadas son entre 2:00 AM y 4:00 AM. Se deben implementar alertas automáticas cuando el sistema no esté disponible.",
    metrica: "SLA 99.5% mensual; mantenimiento 2:00-4:00 AM; alertas en < 5 min",
    color: "bg-orange-50 border-orange-200 text-orange-800"
  },
  {
    id: "RNF-04", categoria: "Escalabilidad", titulo: "Capacidad de crecimiento",
    descripcion: "La arquitectura debe soportar escalabilidad horizontal sin rediseño. El sistema debe mantener el rendimiento con hasta 500 usuarios concurrentes. La base de datos debe manejar hasta 50,000 reservas históricas sin degradación de rendimiento.",
    metrica: "Soporta 500 usuarios concurrentes; hasta 50,000 registros sin degradación",
    color: "bg-green-50 border-green-200 text-green-800"
  },
  {
    id: "RNF-05", categoria: "Usabilidad", titulo: "Experiencia de usuario",
    descripcion: "El proceso de reserva completo debe completarse en máximo 5 pasos. El sistema debe ser usable por personas sin experiencia técnica. Los mensajes de error deben ser claros y orientativos. Se debe obtener una puntuación de usabilidad SUS (System Usability Scale) mayor a 70.",
    metrica: "Reserva en ≤ 5 pasos; SUS score > 70; 0 pasos innecesarios",
    color: "bg-purple-50 border-purple-200 text-purple-800"
  },
  {
    id: "RNF-06", categoria: "Compatibilidad", titulo: "Soporte de navegadores y dispositivos",
    descripcion: "El sistema debe ser completamente funcional en Chrome 100+, Firefox 95+, Safari 15+ y Edge 90+. El diseño debe ser responsivo para pantallas desde 320px (móvil) hasta 1920px (escritorio). No se requiere compatibilidad con Internet Explorer.",
    metrica: "100% funcional en 4 navegadores principales; responsivo 320px-1920px",
    color: "bg-yellow-50 border-yellow-200 text-yellow-800"
  },
  {
    id: "RNF-07", categoria: "Mantenibilidad", titulo: "Calidad del código",
    descripcion: "El código debe tener cobertura de pruebas unitarias mínima del 70%. Se deben seguir principios SOLID y Clean Code. El proyecto debe incluir documentación técnica en el repositorio. Los logs de errores deben almacenarse y ser consultables.",
    metrica: "Cobertura de pruebas ≥ 70%; documentación API con OpenAPI; logs de errores",
    color: "bg-teal-50 border-teal-200 text-teal-800"
  },
];

function PriorityBadge({ priority }: { priority: string }) {
  const classes: Record<string, string> = {
    Must: "badge-must",
    Should: "badge-should",
    Could: "badge-could",
    "Won't": "badge-wont",
  };
  return <span className={classes[priority] || "badge-wont"}>{priority}</span>;
}

export default function RequerimientosPage() {
  return (
    <div className="space-y-8">
      <div className="border-b border-border pb-6">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-xs font-semibold uppercase tracking-widest text-primary bg-primary/10 px-3 py-1 rounded-full">Entregable 4.2</span>
          <span className="text-xs text-muted-foreground">Ponderación: 2.0 pts</span>
        </div>
        <h1 className="text-3xl font-bold text-foreground">Requerimientos del Sistema</h1>
        <p className="mt-2 text-muted-foreground">Historias de usuario con criterios de aceptación, priorización MoSCoW y estimación en Story Points</p>
      </div>

      <div className="bg-card border border-border rounded-xl p-6">
        <h2 className="text-xl font-bold text-primary mb-4">Requerimientos Funcionales — Historias de Usuario</h2>
        <div className="grid grid-cols-3 gap-4 mb-6 text-sm">
          <div className="bg-muted/30 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-primary">{userStories.reduce((acc, e) => acc + e.stories.length, 0)}</div>
            <div className="text-muted-foreground">Total Historias</div>
          </div>
          <div className="bg-muted/30 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-primary">{userStories.length}</div>
            <div className="text-muted-foreground">Épicas</div>
          </div>
          <div className="bg-muted/30 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-primary">
              {userStories.reduce((acc, e) => acc + e.stories.reduce((a, s) => a + s.points, 0), 0)}
            </div>
            <div className="text-muted-foreground">Story Points Total</div>
          </div>
        </div>

        <div className="space-y-8">
          {userStories.map((epic) => (
            <div key={epic.epic} className="space-y-4">
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold ${epic.epicColor}`}>
                {epic.epic}
              </div>
              <div className="space-y-4">
                {epic.stories.map((story) => (
                  <div key={story.id} className="border border-border rounded-xl overflow-hidden">
                    <div className="bg-muted/30 px-4 py-3 flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-mono font-bold text-primary">{story.id}</span>
                        <span className="font-semibold text-foreground">{story.title}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <PriorityBadge priority={story.priority} />
                        <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-semibold">
                          {story.points} SP
                        </span>
                        <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full font-semibold">
                          T-Shirt: {story.tshirt}
                        </span>
                      </div>
                    </div>
                    <div className="p-4 space-y-3">
                      <div className="bg-blue-50 border border-blue-100 rounded-lg p-3">
                        <p className="text-sm italic text-blue-900">"{story.story}"</p>
                      </div>
                      <div>
                        <h4 className="text-xs font-bold uppercase tracking-wide text-muted-foreground mb-2">Criterios de Aceptación</h4>
                        <ul className="space-y-1">
                          {story.criteria.map((c, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm">
                              <span className="text-green-600 shrink-0 mt-0.5">✓</span>
                              <span>{c}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl p-6">
        <h2 className="text-xl font-bold text-primary mb-6">Requerimientos No Funcionales</h2>
        <div className="space-y-4">
          {nfrs.map((nfr) => (
            <div key={nfr.id} className={`border rounded-xl p-4 ${nfr.color.split(' ')[0]} ${nfr.color.split(' ')[1]}`}>
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono font-bold bg-white/60 px-2 py-0.5 rounded">{nfr.id}</span>
                  <div>
                    <span className={`text-xs font-bold uppercase tracking-wide ${nfr.color.split(' ')[2]}`}>{nfr.categoria}</span>
                    <h3 className="font-semibold text-foreground">{nfr.titulo}</h3>
                  </div>
                </div>
              </div>
              <p className="text-sm text-foreground mt-2">{nfr.descripcion}</p>
              <div className="mt-2 bg-white/40 rounded-lg px-3 py-1.5">
                <span className="text-xs font-bold">Métrica verificable: </span>
                <span className="text-xs">{nfr.metrica}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
