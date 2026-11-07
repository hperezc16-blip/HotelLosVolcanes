// Pipeline de Jenkins para Hotel Los Volcanes.
// Ejecuta las mismas etapas que .github/workflows/ci.yml, en el mismo orden:
// 1. build, 2. unit-tests, 3. sonarcloud (con quality gate), 4. api-tests y 5. deploy.
// Agente: Jenkins en Windows con Node.js 20 o superior y Git, sin Docker (ver docs/JENKINS.md).
// Los servicios externos son online: SonarCloud y la API desplegada en Render.

pipeline {
    agent any

    options {
        timestamps()
        disableConcurrentBuilds()
        buildDiscarder(logRotator(numToKeepStr: '20'))
        timeout(time: 30, unit: 'MINUTES')
    }

    triggers {
        // Revisa el repositorio cada 5 minutos y corre el pipeline si hay commits nuevos.
        pollSCM('H/5 * * * *')
    }

    parameters {
        booleanParam(name: 'DESPLEGAR', defaultValue: true,
            description: 'En main, solicitar el despliegue del backend a Render al final del pipeline')
    }

    environment {
        PNPM = 'npx --yes pnpm@10'
        // API desplegada en Render, usada por las pruebas de Newman y la verificacion del deploy.
        API_URL = 'https://hotellosvolcanes.onrender.com/api'
    }

    stages {
        stage('1. build') {
            steps {
                bat '%PNPM% install --frozen-lockfile'
                bat '%PNPM% typecheck'
                bat '%PNPM% lint'
                bat '%PNPM% build'
            }
        }

        stage('2. unit-tests') {
            steps {
                bat '%PNPM% test:coverage'
            }
            post {
                always {
                    archiveArtifacts allowEmptyArchive: true,
                        artifacts: 'artifacts/api-server/coverage/lcov.info, artifacts/hotel-app/coverage/lcov.info'
                }
            }
        }

        stage('3. sonarcloud') {
            steps {
                script {
                    // El plan gratuito de SonarCloud solo analiza la rama main.
                    def rama = (env.GIT_BRANCH ?: '').replaceFirst(/^origin\//, '')
                    if (rama == 'main') {
                        // Servidor "SonarCloud" y scanner "Sonar Scanner 8.1" configurados en
                        // Manage Jenkins (plugin SonarQube Scanner). withSonarQubeEnv inyecta la URL
                        // y el token, y publica el badge del Quality Gate en la pagina del job.
                        def scannerHome = tool 'Sonar Scanner 8.1'
                        withSonarQubeEnv('SonarCloud') {
                            // qualitygate.wait hace que el scanner falle si el Quality Gate no se aprueba
                            // (no requiere webhook de SonarCloud hacia este Jenkins local).
                            bat "\"${scannerHome}\\bin\\sonar-scanner.bat\" -Dsonar.qualitygate.wait=true -Dsonar.qualitygate.timeout=300"
                        }
                    } else {
                        echo "SonarCloud (plan gratuito) solo analiza main. Rama actual: ${rama}. El quality gate se aplica al llegar a main."
                    }
                }
            }
        }

        stage('4. api-tests') {
            steps {
                // Sin Docker no hay PostgreSQL de servicio como en GitHub Actions, asi que la
                // coleccion se ejecuta contra la API desplegada en Render (online).
                powershell '''
                    # Render (plan gratuito) se duerme tras 15 minutos: despertarlo antes de probar.
                    $ok = $false
                    for ($i = 0; $i -lt 20; $i++) {
                        try {
                            $r = Invoke-WebRequest -UseBasicParsing -TimeoutSec 30 "$($env:API_URL)/healthz"
                            Write-Output "API en linea: $($r.Content)"
                            $ok = $true; break
                        } catch { Start-Sleep -Seconds 10 }
                    }
                    if (-not $ok) { throw "La API de Render no respondio en /api/healthz" }
                '''
                bat """
                    npx --yes newman@6 run tests/api/HotelLosVolcanes.postman_collection.json ^
                      -e tests/api/render.postman_environment.json ^
                      --env-var baseUrl=%API_URL% ^
                      --timeout-request 60000 ^
                      --reporters cli,junit ^
                      --reporter-junit-export newman-results.xml
                """
            }
            post {
                always {
                    junit allowEmptyResults: true, testResults: 'newman-results.xml'
                    archiveArtifacts allowEmptyArchive: true, artifacts: 'newman-results.xml'
                }
            }
        }

        stage('5. deploy') {
            when {
                allOf {
                    expression { (env.GIT_BRANCH ?: '').replaceFirst(/^origin\//, '') == 'main' }
                    expression { params.DESPLEGAR }
                }
            }
            steps {
                withCredentials([string(credentialsId: 'RENDER_DEPLOY_HOOK', variable: 'RENDER_DEPLOY_HOOK')]) {
                    powershell '''
                        $ErrorActionPreference = "Stop"
                        Invoke-WebRequest -UseBasicParsing -Method Post $env:RENDER_DEPLOY_HOOK | Out-Null
                        Write-Output "Despliegue solicitado a Render"
                    '''
                }
                powershell '''
                    Start-Sleep -Seconds 60
                    for ($i = 0; $i -lt 20; $i++) {
                        try {
                            $r = Invoke-WebRequest -UseBasicParsing "https://hotellosvolcanes.onrender.com/api/healthz"
                            Write-Output "Backend desplegado: $($r.Content)"
                            exit 0
                        } catch { Start-Sleep -Seconds 15 }
                    }
                    throw "El backend no respondio despues del despliegue"
                '''
            }
        }
    }

    post {
        success { echo 'Pipeline completo en verde.' }
        failure { echo 'El pipeline fallo. Revisar la etapa en rojo.' }
    }
}
