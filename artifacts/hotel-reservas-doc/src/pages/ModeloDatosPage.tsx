const entities = [
  {
    name: "usuarios",
    description: "Almacena todos los usuarios del sistema (clientes, administradores, recepcionistas)",
    color: "bg-blue-50 border-blue-300",
    headerColor: "bg-blue-600",
    fields: [
      { nombre: "id", tipo: "SERIAL", restriccion: "PRIMARY KEY, NOT NULL, AUTO INCREMENT", descripcion: "Identificador único del usuario" },
      { nombre: "nombre", tipo: "VARCHAR(100)", restriccion: "NOT NULL", descripcion: "Nombre completo del usuario" },
      { nombre: "apellido", tipo: "VARCHAR(100)", restriccion: "NOT NULL", descripcion: "Apellido completo del usuario" },
      { nombre: "email", tipo: "VARCHAR(255)", restriccion: "UNIQUE, NOT NULL, CHECK (email LIKE '%@%')", descripcion: "Correo electrónico único para autenticación" },
      { nombre: "password_hash", tipo: "VARCHAR(255)", restriccion: "NOT NULL", descripcion: "Contraseña cifrada con bcrypt (costo 12)" },
      { nombre: "telefono", tipo: "VARCHAR(20)", restriccion: "NULL", descripcion: "Número de teléfono de contacto" },
      { nombre: "rol", tipo: "ENUM", restriccion: "NOT NULL, DEFAULT 'cliente', CHECK IN ('cliente','admin','recepcionista')", descripcion: "Rol del usuario en el sistema" },
      { nombre: "activo", tipo: "BOOLEAN", restriccion: "NOT NULL, DEFAULT TRUE", descripcion: "Estado activo/inactivo del usuario" },
      { nombre: "email_verificado", tipo: "BOOLEAN", restriccion: "NOT NULL, DEFAULT FALSE", descripcion: "Indica si el email fue verificado" },
      { nombre: "intentos_fallidos", tipo: "SMALLINT", restriccion: "NOT NULL, DEFAULT 0", descripcion: "Contador de intentos fallidos de login" },
      { nombre: "bloqueado_hasta", tipo: "TIMESTAMP", restriccion: "NULL", descripcion: "Fecha hasta la que la cuenta está bloqueada" },
      { nombre: "creado_en", tipo: "TIMESTAMP", restriccion: "NOT NULL, DEFAULT NOW()", descripcion: "Fecha y hora de creación del registro" },
      { nombre: "actualizado_en", tipo: "TIMESTAMP", restriccion: "NOT NULL, DEFAULT NOW()", descripcion: "Fecha y hora de última actualización" },
    ],
    indices: ["idx_usuarios_email (UNIQUE)", "idx_usuarios_rol", "idx_usuarios_activo"],
  },
  {
    name: "habitaciones",
    description: "Catálogo de habitaciones o unidades disponibles para reserva",
    color: "bg-green-50 border-green-300",
    headerColor: "bg-green-600",
    fields: [
      { nombre: "id", tipo: "SERIAL", restriccion: "PRIMARY KEY, NOT NULL, AUTO INCREMENT", descripcion: "Identificador único de la habitación" },
      { nombre: "numero", tipo: "VARCHAR(10)", restriccion: "UNIQUE, NOT NULL", descripcion: "Número o código identificador de la habitación" },
      { nombre: "nombre", tipo: "VARCHAR(150)", restriccion: "NOT NULL", descripcion: "Nombre descriptivo de la habitación" },
      { nombre: "tipo", tipo: "ENUM", restriccion: "NOT NULL, CHECK IN ('simple','doble','suite','familiar','deluxe')", descripcion: "Tipo o categoría de la habitación" },
      { nombre: "capacidad_adultos", tipo: "SMALLINT", restriccion: "NOT NULL, CHECK > 0, DEFAULT 2", descripcion: "Número máximo de adultos permitidos" },
      { nombre: "capacidad_ninos", tipo: "SMALLINT", restriccion: "NOT NULL, CHECK >= 0, DEFAULT 0", descripcion: "Número máximo de niños permitidos" },
      { nombre: "precio_base", tipo: "DECIMAL(10,2)", restriccion: "NOT NULL, CHECK > 0", descripcion: "Precio base por noche en Quetzales (GTQ)" },
      { nombre: "descripcion", tipo: "TEXT", restriccion: "NULL", descripcion: "Descripción detallada de la habitación" },
      { nombre: "amenidades", tipo: "JSONB", restriccion: "NOT NULL, DEFAULT '[]'", descripcion: "Lista de amenidades en formato JSON (wifi, AC, TV, etc.)" },
      { nombre: "activa", tipo: "BOOLEAN", restriccion: "NOT NULL, DEFAULT TRUE", descripcion: "Estado activo/inactivo para mostrar en catálogo" },
      { nombre: "piso", tipo: "SMALLINT", restriccion: "NULL", descripcion: "Número de piso donde se ubica la habitación" },
      { nombre: "creado_en", tipo: "TIMESTAMP", restriccion: "NOT NULL, DEFAULT NOW()", descripcion: "Fecha y hora de creación del registro" },
      { nombre: "actualizado_en", tipo: "TIMESTAMP", restriccion: "NOT NULL, DEFAULT NOW()", descripcion: "Fecha y hora de última actualización" },
    ],
    indices: ["idx_habitaciones_numero (UNIQUE)", "idx_habitaciones_tipo", "idx_habitaciones_activa", "idx_habitaciones_precio"],
  },
  {
    name: "reservas",
    description: "Registro central de todas las reservaciones del sistema",
    color: "bg-orange-50 border-orange-300",
    headerColor: "bg-orange-600",
    fields: [
      { nombre: "id", tipo: "SERIAL", restriccion: "PRIMARY KEY, NOT NULL, AUTO INCREMENT", descripcion: "Identificador único de la reserva" },
      { nombre: "codigo_reserva", tipo: "VARCHAR(20)", restriccion: "UNIQUE, NOT NULL", descripcion: "Código legible de la reserva (ej: HTL-2024-00001)" },
      { nombre: "usuario_id", tipo: "INTEGER", restriccion: "FOREIGN KEY → usuarios(id), NOT NULL", descripcion: "ID del cliente que realizó la reserva" },
      { nombre: "habitacion_id", tipo: "INTEGER", restriccion: "FOREIGN KEY → habitaciones(id), NOT NULL", descripcion: "ID de la habitación reservada" },
      { nombre: "fecha_entrada", tipo: "DATE", restriccion: "NOT NULL, CHECK >= CURRENT_DATE (al crear)", descripcion: "Fecha de inicio de la estadía (check-in)" },
      { nombre: "fecha_salida", tipo: "DATE", restriccion: "NOT NULL, CHECK > fecha_entrada", descripcion: "Fecha de fin de la estadía (check-out)" },
      { nombre: "num_adultos", tipo: "SMALLINT", restriccion: "NOT NULL, CHECK > 0, DEFAULT 1", descripcion: "Número de adultos hospedados" },
      { nombre: "num_ninos", tipo: "SMALLINT", restriccion: "NOT NULL, CHECK >= 0, DEFAULT 0", descripcion: "Número de niños hospedados" },
      { nombre: "precio_total", tipo: "DECIMAL(10,2)", restriccion: "NOT NULL, CHECK > 0", descripcion: "Precio total de la reserva en GTQ" },
      { nombre: "estado", tipo: "ENUM", restriccion: "NOT NULL, DEFAULT 'confirmada', CHECK IN ('pendiente','confirmada','checkin','checkout','cancelada')", descripcion: "Estado actual de la reserva" },
      { nombre: "notas_cliente", tipo: "TEXT", restriccion: "NULL", descripcion: "Solicitudes especiales del cliente" },
      { nombre: "notas_admin", tipo: "TEXT", restriccion: "NULL", descripcion: "Notas internas del personal para la reserva" },
      { nombre: "cancelado_en", tipo: "TIMESTAMP", restriccion: "NULL", descripcion: "Fecha y hora de cancelación (si aplica)" },
      { nombre: "motivo_cancelacion", tipo: "VARCHAR(500)", restriccion: "NULL", descripcion: "Razón de la cancelación (si aplica)" },
      { nombre: "creado_en", tipo: "TIMESTAMP", restriccion: "NOT NULL, DEFAULT NOW()", descripcion: "Fecha y hora de creación de la reserva" },
      { nombre: "actualizado_en", tipo: "TIMESTAMP", restriccion: "NOT NULL, DEFAULT NOW()", descripcion: "Fecha y hora de última actualización" },
    ],
    indices: ["idx_reservas_codigo (UNIQUE)", "idx_reservas_usuario_id", "idx_reservas_habitacion_id", "idx_reservas_fechas (fecha_entrada, fecha_salida)", "idx_reservas_estado", "idx_reservas_fechas_habitacion (habitacion_id, fecha_entrada, fecha_salida)"],
  },
  {
    name: "imagenes_habitacion",
    description: "Galería de imágenes asociadas a cada habitación",
    color: "bg-purple-50 border-purple-300",
    headerColor: "bg-purple-600",
    fields: [
      { nombre: "id", tipo: "SERIAL", restriccion: "PRIMARY KEY, NOT NULL, AUTO INCREMENT", descripcion: "Identificador único de la imagen" },
      { nombre: "habitacion_id", tipo: "INTEGER", restriccion: "FOREIGN KEY → habitaciones(id) ON DELETE CASCADE, NOT NULL", descripcion: "ID de la habitación a la que pertenece" },
      { nombre: "url", tipo: "VARCHAR(500)", restriccion: "NOT NULL", descripcion: "URL de la imagen en el servicio de almacenamiento" },
      { nombre: "es_principal", tipo: "BOOLEAN", restriccion: "NOT NULL, DEFAULT FALSE", descripcion: "Indica si es la imagen principal de la habitación" },
      { nombre: "orden", tipo: "SMALLINT", restriccion: "NOT NULL, DEFAULT 1, CHECK > 0", descripcion: "Orden de visualización en la galería" },
      { nombre: "alt_text", tipo: "VARCHAR(255)", restriccion: "NULL", descripcion: "Texto alternativo para accesibilidad (SEO)" },
      { nombre: "creado_en", tipo: "TIMESTAMP", restriccion: "NOT NULL, DEFAULT NOW()", descripcion: "Fecha y hora de carga de la imagen" },
    ],
    indices: ["idx_imagenes_habitacion_id", "idx_imagenes_es_principal"],
  },
  {
    name: "tarifas",
    description: "Configuración de precios diferenciados por temporada o tipo de período",
    color: "bg-yellow-50 border-yellow-300",
    headerColor: "bg-yellow-600",
    fields: [
      { nombre: "id", tipo: "SERIAL", restriccion: "PRIMARY KEY, NOT NULL, AUTO INCREMENT", descripcion: "Identificador único de la tarifa" },
      { nombre: "nombre", tipo: "VARCHAR(150)", restriccion: "NOT NULL", descripcion: "Nombre descriptivo de la tarifa (ej: Temporada Alta 2024)" },
      { nombre: "habitacion_id", tipo: "INTEGER", restriccion: "FOREIGN KEY → habitaciones(id), NULL (si es global)", descripcion: "ID de habitación específica (NULL = aplica a todas)" },
      { nombre: "fecha_inicio", tipo: "DATE", restriccion: "NOT NULL", descripcion: "Fecha de inicio de vigencia de la tarifa" },
      { nombre: "fecha_fin", tipo: "DATE", restriccion: "NOT NULL, CHECK > fecha_inicio", descripcion: "Fecha de fin de vigencia de la tarifa" },
      { nombre: "multiplicador", tipo: "DECIMAL(4,2)", restriccion: "NOT NULL, CHECK BETWEEN 0.1 AND 5.0, DEFAULT 1.00", descripcion: "Factor multiplicador del precio base (1.3 = +30%)" },
      { nombre: "dias_semana", tipo: "SMALLINT[]", restriccion: "NULL (NULL = aplica todos los días)", descripcion: "Días de semana aplicables (0=Dom, 1=Lun,...,6=Sáb)" },
      { nombre: "activa", tipo: "BOOLEAN", restriccion: "NOT NULL, DEFAULT TRUE", descripcion: "Estado activo/inactivo de la tarifa" },
      { nombre: "creado_en", tipo: "TIMESTAMP", restriccion: "NOT NULL, DEFAULT NOW()", descripcion: "Fecha y hora de creación del registro" },
    ],
    indices: ["idx_tarifas_habitacion_id", "idx_tarifas_fechas (fecha_inicio, fecha_fin)", "idx_tarifas_activa"],
  },
  {
    name: "notificaciones",
    description: "Registro de todas las notificaciones enviadas por el sistema",
    color: "bg-red-50 border-red-300",
    headerColor: "bg-red-600",
    fields: [
      { nombre: "id", tipo: "SERIAL", restriccion: "PRIMARY KEY, NOT NULL, AUTO INCREMENT", descripcion: "Identificador único de la notificación" },
      { nombre: "usuario_id", tipo: "INTEGER", restriccion: "FOREIGN KEY → usuarios(id), NOT NULL", descripcion: "ID del usuario destinatario" },
      { nombre: "reserva_id", tipo: "INTEGER", restriccion: "FOREIGN KEY → reservas(id), NULL", descripcion: "ID de la reserva relacionada (si aplica)" },
      { nombre: "tipo", tipo: "ENUM", restriccion: "NOT NULL, CHECK IN ('confirmacion','cancelacion','recordatorio','modificacion','bienvenida')", descripcion: "Tipo de notificación enviada" },
      { nombre: "canal", tipo: "ENUM", restriccion: "NOT NULL, DEFAULT 'email', CHECK IN ('email','sms','push')", descripcion: "Canal de envío de la notificación" },
      { nombre: "asunto", tipo: "VARCHAR(255)", restriccion: "NOT NULL", descripcion: "Asunto del mensaje enviado" },
      { nombre: "estado_envio", tipo: "ENUM", restriccion: "NOT NULL, DEFAULT 'pendiente', CHECK IN ('pendiente','enviado','fallido')", descripcion: "Estado de la entrega de la notificación" },
      { nombre: "intentos", tipo: "SMALLINT", restriccion: "NOT NULL, DEFAULT 0", descripcion: "Número de intentos de envío realizados" },
      { nombre: "enviado_en", tipo: "TIMESTAMP", restriccion: "NULL", descripcion: "Fecha y hora del envío exitoso" },
      { nombre: "creado_en", tipo: "TIMESTAMP", restriccion: "NOT NULL, DEFAULT NOW()", descripcion: "Fecha y hora de creación del registro" },
    ],
    indices: ["idx_notificaciones_usuario_id", "idx_notificaciones_reserva_id", "idx_notificaciones_estado_envio"],
  },
];

export default function ModeloDatosPage() {
  return (
    <div className="space-y-8">
      <div className="border-b border-border pb-6">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-xs font-semibold uppercase tracking-widest text-primary bg-primary/10 px-3 py-1 rounded-full">Entregable 4.4.3</span>
          <span className="text-xs text-muted-foreground">Ponderación: 2.0 pts</span>
        </div>
        <h1 className="text-3xl font-bold text-foreground">Modelo de Datos</h1>
        <p className="mt-2 text-muted-foreground">Diagrama Entidad-Relación, diccionario de datos e índices identificados</p>
      </div>

      <section className="bg-card border border-border rounded-xl p-6 space-y-4">
        <h2 className="text-xl font-bold text-primary">Diagrama Entidad-Relación (ER)</h2>
        <div className="overflow-x-auto">
          <div className="min-w-[700px] p-4 bg-muted/20 rounded-xl border border-border">
            <div className="flex flex-col gap-4">
              <div className="text-center text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Sistema de Reservas — Modelo Relacional</div>
              <div className="flex gap-4 justify-center flex-wrap">
                {[
                  { name: "usuarios", color: "border-blue-500 bg-blue-50", fields: ["id (PK)", "nombre", "email (UNIQUE)", "password_hash", "rol", "activo"] },
                  { name: "habitaciones", color: "border-green-500 bg-green-50", fields: ["id (PK)", "numero (UNIQUE)", "nombre", "tipo", "precio_base", "activa"] },
                  { name: "tarifas", color: "border-yellow-500 bg-yellow-50", fields: ["id (PK)", "habitacion_id (FK)", "fecha_inicio", "fecha_fin", "multiplicador"] },
                  { name: "imagenes_habitacion", color: "border-purple-500 bg-purple-50", fields: ["id (PK)", "habitacion_id (FK)", "url", "es_principal"] },
                  { name: "reservas", color: "border-orange-500 bg-orange-50", fields: ["id (PK)", "codigo_reserva (UNIQUE)", "usuario_id (FK)", "habitacion_id (FK)", "fecha_entrada", "fecha_salida", "precio_total", "estado"] },
                  { name: "notificaciones", color: "border-red-500 bg-red-50", fields: ["id (PK)", "usuario_id (FK)", "reserva_id (FK)", "tipo", "estado_envio"] },
                ].map((entity) => (
                  <div key={entity.name} className={`border-2 rounded-lg min-w-[140px] ${entity.color}`}>
                    <div className="px-3 py-1.5 border-b-2 border-inherit font-bold text-xs text-center uppercase">{entity.name}</div>
                    <div className="p-2 space-y-0.5">
                      {entity.fields.map((f) => (
                        <div key={f} className={`text-xs px-1 py-0.5 rounded ${f.includes('PK') ? 'font-bold text-primary' : f.includes('FK') ? 'text-orange-700' : 'text-foreground'}`}>
                          {f}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex flex-wrap gap-4 justify-center text-xs text-muted-foreground">
                <div className="flex items-center gap-1.5"><span className="w-4 h-0.5 bg-blue-500 inline-block"></span> usuarios 1:N reservas</div>
                <div className="flex items-center gap-1.5"><span className="w-4 h-0.5 bg-green-500 inline-block"></span> habitaciones 1:N reservas</div>
                <div className="flex items-center gap-1.5"><span className="w-4 h-0.5 bg-purple-500 inline-block"></span> habitaciones 1:N imagenes</div>
                <div className="flex items-center gap-1.5"><span className="w-4 h-0.5 bg-yellow-500 inline-block"></span> habitaciones 1:N tarifas</div>
                <div className="flex items-center gap-1.5"><span className="w-4 h-0.5 bg-red-500 inline-block"></span> usuarios/reservas 1:N notificaciones</div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="bg-muted/30 rounded-lg p-3">
            <div className="font-semibold mb-1">Relaciones Principales</div>
            <ul className="text-xs space-y-1 text-muted-foreground">
              <li>usuarios (1) ↔ (N) reservas</li>
              <li>habitaciones (1) ↔ (N) reservas</li>
              <li>habitaciones (1) ↔ (N) imagenes_habitacion</li>
              <li>habitaciones (1) ↔ (N) tarifas</li>
              <li>reservas (1) ↔ (N) notificaciones</li>
              <li>usuarios (1) ↔ (N) notificaciones</li>
            </ul>
          </div>
          <div className="bg-muted/30 rounded-lg p-3">
            <div className="font-semibold mb-1">Constraints de Integridad</div>
            <ul className="text-xs space-y-1 text-muted-foreground">
              <li>FK con ON DELETE CASCADE donde corresponde</li>
              <li>CHECK constraints en fechas y precios</li>
              <li>UNIQUE en emails y códigos de reserva</li>
              <li>NOT NULL en campos críticos de negocio</li>
              <li>DEFAULT en campos con valores predeterminados</li>
            </ul>
          </div>
          <div className="bg-muted/30 rounded-lg p-3">
            <div className="font-semibold mb-1">Normalización</div>
            <ul className="text-xs space-y-1 text-muted-foreground">
              <li>El modelo cumple con la 3FN (Tercera Forma Normal)</li>
              <li>Sin dependencias transitivas entre no-claves</li>
              <li>Sin grupos repetitivos (amenidades en JSONB)</li>
              <li>Índices compuestos para consultas frecuentes</li>
              <li>Tablas de auditoría con creado_en / actualizado_en</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="bg-card border border-border rounded-xl p-6 space-y-6">
        <h2 className="text-xl font-bold text-primary">Diccionario de Datos</h2>
        {entities.map((entity) => (
          <div key={entity.name} className={`border-2 rounded-xl overflow-hidden ${entity.color}`}>
            <div className={`px-5 py-3 text-white font-bold ${entity.headerColor} flex items-center justify-between`}>
              <span className="font-mono uppercase text-sm tracking-wider">TABLA: {entity.name}</span>
              <span className="text-xs font-normal opacity-80">{entity.description}</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-black/5">
                    <th className="px-3 py-2 text-left font-bold">Nombre del Campo</th>
                    <th className="px-3 py-2 text-left font-bold">Tipo de Dato</th>
                    <th className="px-3 py-2 text-left font-bold">Restricciones</th>
                    <th className="px-3 py-2 text-left font-bold">Descripción</th>
                  </tr>
                </thead>
                <tbody>
                  {entity.fields.map((field, i) => (
                    <tr key={field.nombre} className={i % 2 === 0 ? "" : "bg-black/5"}>
                      <td className={`px-3 py-1.5 font-mono font-bold ${field.nombre === "id" ? "text-primary" : field.nombre.endsWith("_id") ? "text-orange-700" : ""}`}>
                        {field.nombre}
                        {field.nombre === "id" && <span className="ml-1 text-xs bg-primary/10 text-primary px-1 rounded">PK</span>}
                        {field.nombre.endsWith("_id") && field.nombre !== "id" && <span className="ml-1 text-xs bg-orange-100 text-orange-700 px-1 rounded">FK</span>}
                      </td>
                      <td className="px-3 py-1.5 font-mono text-purple-700">{field.tipo}</td>
                      <td className="px-3 py-1.5 text-xs text-muted-foreground">{field.restriccion}</td>
                      <td className="px-3 py-1.5">{field.descripcion}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-5 py-3 bg-black/5 border-t border-inherit">
              <span className="font-bold text-xs">Índices: </span>
              <span className="text-xs text-muted-foreground">{entity.indices.join(" | ")}</span>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
