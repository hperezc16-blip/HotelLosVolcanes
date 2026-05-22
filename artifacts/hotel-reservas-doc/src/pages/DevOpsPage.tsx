export default function DevOpsPage() {
  return (
    <div className="space-y-8">
      <div className="border-b border-border pb-6">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-xs font-semibold uppercase tracking-widest text-primary bg-primary/10 px-3 py-1 rounded-full">Entregable 4.8</span>
          <span className="text-xs text-muted-foreground">Ponderación: 2.0 pts</span>
        </div>
        <h1 className="text-3xl font-bold text-foreground">Estrategia de DevOps</h1>
        <p className="mt-2 text-muted-foreground">Estrategia de branching, pipeline CI/CD y ambientes de despliegue</p>
      </div>

      <section className="bg-card border border-border rounded-xl p-6 space-y-4">
        <h2 className="text-xl font-bold text-primary">Estrategia de Branching — GitFlow Adaptado</h2>
        <div className="overflow-x-auto">
          <div className="min-w-[600px] space-y-3">
            {[
              {
                rama: "main", tipo: "Protegida", color: "bg-red-100 border-red-400 text-red-900",
                desc: "Rama principal de producción. Solo recibe merges mediante Pull Requests aprobados desde 'release'. Protegida: requiere 2 aprobaciones y que el pipeline CI/CD pase completamente.",
                reglas: ["Solo merge desde 'release' o hotfix", "Requiere 2 aprobaciones de PR", "CI/CD completo debe pasar", "No se permite push directo", "Tag semántico en cada merge (v1.0.0, v1.1.0)"]
              },
              {
                rama: "develop", tipo: "Integración", color: "bg-blue-100 border-blue-400 text-blue-900",
                desc: "Rama de integración continua. Recibe merges de ramas 'feature/' y 'bugfix/'. Siempre debe estar en estado funcional. Base para todas las ramas de feature.",
                reglas: ["Base para todas las ramas feature/", "Solo merge mediante PR aprobado (1 revisión)", "CI básico debe pasar (tests + lint)", "No se permite push directo", "Despliega automáticamente al ambiente de desarrollo"]
              },
              {
                rama: "feature/", tipo: "Desarrollo", color: "bg-green-100 border-green-400 text-green-900",
                desc: "Ramas individuales por historia de usuario o funcionalidad. Nomenclatura: feature/US-{id}-{descripcion-corta}. Creadas desde develop, se mergean de vuelta a develop.",
                reglas: ["Nomenclatura: feature/US-07-proceso-reserva", "Creada desde develop actualizada", "Vida útil: 1 historia de usuario (max. 1 semana)", "1 revisión de código requerida en PR", "Tests deben pasar antes del merge"]
              },
              {
                rama: "release/", tipo: "Pre-producción", color: "bg-orange-100 border-orange-400 text-orange-900",
                desc: "Ramas de preparación para producción. Nomenclatura: release/v{version}. Solo se hacen bug fixes, no se agregan nuevas funcionalidades. Despliegan al ambiente de staging.",
                reglas: ["Nomenclatura: release/v1.0.0", "Solo bug fixes, no nuevas features", "Despliega a ambiente de staging", "Requiere aprobación del Product Owner", "Merge a main y develop al finalizar"]
              },
              {
                rama: "hotfix/", tipo: "Urgente", color: "bg-purple-100 border-purple-400 text-purple-900",
                desc: "Correcciones urgentes en producción. Nomenclatura: hotfix/{ticket-id}-{descripcion}. Creadas desde main, se mergean a main y develop. Requieren aprobación expedita.",
                reglas: ["Solo para bugs críticos en producción", "Creada desde main directamente", "Requiere aprobación expedita (1 rev.)", "Merge a main Y develop simultáneamente", "Incrementa versión de patch (v1.0.x)"]
              },
            ].map((branch) => (
              <div key={branch.rama} className={`border-l-4 rounded-r-xl p-4 ${branch.color}`}>
                <div className="flex items-center gap-3 mb-2">
                  <code className="font-mono font-bold text-sm bg-white/60 px-2 py-0.5 rounded">{branch.rama}*</code>
                  <span className="text-xs px-2 py-0.5 bg-white/60 rounded-full font-semibold">{branch.tipo}</span>
                </div>
                <p className="text-sm mb-3">{branch.desc}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-1">
                  {branch.reglas.map((r, i) => (
                    <div key={i} className="text-xs bg-white/40 rounded px-2 py-1">• {r}</div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-muted/30 rounded-xl p-4">
          <h3 className="font-semibold mb-2">Convención de Commits — Conventional Commits</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
            {[
              { tipo: "feat:", ej: "feat(US-07): agregar proceso de reserva online", desc: "Nueva funcionalidad" },
              { tipo: "fix:", ej: "fix(US-02): corregir validación de contraseña", desc: "Corrección de bug" },
              { tipo: "test:", ej: "test: agregar pruebas unitarias módulo reservas", desc: "Añadir/modificar pruebas" },
              { tipo: "docs:", ej: "docs: actualizar README con instrucciones de despliegue", desc: "Solo documentación" },
              { tipo: "refactor:", ej: "refactor(auth): simplificar lógica de validación JWT", desc: "Sin cambio de comportamiento" },
              { tipo: "chore:", ej: "chore: actualizar dependencias de npm a versiones LTS", desc: "Tareas de mantenimiento" },
            ].map((c) => (
              <div key={c.tipo} className="bg-white/40 rounded-lg p-2">
                <span className="text-primary font-bold">{c.tipo}</span>
                <span className="text-muted-foreground ml-1">{c.ej.replace(c.tipo, '')}</span>
                <div className="text-muted-foreground text-xs mt-0.5">→ {c.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-card border border-border rounded-xl p-6 space-y-4">
        <h2 className="text-xl font-bold text-primary">Pipeline CI/CD — GitHub Actions</h2>
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold mb-3 text-muted-foreground uppercase text-xs tracking-wider">Pipeline de Integración Continua (CI) — Activado en cada PR a develop/main</h3>
            <div className="flex flex-wrap gap-2 items-center">
              {[
                { stage: "1. Checkout", icon: "📥", color: "bg-gray-100 border-gray-300", tools: "actions/checkout@v4" },
                { stage: "2. Setup Node.js", icon: "⚙️", color: "bg-blue-100 border-blue-300", tools: "actions/setup-node@v4 (v20 LTS)" },
                { stage: "3. Install Deps", icon: "📦", color: "bg-purple-100 border-purple-300", tools: "pnpm install --frozen-lockfile" },
                { stage: "4. Lint + Format", icon: "🔍", color: "bg-yellow-100 border-yellow-300", tools: "ESLint + Prettier" },
                { stage: "5. Type Check", icon: "🔷", color: "bg-blue-100 border-blue-300", tools: "tsc --noEmit" },
                { stage: "6. Unit Tests", icon: "🧪", color: "bg-green-100 border-green-300", tools: "Vitest (min 70% cobertura)" },
                { stage: "7. Build", icon: "🏗️", color: "bg-orange-100 border-orange-300", tools: "vite build + esbuild" },
                { stage: "8. Security Audit", icon: "🛡️", color: "bg-red-100 border-red-300", tools: "pnpm audit --audit-level high" },
              ].map((s, i) => (
                <div key={s.stage} className="flex items-center gap-2">
                  <div className={`border rounded-lg px-3 py-2 text-xs text-center min-w-[110px] ${s.color}`}>
                    <div className="text-base">{s.icon}</div>
                    <div className="font-bold mt-0.5">{s.stage}</div>
                    <div className="text-muted-foreground text-xs mt-0.5 font-mono">{s.tools}</div>
                  </div>
                  {i < 7 && <span className="text-muted-foreground font-bold text-lg">→</span>}
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-3 text-muted-foreground uppercase text-xs tracking-wider">Pipeline de Despliegue Continuo (CD) — Activado al merge a develop/main</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border border-blue-200 bg-blue-50 rounded-xl p-4">
                <div className="font-bold text-blue-900 mb-2">🔵 Deploy a Desarrollo (develop branch)</div>
                <div className="space-y-1 text-xs">
                  {[
                    "Trigger: Push a rama develop",
                    "Ejecuta pipeline CI completo primero",
                    "Deploy frontend a Vercel Preview",
                    "Deploy backend a Railway (env: development)",
                    "Ejecuta migraciones de DB de desarrollo",
                    "Notificación en Slack/Teams del equipo",
                    "URL preview disponible en comentario del PR",
                  ].map((s, i) => (
                    <div key={i} className="flex items-center gap-1.5">
                      <span className="text-blue-500">→</span><span>{s}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="border border-green-200 bg-green-50 rounded-xl p-4">
                <div className="font-bold text-green-900 mb-2">🟢 Deploy a Producción (main branch)</div>
                <div className="space-y-1 text-xs">
                  {[
                    "Trigger: Merge PR a rama main (con tag v.x.x.x)",
                    "Requiere aprobación manual (GitHub Environments)",
                    "Deploy frontend a Vercel (dominio personalizado)",
                    "Deploy backend a Railway (env: production)",
                    "Ejecuta migraciones de DB de producción",
                    "Smoke tests automáticos post-deploy (5 min)",
                    "Rollback automático si smoke tests fallan",
                    "Notificación de éxito/fallo al equipo",
                  ].map((s, i) => (
                    <div key={i} className="flex items-center gap-1.5">
                      <span className="text-green-500">→</span><span>{s}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-muted/30 rounded-xl p-4">
            <h3 className="font-semibold mb-2 text-sm">Archivo de Pipeline — .github/workflows/ci-cd.yml (estructura)</h3>
            <pre className="text-xs bg-gray-900 text-green-400 rounded-lg p-4 overflow-x-auto">
{`name: CI/CD Pipeline — Sistema Reservas Hotel

on:
  push:
    branches: [develop, main, 'release/**']
  pull_request:
    branches: [develop, main]

jobs:
  ci:
    name: "CI — Lint, Test & Build"
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v3
        with: { version: 9 }
      - uses: actions/setup-node@v4
        with: { node-version: '20', cache: 'pnpm' }
      - run: pnpm install --frozen-lockfile
      - run: pnpm run lint
      - run: pnpm run typecheck
      - run: pnpm run test:coverage  # mínimo 70%
      - run: pnpm run build
      - run: pnpm audit --audit-level high

  deploy-dev:
    name: "CD — Deploy to Development"
    needs: ci
    if: github.ref == 'refs/heads/develop'
    environment: development
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Deploy to Railway (dev)
        run: railway deploy --environment development
      - name: Deploy to Vercel (preview)
        run: vercel deploy --preview

  deploy-prod:
    name: "CD — Deploy to Production"
    needs: ci
    if: github.ref == 'refs/heads/main'
    environment: production  # requiere aprobación manual
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Deploy to Railway (prod)
        run: railway deploy --environment production
      - name: Deploy to Vercel (production)
        run: vercel deploy --prod
      - name: Run Smoke Tests
        run: pnpm run test:smoke`}
            </pre>
          </div>
        </div>
      </section>

      <section className="bg-card border border-border rounded-xl p-6 space-y-4">
        <h2 className="text-xl font-bold text-primary">Ambientes de Despliegue</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              nombre: "Desarrollo (Development)",
              trigger: "Push a develop",
              color: "bg-blue-50 border-blue-200",
              headerColor: "bg-blue-600",
              frontend: "Vercel Preview (URL dinámica por branch)",
              backend: "Railway — Servicio Node.js (dev)",
              db: "PostgreSQL Railway — DB compartida del equipo",
              variables: "NODE_ENV=development, DEBUG=true",
              proposito: "Integración continua del equipo. Pruebas de nuevas funcionalidades antes de staging.",
              duracion: "Siempre activo",
            },
            {
              nombre: "Staging / Pre-producción",
              trigger: "Branch release/*",
              color: "bg-orange-50 border-orange-200",
              headerColor: "bg-orange-500",
              frontend: "Vercel Preview (URL fija de staging)",
              backend: "Railway — Servicio Node.js (staging)",
              db: "PostgreSQL Railway — DB separada con datos de prueba",
              variables: "NODE_ENV=staging, DEBUG=false",
              proposito: "Validación por Product Owner y QA antes de producción. Pruebas de aceptación.",
              duracion: "Activo durante release",
            },
            {
              nombre: "Producción (Production)",
              trigger: "Merge a main (aprobación manual)",
              color: "bg-green-50 border-green-200",
              headerColor: "bg-green-600",
              frontend: "Vercel (dominio personalizado con CDN global)",
              backend: "Railway Pro — Node.js con autoscaling",
              db: "PostgreSQL Railway (Pro) — Backups automáticos diarios",
              variables: "NODE_ENV=production, DEBUG=false, HTTPS=true",
              proposito: "Ambiente real de usuarios. Alta disponibilidad (99.5% SLA). Monitoreo activo.",
              duracion: "Permanente",
            },
          ].map((env) => (
            <div key={env.nombre} className={`border-2 rounded-xl overflow-hidden ${env.color}`}>
              <div className={`px-4 py-3 text-white font-bold text-sm ${env.headerColor}`}>{env.nombre}</div>
              <div className="p-4 space-y-2 text-xs">
                <div><span className="font-semibold">Activación:</span> {env.trigger}</div>
                <div><span className="font-semibold">Frontend:</span> {env.frontend}</div>
                <div><span className="font-semibold">Backend:</span> {env.backend}</div>
                <div><span className="font-semibold">Base de Datos:</span> {env.db}</div>
                <div><span className="font-semibold">Variables:</span> <code className="text-xs bg-white/60 px-1 rounded">{env.variables}</code></div>
                <div className="bg-white/50 rounded-lg p-2 mt-2">
                  <span className="font-semibold">Propósito:</span> {env.proposito}
                </div>
                <div><span className="font-semibold">Disponibilidad:</span> {env.duracion}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-card border border-border rounded-xl p-6 space-y-4">
        <h2 className="text-xl font-bold text-primary">Gestión de Secretos y Variables de Entorno</h2>
        <div className="overflow-x-auto">
          <table className="table-doc w-full">
            <thead>
              <tr>
                <th>Variable</th>
                <th>Descripción</th>
                <th>Dev</th>
                <th>Staging</th>
                <th>Prod</th>
                <th>Almacenamiento</th>
              </tr>
            </thead>
            <tbody>
              {[
                { var: "DATABASE_URL", desc: "Cadena de conexión PostgreSQL", dev: "✓", staging: "✓", prod: "✓", store: "GitHub Secrets (por ambiente)" },
                { var: "JWT_SECRET", desc: "Clave secreta para firmar tokens JWT (mín. 256 bits)", dev: "✓", staging: "✓", prod: "✓", store: "GitHub Secrets (por ambiente)" },
                { var: "SMTP_HOST / SMTP_PORT", desc: "Servidor SMTP para envío de emails", dev: "Mailtrap (fake)", staging: "SendGrid test", prod: "SendGrid prod", store: "GitHub Secrets" },
                { var: "SMTP_USER / SMTP_PASS", desc: "Credenciales del servidor de email", dev: "✓", staging: "✓", prod: "✓", store: "GitHub Secrets (por ambiente)" },
                { var: "CLOUDINARY_URL", desc: "URL API para almacenamiento de imágenes", dev: "✓", staging: "✓", prod: "✓", store: "GitHub Secrets" },
                { var: "CORS_ORIGIN", desc: "URL del frontend permitida en CORS", dev: "localhost:5173", staging: "staging.hotel.com", prod: "hotel.com", store: "GitHub Variables" },
                { var: "NODE_ENV", desc: "Ambiente de ejecución de Node.js", dev: "development", staging: "staging", prod: "production", store: "GitHub Variables" },
                { var: "PORT", desc: "Puerto de escucha del servidor Express", dev: "4000", staging: "4000", prod: "Railway asigna", store: "GitHub Variables" },
              ].map((v) => (
                <tr key={v.var}>
                  <td className="font-mono text-xs font-bold text-primary">{v.var}</td>
                  <td className="text-xs">{v.desc}</td>
                  <td className="text-center text-xs">{v.dev === "✓" ? <span className="text-green-600 font-bold">✓</span> : <span className="text-muted-foreground text-xs">{v.dev}</span>}</td>
                  <td className="text-center text-xs">{v.staging === "✓" ? <span className="text-green-600 font-bold">✓</span> : <span className="text-muted-foreground text-xs">{v.staging}</span>}</td>
                  <td className="text-center text-xs">{v.prod === "✓" ? <span className="text-green-600 font-bold">✓</span> : <span className="text-muted-foreground text-xs">{v.prod}</span>}</td>
                  <td className="text-xs">{v.store}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-800">
          <strong>Regla de Seguridad:</strong> Ningún secreto debe existir en el repositorio Git. Todo secreto se almacena en GitHub Environments Secrets y se inyecta en tiempo de ejecución del pipeline. El archivo .env.example documenta las variables requeridas sin valores reales.
        </div>
      </section>
    </div>
  );
}
