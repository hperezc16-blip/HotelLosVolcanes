@echo off
setlocal
REM Prueba de carga E14: 0 a 50 usuarios en 1 minuto y 5 minutos sostenidos.
REM Uso:  correr_prueba_carga.bat          (prueba completa, unos 6 minutos)
REM       correr_prueba_carga.bat corta    (prueba rapida de 30 segundos con 5 usuarios)

set "JMETER="
for %%D in ("C:\apache-jmeter-5.6.3" "C:\apache-jmeter-5.6.3\apache-jmeter-5.6.3" "%USERPROFILE%\Downloads\apache-jmeter-5.6.3" "%USERPROFILE%\Downloads\apache-jmeter-5.6.3\apache-jmeter-5.6.3") do (
  if exist "%%~D\bin\jmeter.bat" set "JMETER=%%~D\bin\jmeter.bat"
)
if "%JMETER%"=="" (
  echo No se encontro JMeter. Descomprima apache-jmeter-5.6.3.zip en C:\ y vuelva a intentar.
  exit /b 1
)
echo Usando JMeter: %JMETER%

set "PLAN=%~dp0HotelLosVolcanes_carga.jmx"
set "SALIDA=%~dp0resultado"
set "PARAMS="
if /I "%~1"=="corta" (
  set "SALIDA=%~dp0resultado_corto"
  set "PARAMS=-Jusers=5 -Jramp=5 -Jduration=30"
)

if exist "%SALIDA%" rmdir /s /q "%SALIDA%"
mkdir "%SALIDA%"

echo Despertando el servidor de Render...
curl -s https://hotellosvolcanes.onrender.com/api/healthz
echo.

call "%JMETER%" -n -t "%PLAN%" %PARAMS% "-Jjmeter.reportgenerator.sample_filter=^(GET|POST) /api/(rooms|auth/login).*" -l "%SALIDA%\resultados.jtl" -e -o "%SALIDA%\reporte"

if exist "%SALIDA%\reporte\index.html" (
  echo Reporte listo: %SALIDA%\reporte\index.html
  start "" "%SALIDA%\reporte\index.html"
) else (
  echo No se genero el reporte. Revise los mensajes de JMeter de arriba.
)
endlocal
