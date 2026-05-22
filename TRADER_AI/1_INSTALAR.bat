@echo off
title TRADER.AI - Instalando
cd /d "%~dp0"

echo.
echo ================================================
echo   TRADER.AI - Instalador automatico
echo ================================================
echo.

python --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Python no instalado.
    echo Descargalo en: https://python.org/downloads
    echo IMPORTANTE: marca "Add Python to PATH" al instalar
    echo.
    start https://python.org/downloads
    pause
    exit /b 1
)

echo [OK] Python encontrado:
python --version
echo.

echo [1/4] Creando entorno virtual...
if not exist "venv" python -m venv venv
call venv\Scripts\activate.bat
python -m pip install --upgrade pip --quiet
echo [OK] Entorno listo
echo.

echo [2/4] Instalando paquetes (2-3 minutos)...
pip install anthropic --quiet
echo  + anthropic OK
pip install mss --quiet
echo  + mss OK
pip install Pillow --quiet
echo  + Pillow OK
pip install pygetwindow --quiet
echo  + pygetwindow OK
pip install websockets --quiet
echo  + websockets OK
pip install requests --quiet
echo  + requests OK
pip install numpy --quiet
echo  + numpy OK
pip install keyboard --quiet
echo  + keyboard OK
pip install pywin32 --quiet
echo  + pywin32 OK
python venv\Scripts\pywin32_postinstall.py -install >nul 2>&1
echo.

echo [3/4] Verificando...
python -c "import anthropic,mss,PIL,websockets,requests,numpy,keyboard,win32gui; print('[OK] Todo instalado correctamente')"
if errorlevel 1 (
    echo [AVISO] Revisa los errores arriba
)
echo.

echo [4/4] Listo!
echo.
echo ================================================
echo   INSTALACION COMPLETADA
echo.
echo   SIGUIENTE PASO: ejecuta 2_INICIAR.bat
echo   Ctrl+Shift+A = Analizar pantalla
echo   Ctrl+Shift+S = Detener agente
echo ================================================
echo.
pause
