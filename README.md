# Hotel Los Volcanes — Sistema de Reservaciones

Sistema de reservaciones hoteleras desarrollado como proyecto de Ingeniería de Software — Universidad Mariano Gálvez de Guatemala.

## Despliegue en Producción

| Servicio | URL |
|---|---|
| **Frontend** | https://hotel-los-volcanes-api-server.vercel.app |
| **API Backend** | https://sistema-reservaciones-hotel-production.up.railway.app |
| **Health Check** | https://sistema-reservaciones-hotel-production.up.railway.app/api/health |

### Credenciales de demostración

| Rol | Correo | Contraseña |
|---|---|---|
| Administrador | admin@hotel.com | Admin123! |
| Cliente | maria@example.com | Admin123! |

## Stack Tecnológico

| Capa | Tecnología |
|---|---|
| Frontend | React 19, TypeScript, Vite, TailwindCSS, TanStack Query |
| Backend / API | Node.js, Express 5, TypeScript |
| Base de datos | PostgreSQL + Drizzle ORM |
| Autenticación | JWT (jsonwebtoken) + bcryptjs |
| Pruebas | Vitest, Supertest |
| CI/CD | GitHub Actions |
| Monorepo | pnpm workspaces |

## Estructura del Repositorio

```
HotelLosVolcanes_Completo/
├── artifacts/
│   ├── api-server/          # Backend Express — REST API
│   ├── hotel-app/           # Frontend React — Portal cliente y admin
│   └── hotel-reservas-doc/  # Frontend React — Documentación/reportes
├── lib/
│   ├── db/                  # Schema Drizzle ORM + cliente de base de datos
│   ├── api-spec/            # Especificación OpenAPI
│   ├── api-zod/             # Schemas de validación Zod generados
│   └── api-client-react/    # Cliente React Query generado por Orval
├── .github/workflows/       # Pipeline CI/CD (GitHub Actions)
└── pnpm-workspace.yaml      # Configuración del monorepo
```

## Prerrequisitos

- **Node.js** 20 o superior
- **pnpm** 10 o superior (`npm install -g pnpm`)
- **PostgreSQL** 15 o superior (o una URL de base de datos compatible)

## Instalación

```bash
# 1. Clonar el repositorio
git clone https://github.com/hperezc16-blip/sistema-reservaciones-hotel.git
cd sistema-reservaciones-hotel

# 2. Instalar dependencias del monorepo
pnpm install
```

## Configuración

### Variables de entorno — API Server

Crear el archivo `artifacts/api-server/.env`:

```env
# Base de datos PostgreSQL
DATABASE_URL=postgresql://usuario:contraseña@localhost:5432/hotel_los_volcanes

# JWT — clave secreta (cambiar en producción)
JWT_SECRET=tu_clave_secreta_aqui

# Servidor
PORT=3000
NODE_ENV=development
```

### Variables de entorno — Frontend

Crear el archivo `artifacts/hotel-app/.env`:

```env
VITE_API_URL=http://localhost:3000
```

### Migración de base de datos

```bash
cd lib/db
pnpm db:push      # Aplica el schema a la base de datos
pnpm db:seed      # (Opcional) Carga datos iniciales
```

## Ejecución en Desarrollo

```bash
# Terminal 1 — Backend
cd artifacts/api-server
pnpm dev

# Terminal 2 — Frontend principal
cd artifacts/hotel-app
pnpm dev
```

El backend corre en `http://localhost:3000` y el frontend en `http://localhost:5173`.

## Scripts Disponibles (raíz del monorepo)

| Comando | Descripción |
|---|---|
| `pnpm build` | Compila todos los paquetes |
| `pnpm typecheck` | Verificación de tipos TypeScript |
| `pnpm lint` | Análisis estático con ESLint |
| `pnpm test` | Ejecuta todas las pruebas |
| `pnpm test:coverage` | Pruebas con reporte de cobertura |

## Pruebas

```bash
# Ejecutar todas las pruebas
pnpm test

# Generar reporte de cobertura
pnpm test:coverage
```

**Cobertura actual:** 74.3% statements · 78.1% branches · 67.7% funciones

Los reportes de cobertura se generan en `artifacts/api-server/coverage/`.

## Pipeline CI/CD

El pipeline está en `.github/workflows/ci.yml` (GitHub Actions) y se activa en cada `push` o `pull_request` a `develop`, `qa` y `main`. Los jobs corren en este orden y cada uno espera a que el anterior termine bien:

| Job | Qué hace |
|---|---|
| **1. build** | Instala dependencias, verifica tipos, corre ESLint y compila |
| **2. unit-tests** | Ejecuta las pruebas unitarias con Vitest (`pnpm test:coverage`) y guarda los reportes de cobertura |
| **3. sonarcloud** | Análisis estático en SonarCloud con verificación del quality gate |
| **4. api-tests** | Levanta PostgreSQL y la API, carga `tests/api/db-setup.sql` y corre la colección de Postman con Newman |
| **5. deploy** | Solo en `push` a `qa` o `main`. En `main` despliega el backend en Render con un deploy hook y verifica `/api/healthz`; el frontend lo despliega Vercel desde la rama |

**SonarCloud en el plan gratuito:** solo analiza `main` y los pull requests que van hacia `main`. En los demás casos (push a `develop` o `qa`, PR hacia `develop` o `qa`) el job 3 muestra un aviso de que el análisis no está disponible en esa rama y el pipeline continúa.

### Cómo ejecutar el pipeline

1. Crear una rama desde `develop` (`feature/*`, `fix/*`, `test/*` o `ci/*`) y subir los cambios.
2. Abrir un pull request hacia `develop`: el pipeline corre automáticamente y el resultado aparece en la pestaña **Checks** del PR.
3. Para volver a correrlo sin cambios, abrir la ejecución en la pestaña **Actions** y usar **Re-run all jobs**.

### Secrets de GitHub

Se configuran en **Settings → Secrets and variables → Actions**:

| Secret | Uso |
|---|---|
| `SONAR_TOKEN` | Token de SonarCloud para el job 3 |
| `RENDER_DEPLOY_HOOK` | Deploy hook del servicio en Render para el job 5 |

## Funcionalidades del Sistema

### Portal Cliente
- Registro e inicio de sesión con JWT
- Catálogo de habitaciones con filtros (tipo, capacidad, disponibilidad por fechas)
- Creación y cancelación de reservaciones
- Historial de reservaciones del usuario

### Panel Administrador
- Dashboard con estadísticas (ocupación, ingresos del mes, reservaciones recientes)
- Gestión de habitaciones (crear, editar, desactivar)
- Gestión de reservaciones (cambiar estado, estado de pago)
- Calendario de ocupación (vista de 30 días)

## Ramas

| Rama | Ambiente | Propósito |
|---|---|---|
| `develop` | DEV | Integración de nuevas funcionalidades y correcciones |
| `qa` | QA | Validación antes de pasar a producción |
| `main` | PROD | Código en producción |

Los cambios entran a `develop` por pull request con revisión de otra integrante. Luego se promueven con un PR de `develop` a `qa` y otro de `qa` a `main`. Las ramas `qa` y `main` están protegidas: el merge exige una aprobación y que los jobs 1 a 4 del pipeline estén en verde.

## Autores

- **Hazel Ruvi Pérez Cárcamo** — hperezc16@miumg.edu.gt
- Universidad Mariano Gálvez de Guatemala — Ingeniería de Software
##Contribuciones
.Hazel Ruvi Pérez Cárcamo -- Desarrollo principal
. Luis Reyes -- Módulo de calificaciones y reseñas
