# Estrategia de Pruebas de API y Caso Documentado

## 1. Estrategia de Pruebas de API (5 Fases)
El proceso de validación de endpoints se estructura en cinco etapas:

1. **Detección de servicios y alcance**: Relevamiento mediante documentación técnica (Swagger / OpenAPI) o inspección de tráfico en la pestaña *Network* de las herramientas de desarrollador del navegador (DevTools).
2. **Análisis de request**: Revisión del método HTTP (`GET`, `POST`, `PUT`, `PATCH`, `DELETE`), URIs, parámetros, cabeceras requeridas, estructura del payload y códigos de respuesta esperados.
3. **Diseño de escenarios y preparación de datos**: Definición de pruebas funcionales sobre casos felices (`200 OK`, `201 Created`), escenarios negativos (`400 Bad Request`, `401 Unauthorized`, `404 Not Found`), valores límite y esquemas de respuesta, utilizando variables de entorno para evitar datos rígidos.
4. **Configuración en herramientas de prueba**: Organización de colecciones en Postman para validación manual e integración dentro del framework de automatización.
5. **Ejecución y validación**: Verificación de *status codes*, tipado y campos en el JSON devuelto, *headers*, tiempos de respuesta y persistencia de información.

## 2. Caso de Prueba de API Documentado (`API-01`)

### API-01: Autenticación exitosa de usuario con credenciales válidas
- **Objetivo**: Verificar que el servicio de login autentica correctamente a un usuario registrado, devuelve el código `200 OK` y genera un token de acceso válido.
- **Método y Endpoint**: `POST https://api.ejemplo-ecommerce.com/v1/auth/login`
- **Precondiciones**: El usuario `qa.gonzalo@test.com` existe y está activo en el entorno de pruebas.
- **Headers**:
  - `Content-Type: application/json`
  - `Accept: application/json`
- **Request Body**:
```json
{
  "email": "qa.gonzalo@test.com",
  "password": "Password123!"
}
```
- **Status Code Esperado**: `200 OK`
- **Response Body Esperado**:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "tokenType": "Bearer",
  "expiresIn": 3600,
  "user": {
    "id": 1042,
    "email": "qa.gonzalo@test.com"
  }
}
```
- **Aserciones a Validar**:
  1. El código de respuesta HTTP es exactamente `200`.
  2. El header `Content-Type` de la respuesta contiene `application/json`.
  3. El tiempo de respuesta es menor a `2000 ms`.
  4. El campo `token` existe, es de tipo `string` y no está vacío.
  5. El campo `expiresIn` es un número entero mayor a `0`.
  6. El campo `user.email` coincide exactamente con el email enviado en el request (`qa.gonzalo@test.com`).
