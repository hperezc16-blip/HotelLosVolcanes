# Pruebas de API (E11)

Colección de Postman con 24 solicitudes y 67 aserciones sobre código de respuesta, esquema JSON y contenido.

| Carpeta | Qué prueba |
|---|---|
| Flujo de reservación (01 a 18) | Flujo completo de negocio encadenado: registro, login, búsqueda y disponibilidad, reservación, rechazo por traslape, pago, dashboard y cierre por el administrador |
| Validaciones y seguridad (19 a 24) | Credenciales incorrectas, contraseña corta, correo duplicado, acceso sin token, acceso de cliente al panel de administración y fechas inválidas |

Las solicitudes comparten variables (token, id de habitación, id de reservación), por lo que deben ejecutarse en orden.

## Ejecutar

```bash
# Contra la API local o la del pipeline
npx newman run tests/api/HotelLosVolcanes.postman_collection.json -e tests/api/local.postman_environment.json

# Contra la API desplegada en Render (abrir antes /api/healthz para despertar el servidor)
npx newman run tests/api/HotelLosVolcanes.postman_collection.json -e tests/api/render.postman_environment.json
```

Para una base de datos local vacía, cargar primero `db-setup.sql`.
