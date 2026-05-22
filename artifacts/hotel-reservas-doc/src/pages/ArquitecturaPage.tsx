export default function ArquitecturaPage() {
  return (
    <div className="space-y-8">
      <div className="border-b border-border pb-6">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-xs font-semibold uppercase tracking-widest text-primary bg-primary/10 px-3 py-1 rounded-full">Entregable 4.4</span>
          <span className="text-xs text-muted-foreground">Ponderación: 3.0 pts</span>
        </div>
        <h1 className="text-3xl font-bold text-foreground">Diseño de Arquitectura de Software</h1>
        <p className="mt-2 text-muted-foreground">Diagrama C4, patrón arquitectónico, stack tecnológico y modelo de datos</p>
      </div>

      <section className="bg-card border border-border rounded-xl p-6 space-y-6">
        <h2 className="text-xl font-bold text-primary">4.4.1 Diagrama de Arquitectura — Modelo C4</h2>

        <div>
          <h3 className="font-semibold mb-3 text-muted-foreground uppercase text-xs tracking-wider">Nivel 1: Diagrama de Contexto (C4 — Context)</h3>
          <div className="border border-border rounded-xl p-6 bg-muted/20">
            <div className="flex flex-col items-center gap-4">
              <div className="text-sm font-bold text-center text-muted-foreground mb-2">SISTEMA DE RESERVAS — CONTEXTO</div>
              <div className="grid grid-cols-3 gap-8 w-full max-w-3xl">
                <div className="flex flex-col items-center gap-2">
                  <div className="w-16 h-16 rounded-full bg-blue-100 border-2 border-blue-400 flex items-center justify-center text-2xl">👤</div>
                  <div className="text-center text-xs font-semibold">Cliente</div>
                  <div className="text-center text-xs text-muted-foreground">Realiza reservas online</div>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <div className="w-24 h-24 rounded-xl bg-primary/10 border-2 border-primary flex items-center justify-center text-center text-sm font-bold text-primary">
                    Sistema de<br />Reservas
                  </div>
                  <div className="flex flex-col gap-1">
                    <div className="text-xs text-center bg-green-100 text-green-800 px-2 py-0.5 rounded">Gestión de Reservas</div>
                    <div className="text-xs text-center bg-blue-100 text-blue-800 px-2 py-0.5 rounded">React + Node.js</div>
                  </div>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <div className="w-16 h-16 rounded-full bg-orange-100 border-2 border-orange-400 flex items-center justify-center text-2xl">👨‍💼</div>
                  <div className="text-center text-xs font-semibold">Administrador</div>
                  <div className="text-center text-xs text-muted-foreground">Gestiona el sistema</div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-6 w-full max-w-3xl mt-4">
                <div className="flex flex-col items-center gap-1">
                  <div className="w-14 h-14 rounded-lg bg-gray-100 border-2 border-gray-300 flex items-center justify-center text-xl">📧</div>
                  <div className="text-xs text-center font-semibold">Servicio Email</div>
                  <div className="text-xs text-center text-muted-foreground">SendGrid / SMTP</div>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <div className="w-14 h-14 rounded-lg bg-gray-100 border-2 border-gray-300 flex items-center justify-center text-xl">🗄️</div>
                  <div className="text-xs text-center font-semibold">Base de Datos</div>
                  <div className="text-xs text-center text-muted-foreground">PostgreSQL</div>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <div className="w-14 h-14 rounded-lg bg-gray-100 border-2 border-gray-300 flex items-center justify-center text-xl">☁️</div>
                  <div className="text-xs text-center font-semibold">Cloud Storage</div>
                  <div className="text-xs text-center text-muted-foreground">AWS S3 / Cloudinary</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h3 className="font-semibold mb-3 text-muted-foreground uppercase text-xs tracking-wider">Nivel 2: Diagrama de Contenedores (C4 — Containers)</h3>
          <div className="border border-border rounded-xl p-6 bg-muted/20 overflow-x-auto">
            <div className="min-w-[600px]">
              <div className="flex items-start gap-4 justify-center">
                <div className="flex flex-col gap-3">
                  <div className="text-xs font-bold text-center text-muted-foreground uppercase">Usuarios</div>
                  <div className="bg-blue-100 border-2 border-blue-400 rounded-lg px-3 py-2 text-center text-xs">
                    <div className="font-bold">Cliente</div>
                    <div className="text-blue-600">Navegador Web</div>
                  </div>
                  <div className="bg-orange-100 border-2 border-orange-400 rounded-lg px-3 py-2 text-center text-xs">
                    <div className="font-bold">Administrador</div>
                    <div className="text-orange-600">Navegador Web</div>
                  </div>
                </div>
                <div className="diagram-arrow text-2xl self-center">→</div>
                <div className="bg-muted border-2 border-border rounded-xl p-4 flex flex-col gap-3 min-w-[350px]">
                  <div className="text-xs font-bold text-center text-muted-foreground uppercase">Sistema de Reservas (Límite)</div>
                  <div className="bg-blue-50 border border-blue-300 rounded-lg p-3">
                    <div className="font-bold text-sm text-blue-900">Frontend SPA</div>
                    <div className="text-xs text-blue-700">React + TypeScript + Vite</div>
                    <div className="text-xs text-blue-600 mt-1">Interfaz de usuario, routing, estado global</div>
                    <div className="text-xs bg-blue-100 rounded px-1 mt-1">Puerto: 3000 | Protocolo: HTTPS</div>
                  </div>
                  <div className="diagram-arrow">↕ REST API (HTTPS/JSON)</div>
                  <div className="bg-green-50 border border-green-300 rounded-lg p-3">
                    <div className="font-bold text-sm text-green-900">Backend API REST</div>
                    <div className="text-xs text-green-700">Node.js + Express + TypeScript</div>
                    <div className="text-xs text-green-600 mt-1">Lógica de negocio, autenticación JWT, validación</div>
                    <div className="text-xs bg-green-100 rounded px-1 mt-1">Puerto: 4000 | Protocolo: HTTPS</div>
                  </div>
                </div>
                <div className="diagram-arrow text-2xl self-center">→</div>
                <div className="flex flex-col gap-3">
                  <div className="bg-purple-50 border-2 border-purple-300 rounded-lg p-3 text-center text-xs">
                    <div className="font-bold text-purple-900">PostgreSQL DB</div>
                    <div className="text-purple-700">Datos persistentes</div>
                    <div className="text-purple-600">Puerto: 5432</div>
                  </div>
                  <div className="bg-red-50 border-2 border-red-300 rounded-lg p-3 text-center text-xs">
                    <div className="font-bold text-red-900">Redis Cache</div>
                    <div className="text-red-700">Sesiones y caché</div>
                    <div className="text-red-600">Puerto: 6379</div>
                  </div>
                  <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-3 text-center text-xs">
                    <div className="font-bold text-yellow-900">Email Service</div>
                    <div className="text-yellow-700">Notificaciones</div>
                    <div className="text-yellow-600">SMTP/API</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h3 className="font-semibold mb-3 text-muted-foreground uppercase text-xs tracking-wider">Protocolos y Comunicación</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { titulo: "Frontend ↔ Backend", protocolo: "REST API", detalle: "HTTP/HTTPS con JSON. JWT Bearer Token en headers. Versionado con /api/v1/. Timeout: 30 segundos.", color: "bg-blue-50 border-blue-200" },
              { titulo: "Backend ↔ Database", protocolo: "TCP/IP + SSL", detalle: "Connection pooling (máx. 20 conexiones). Consultas parametrizadas con Drizzle ORM. TLS habilitado en producción.", color: "bg-green-50 border-green-200" },
              { titulo: "Backend ↔ Email", protocolo: "SMTP / API REST", detalle: "Envío asíncrono de emails via cola de mensajes. Reintentos automáticos (3 intentos). Logs de envío persistidos.", color: "bg-orange-50 border-orange-200" },
            ].map((p) => (
              <div key={p.titulo} className={`border rounded-lg p-4 ${p.color}`}>
                <div className="font-semibold text-sm mb-1">{p.titulo}</div>
                <div className="text-xs font-bold text-primary mb-1">{p.protocolo}</div>
                <p className="text-xs text-muted-foreground">{p.detalle}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-card border border-border rounded-xl p-6 space-y-4">
        <h2 className="text-xl font-bold text-primary">4.4.2 Patrón Arquitectónico</h2>
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-2xl font-bold text-blue-900">Arquitectura de Capas (Layered Architecture)</span>
            <span className="text-xs bg-blue-200 text-blue-900 px-2 py-0.5 rounded-full font-bold">Patrón Principal</span>
          </div>
          <p className="text-sm text-blue-800 mb-4">
            Se selecciona la Arquitectura de Capas (N-Layer) con separación clara entre Presentación, Lógica de Negocio,
            Acceso a Datos y Base de Datos. Este patrón fue seleccionado por las siguientes razones técnicas justificadas:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              { arg: "Simplicidad de implementación", detalle: "Adecuada para un equipo pequeño (máx. 3 desarrolladores) y plazo académico limitado. Permite dividir trabajo por capas de forma clara." },
              { arg: "Separación de responsabilidades (SoC)", detalle: "Cada capa tiene una responsabilidad única. Frontend solo maneja UI, backend maneja lógica, la BD solo almacena datos." },
              { arg: "Mantenibilidad y testabilidad", detalle: "Las capas son independientes, facilitando pruebas unitarias por capa. Se pueden reemplazar tecnologías en una capa sin afectar las demás." },
              { arg: "Escalabilidad progresiva", detalle: "El sistema puede evolucionar a microservicios en el futuro sin rediseño total. Las capas son los candidatos naturales para futuros servicios." },
            ].map((a, i) => (
              <div key={i} className="bg-white rounded-lg p-3 border border-blue-200">
                <div className="font-semibold text-sm text-blue-900 mb-1">{a.arg}</div>
                <p className="text-xs text-blue-700">{a.detalle}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <div className="min-w-[400px] space-y-2">
            {[
              { capa: "Capa de Presentación", tech: "React + TypeScript", color: "bg-blue-100 border-blue-400", desc: "Componentes UI, Router, Estado Global (Zustand), Tailwind CSS" },
              { capa: "Capa de Aplicación (API)", tech: "Express.js + Node.js", color: "bg-green-100 border-green-400", desc: "Controladores REST, Autenticación JWT, Middleware, Validación Zod" },
              { capa: "Capa de Lógica de Negocio", tech: "Services / Use Cases", color: "bg-yellow-100 border-yellow-400", desc: "Reglas de negocio, disponibilidad, cálculo de precios, políticas" },
              { capa: "Capa de Acceso a Datos", tech: "Drizzle ORM", color: "bg-orange-100 border-orange-400", desc: "Repositorios, queries SQL, transacciones, mapeo de entidades" },
              { capa: "Capa de Datos", tech: "PostgreSQL 16", color: "bg-red-100 border-red-400", desc: "Tablas, índices, relaciones, triggers, vistas materializadas" },
            ].map((layer, i) => (
              <div key={i} className={`border-l-4 rounded-r-lg p-3 ${layer.color}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-bold text-sm">{layer.capa}</span>
                    <p className="text-xs text-muted-foreground mt-0.5">{layer.desc}</p>
                  </div>
                  <span className="text-xs font-mono bg-white/70 px-2 py-0.5 rounded shrink-0 ml-3">{layer.tech}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-card border border-border rounded-xl p-6 space-y-4">
        <h2 className="text-xl font-bold text-primary">4.4.3 Stack Tecnológico Justificado</h2>
        <div className="overflow-x-auto">
          <table className="table-doc w-full">
            <thead>
              <tr>
                <th>Capa</th>
                <th>Tecnología</th>
                <th>Versión</th>
                <th>Justificación Técnica</th>
              </tr>
            </thead>
            <tbody>
              {[
                {
                  capa: "Frontend", tech: "React + TypeScript + Vite", version: "React 18 / TS 5.x / Vite 5",
                  just: "React ofrece arquitectura de componentes reutilizables y un ecosistema maduro. TypeScript reduce errores en tiempo de compilación. Vite proporciona HMR ultrarrápido en desarrollo y builds optimizados en producción."
                },
                {
                  capa: "UI / Estilos", tech: "Tailwind CSS + Radix UI", version: "Tailwind v3 / Radix UI",
                  just: "Tailwind permite desarrollo rápido con clases utilitarias. Radix UI provee componentes accesibles (ARIA) sin overhead de CSS. Combinación ideal para productividad y accesibilidad."
                },
                {
                  capa: "Estado Global", tech: "Zustand + TanStack Query", version: "Zustand 4 / TQ 5",
                  just: "Zustand para estado local ligero sin boilerplate de Redux. TanStack Query gestiona caché de servidor, sincronización y revalidación automática de datos de la API."
                },
                {
                  capa: "Backend / API", tech: "Node.js + Express.js + TypeScript", version: "Node.js 20 LTS / Express 5",
                  just: "Node.js permite compartir código TypeScript con el frontend. Express es maduro, ligero y extensible. La misma tecnología para frontend y backend reduce la curva de aprendizaje del equipo."
                },
                {
                  capa: "Validación", tech: "Zod", version: "Zod v3",
                  just: "Esquemas de validación type-safe compartibles entre frontend y backend. Integración nativa con TypeScript. Mensajes de error descriptivos y personalizables."
                },
                {
                  capa: "ORM / Base de Datos", tech: "Drizzle ORM + PostgreSQL 16", version: "Drizzle v0.30 / PG 16",
                  just: "Drizzle es type-safe y produce SQL legible. PostgreSQL 16 ofrece ACID, soporte JSON, full-text search y excelente rendimiento para datos transaccionales de reservas."
                },
                {
                  capa: "Autenticación", tech: "JWT + bcrypt + Passport.js", version: "JWT v9 / bcrypt v5",
                  just: "JWT permite autenticación stateless escalable. bcrypt con factor de costo 12 protege contraseñas. Passport.js facilita estrategias de autenticación extensibles (local, OAuth futuro)."
                },
                {
                  capa: "Email", tech: "Nodemailer + SendGrid SMTP", version: "Nodemailer v6",
                  just: "Nodemailer es la librería estándar de emails en Node.js. SendGrid provee alta deliverability, analytics y maneja bounce/spam. Plantillas HTML responsive con Handlebars."
                },
                {
                  capa: "Caché", tech: "Redis", version: "Redis 7",
                  just: "Caché de sesiones JWT, rate limiting y disponibilidad de habitaciones. Redis reduce la carga en PostgreSQL y mejora el tiempo de respuesta en búsquedas frecuentes."
                },
                {
                  capa: "Infraestructura / Hosting", tech: "Railway / Vercel + AWS RDS", version: "Última",
                  just: "Railway para backend Node.js con PostgreSQL integrado. Vercel para frontend estático con CDN global. AWS RDS PostgreSQL para producción con backups automáticos y alta disponibilidad."
                },
                {
                  capa: "CI/CD", tech: "GitHub Actions", version: "Última",
                  just: "Integración nativa con GitHub (repositorio del proyecto). Pipeline de CI/CD gratuito para proyectos académicos. Despliegue automático al aprobar Pull Requests a main."
                },
                {
                  capa: "Control de Versiones", tech: "Git + GitHub", version: "Git 2.x",
                  just: "Estándar de la industria. GitHub Projects para gestión del Backlog. GitHub Actions para CI/CD. Pull Requests para Code Review. Branching strategy GitFlow adaptado."
                },
              ].map((row, i) => (
                <tr key={i}>
                  <td className="font-semibold text-sm">{row.capa}</td>
                  <td className="font-mono text-xs text-primary font-bold">{row.tech}</td>
                  <td className="text-xs text-muted-foreground">{row.version}</td>
                  <td className="text-xs">{row.just}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
