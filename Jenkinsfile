// Pipeline de Jenkins para Hotel Los Volcanes.
// Ejecuta las mismas etapas que .github/workflows/ci.yml, en el mismo orden:
// 1. build, 2. unit-tests, 3. sonarcloud (con quality gate), 4. api-tests y 5. deploy.
// Agente: Jenkins en Windows con Node.js 20, Git y PostgreSQL local (ver docs/JENKINS.md).

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
        API_PORT = '3100'
        JWT_SECRET = 'jenkins-ci-secret'
        // Ruta a psql.exe. Cambiarla si PostgreSQL esta instalado en otra version o carpeta.
        PSQL = 'C:\\Program Files\\PostgreSQL\\18\\bin\\psql.exe'
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
                        withCredentials([string(credentialsId: 'SONAR_TOKEN', variable: 'SONAR_TOKEN')]) {
                            bat '''
                                npx --yes @sonar/scan ^
                                  -Dsonar.host.url=https://sonarcloud.io ^
                                  -Dsonar.token=%SONAR_TOKEN% ^
                                  -Dsonar.qualitygate.wait=true ^
                                  -Dsonar.qualitygate.timeout=300
                            '''
                        }
                    } else {
                        echo "SonarCloud (plan gratuito) solo analiza main. Rama actual: ${rama}. El quality gate se aplica al llegar a main."
                    }
                }
            }
        }

        stage('4. api-tests') {
            steps {
                withCredentials([string(credentialsId: 'HOTEL_CI_DATABASE_URL', variable: 'DATABASE_URL')]) {
                    powershell '''
                        $ErrorActionPreference = "Stop"
                        # Proteccion: esta etapa borra y recrea las tablas, nunca debe apuntar a produccion.
                        if ($env:DATABASE_URL -match "neon" -or $env:DATABASE_URL -notmatch "localhost|127\\.0\\.0\\.1") {
                            throw "HOTEL_CI_DATABASE_URL debe apuntar a la base local de pruebas (hotel_ci), no a produccion."
                        }
                        & $env:PSQL $env:DATABASE_URL -v ON_ERROR_STOP=1 -q -f tests/api/db-setup.sql
                        if ($LASTEXITCODE -ne 0) { throw "No se pudo crear el esquema de prueba" }

                        $env:PORT = $env:API_PORT
                        $env:NODE_ENV = "production"
                        $api = Start-Process node -ArgumentList "artifacts/api-server/dist/index.mjs" `
                            -RedirectStandardOutput api.log -RedirectStandardError api-error.log -PassThru -NoNewWindow
                        $api.Id | Out-File -Encoding ascii api.pid

                        $ok = $false
                        for ($i = 0; $i -lt 30; $i++) {
                            try {
                                Invoke-WebRequest -UseBasicParsing "http://localhost:$($env:API_PORT)/api/healthz" | Out-Null
                                $ok = $true; break
                            } catch { Start-Sleep -Seconds 1 }
                        }
                        if (-not $ok) { Get-Content api.log, api-error.log; throw "La API no respondio en /api/healthz" }
                    '''
                    bat """
                        npx --yes newman@6 run tests/api/HotelLosVolcanes.postman_collection.json ^
                          -e tests/api/local.postman_environment.json ^
                          --env-var baseUrl=http://localhost:%API_PORT%/api ^
                          --reporters cli,junit ^
                          --reporter-junit-export newman-results.xml
                    """
                }
            }
            post {
                always {
                    powershell '''
                        if (Test-Path api.pid) {
                            Stop-Process -Id (Get-Content api.pid) -Force -ErrorAction SilentlyContinue
                            Remove-Item api.pid
                        }
                    '''
                    junit allowEmptyResults: true, testResults: 'newman-results.xml'
                    archiveArtifacts allowEmptyArchive: true, artifacts: 'newman-results.xml, api.log, api-error.log'
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
