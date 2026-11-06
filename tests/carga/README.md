# Pruebas de carga (E14)

Herramienta: Apache JMeter 5.6.3 (requiere Java 17 o superior).

## Escenario

- Endpoints: GET /api/rooms y POST /api/auth/login.
- Usuarios: rampa de 0 a 50 en 60 s y 5 minutos sostenidos (360 s en total).
- Pausa de 1 s entre peticiones de cada usuario.
- Al inicio se registra un usuario de prueba único que usan todos los hilos para el login.
- Ambiente: backend en Render (https://hotellosvolcanes.onrender.com).

## Cómo ejecutar

Desde esta carpeta, en Windows:

    correr_prueba_carga.bat          (prueba completa, 50 usuarios)
    correr_prueba_carga.bat corta    (prueba corta, 5 usuarios, 30 s)

El script busca JMeter en C:\ y en Descargas. Los resultados quedan en
resultado\ o resultado_corto\ y el reporte en reporte\index.html.
Antes de correrla, abrir https://hotellosvolcanes.onrender.com/api/healthz
para despertar el servidor.

## Parámetros

Se pueden cambiar con -J: host, protocol, port, users, ramp, duration.

## Resultado de la corrida del 2 de noviembre de 2026

| Endpoint | Muestras | Error | Promedio | p95 | Throughput |
| --- | --- | --- | --- | --- | --- |
| GET /api/rooms | 259 | 39.8 % | 23.2 s | 60.3 s | 0.62 req/s |
| POST /api/auth/login | 241 | 95.0 % | 46.1 s | 60.2 s | 0.59 req/s |
| Total | 500 | 66.4 % | 34.3 s | 60.2 s | 1.2 req/s |

Conclusión: no cumple RNF-01 (p95 menor a 2 s y error menor a 1 %).
Causa: el plan gratuito de Render (0.1 CPU) y bcrypt con costo 12 bloquean
el hilo principal de Node, por lo que también se degrada el catálogo.
