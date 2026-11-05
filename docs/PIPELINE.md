# Pipeline de integración y despliegue continuo (E13)

Herramienta: **GitHub Actions** (`.github/workflows/ci.yml`).

Se ejecuta en cada push y Pull Request hacia `develop` (DEV), `qa` (QA) y `main` (PROD).

## Etapas (en orden)

| # | Job | Qué hace | Si falla |
|---|---|---|---|
| 1 | `build` | Instala dependencias, verifica tipos, ejecuta ESLint y compila backend y frontend | Se detiene el pipeline |
| 2 | `unit-tests` | Ejecuta las pruebas unitarias de backend y frontend con cobertura (Vitest) y guarda los reportes lcov | Se detiene el pipeline |
| 3 | `sonarcloud` | Analiza el código en SonarCloud con la cobertura y espera el resultado del quality gate | Se detiene si el quality gate no se aprueba |
| 4 | `api-tests` | Levanta PostgreSQL, carga `tests/api/db-setup.sql`, inicia la API y ejecuta la colección de Postman con Newman | Se detiene el pipeline |
| 5 | `deploy` | Solo en push a `qa` o `main`. En `main` solicita el despliegue del backend a Render y verifica `/api/healthz`. Vercel despliega el frontend de la rama | El despliegue queda marcado como fallido |

## Configuración necesaria

**Secrets del repositorio** (Settings → Secrets and variables → Actions):

| Secret | Origen |
|---|---|
| `SONAR_TOKEN` | SonarCloud → My Account → Security → Generate token |
| `RENDER_DEPLOY_HOOK` | Render → servicio HotelLosVolcanes → Settings → Deploy Hook |

**SonarCloud:** desactivar *Automatic Analysis* (Administration → Analysis Method), porque el análisis lo hace el pipeline.

El plan gratuito de SonarCloud solo analiza la rama main y los Pull Requests. Por eso, en los push a develop y qa el job `3. sonarcloud` no vuelve a analizar: ese código ya pasó el quality gate en su Pull Request.

**Render:** en Settings → Build & Deploy, poner *Auto-Deploy* en **Off**, para que solo el pipeline despliegue a producción.

## Bloqueo de merge

En Settings → Branches (o Rules → Rulesets) se protegen `qa` y `main` con:

- Require a pull request before merging, con 1 aprobación.
- Require status checks to pass: `1. build`, `2. unit-tests`, `3. sonarcloud`, `4. api-tests`.

Así, si cualquier etapa falla, GitHub no permite el merge hacia QA ni hacia PROD.
