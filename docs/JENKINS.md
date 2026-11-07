# Pipeline en Jenkins

Además de GitHub Actions (`.github/workflows/ci.yml`), el proyecto tiene un pipeline equivalente en Jenkins, definido en el archivo `Jenkinsfile` de la raíz. Corre las mismas etapas y en el mismo orden:

| Etapa | Qué hace | Si falla |
|---|---|---|
| 1. build | Instala dependencias, verifica tipos, corre lint y compila | Se detiene el pipeline |
| 2. unit-tests | Corre las pruebas unitarias con Vitest y cobertura (`pnpm test:coverage`) | Se detiene el pipeline |
| 3. sonarcloud | Analiza el código en SonarCloud con la cobertura y espera el quality gate (`sonar.qualitygate.wait=true`) | Se detiene si el quality gate no se aprueba |
| 4. api-tests | Recrea la base de pruebas local, levanta la API y corre la colección de Postman con Newman | Se detiene el pipeline |
| 5. deploy | En `main`, solicita el despliegue del backend a Render y verifica `/api/healthz` | El pipeline queda en rojo |

El plan gratuito de SonarCloud solo analiza la rama `main`, así que en otras ramas la etapa 3 deja un aviso y continúa. La etapa 5 solo corre en `main`.

## Requisitos de la máquina de Jenkins

- Jenkins en Windows con los plugins sugeridos (Pipeline, Git, Credentials Binding, JUnit y Timestamper).
- Node.js 20 o superior y Git en el PATH del servicio de Jenkins. pnpm, Newman y el scanner de SonarCloud se ejecutan con `npx`, no hace falta instalarlos.
- PostgreSQL local con una base exclusiva para pruebas, `hotel_ci`. La etapa 4 borra y recrea sus tablas, por eso el pipeline se niega a correr si la conexión no apunta a `localhost`.

Crear la base una sola vez:

```
"C:\Program Files\PostgreSQL\18\bin\createdb.exe" -U postgres hotel_ci
```

Si PostgreSQL está en otra carpeta o versión, cambiar la variable `PSQL` del `Jenkinsfile`.

## Credenciales

En **Manage Jenkins → Credentials → System → Global credentials → Add Credentials**, tipo **Secret text**:

| ID | Valor |
|---|---|
| `SONAR_TOKEN` | Token de SonarCloud (My Account → Security) |
| `RENDER_DEPLOY_HOOK` | Render → servicio HotelLosVolcanes → Settings → Deploy Hook |
| `HOTEL_CI_DATABASE_URL` | `postgresql://postgres:<contraseña>@localhost:5432/hotel_ci` |

## Crear el job

1. **New Item** → nombre `HotelLosVolcanes` → **Pipeline** → OK.
2. En **Pipeline**, elegir **Pipeline script from SCM**.
3. SCM: **Git**, Repository URL `https://github.com/hperezc16-blip/HotelLosVolcanes.git`.
4. Branch Specifier: `*/main`.
5. Script Path: `Jenkinsfile`.
6. Guardar y hacer clic en **Build Now**.

El `Jenkinsfile` revisa el repositorio cada 5 minutos (`pollSCM`), así que un merge a `main` dispara el pipeline sin intervención manual. El parámetro `DESPLEGAR` permite correrlo sin desplegar a Render.
