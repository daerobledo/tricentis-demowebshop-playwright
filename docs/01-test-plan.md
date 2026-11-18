# Test Plan - Tricentis Demo Web Shop

## 1. Objetivo del Test
Validar la calidad funcional, usabilidad y estabilidad de los flujos de **Registro**, **Login** y **Carrito de Compras** en [Tricentis Demo Web Shop](https://demowebshop.tricentis.com/), además de la integración con **Servicios Web (API)**.

## 2. Alcance

### 2.1. In-Scope
- **Registro de nuevos Usuarios**: Alta de cuentas nuevas y validación de correos duplicados.
- **Inicio y cierre de Sesión**: Credenciales válidas e inválidas, mensajes de error y persistencia de sesión (`Remember me?`).
- **Carrito de Compras**: Agregar o quitar productos, actualización de cantidades de ítems y correcto cálculo de montos parciales y totales.
- **Pruebas de Servicios Web (API)**: Validación de endpoints HTTP mediante el cliente `APIRequestContext` de Playwright (`GET https://www.mercadolibre.com.ar/menu/departments`).

### 2.2. Out-of-Scope
- Workflow completo de compra (Checkout end-to-end).
- Pagos (medios de pago, cupones, gift cards).
- Módulo de Filtros (filtro lateral, tags).
- Módulo de Búsqueda.

## 3. Estrategia y Tipos de Testing
- **3.1. Pruebas Funcionales (Manuales y Automatizadas)**: Testing de Caja Negra sobre escenarios positivos (*happy path*) y negativos, tanto en UI como en Servicios Web (API).
- **3.2. Pruebas de Regresión y Smoke**: Definidas según criticidad de negocio para cubrir la mayor cantidad de escenarios positivos y negativos y asegurar la calidad de la entrega. El **Smoke Test** se ejecuta al principio de cada ciclo o despliegue para validar que los flujos principales del sistema funcionan sin inconvenientes.
- **3.3. Pruebas de Compatibilidad**: Las pruebas se realizan sobre el navegador **Google Chrome** para cubrir la mayor cantidad de navegadores basados en Chromium.

## 4. Entorno de Pruebas y Herramientas
| Componente | Detalle |
| :--- | :--- |
| **Entorno de Pruebas UI** | [https://demowebshop.tricentis.com/](https://demowebshop.tricentis.com/) |
| **Entorno de Pruebas API** | `GET https://www.mercadolibre.com.ar/menu/departments` |
| **Navegador Objetivo** | Google Chrome (`channel: 'chrome'`) |
| **Gestión de Código y Evidencias** | Repositorio público en GitHub |
| **Framework de Automatización** | Playwright + TypeScript bajo patrón Page Object Model (POM) + Cliente modular de Servicios Web (`src/api/`) con captura automática de screenshots ante fallas |

## 5. Criterios de Finalización y Entrega
Se define el testing como finalizado cuando se ejecuta el **100% de los casos de prueba definidos**. Posteriormente se ejecuta la suite de Regresión. En caso de encontrar bugs durante la ejecución, se documentan con sus evidencias y severidad/prioridad para definir junto al equipo de desarrollo su resolución y posterior verificación (*re-test*).

## 6. Estrategia de Suites (Smoke y Regresión)

### 6.1. Smoke Testing Suite
- **Objetivo**: Confirmar rápidamente al iniciar cada ciclo o despliegue que los flujos principales del sistema funcionan sin inconvenientes.
- **Casos incluidos**:
  - `AUT-REG-01`: Alta de nuevos usuarios ingresando datos correctos.
  - `LOGIN-01` / `AUT-LOGIN-01`: Validar el ingreso al sistema utilizando datos de acceso válidos.
  - `CART-01`: Adición de múltiples unidades de un producto dentro de la compra.
  - `AUT-API-01`: Verificación de disponibilidad y esquema (`departments`) del servicio web de departamentos.
- **Justificación**: Reúne únicamente los escenarios felices de mayor relevancia para asegurar el funcionamiento operativo mínimo de la plataforma.

### 6.2. Regression Suite
- **Objetivo**: Asegurar que las actualizaciones, modificaciones en el código o correcciones de fallos no impacten negativamente en el comportamiento ya validado.
- **Casos incluidos**:
  - La totalidad de las pruebas comprendidas dentro del Smoke Suite.
  - `AUT-REG-02`: Comprobación de campos requeridos y validación de correos previamente registrados.
  - `LOGIN-02` / `AUT-LOGIN-02`: Confirmar rechazo de acceso al ingresar una clave errónea.
  - `LOGIN-03`: Probar la persistencia mediante la opción `Remember me?`.
  - `CART-02` / `AUT-CART-02`: Correcto cálculo del importe total al incluir diversos productos.
  - `CART-03` / `AUT-CART-03`: Remoción simultánea de varios elementos agregados a la orden.
- **Justificación**: Contempla casos borde (*edge cases*), respuestas ante errores, persistencia de datos y cálculos de valores para garantizar la estabilidad general antes del cierre de las ejecuciones.
