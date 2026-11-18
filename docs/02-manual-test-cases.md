# Casos de Prueba Manuales y Cobertura Automatizada

## 1. Casos de Prueba Manuales — Módulo Login

### LOGIN-01: Verificar Login con credenciales válidas
- **Módulo**: Página de Login ([https://demowebshop.tricentis.com/login](https://demowebshop.tricentis.com/login))
- **Prioridad**: Alta
- **Precondiciones**: El usuario cuenta con una cuenta previamente registrada en `https://demowebshop.tricentis.com/` y se encuentra en la pantalla de Login sin sesión iniciada.
- **Datos de prueba**:
  - Email: `vzfldljdpixuocifoz@jbsze.com`
  - Contraseña: `Testing123`
- **Pasos**:
  1. Ingresar el correo registrado en el campo `Email`.
  2. Ingresar la contraseña correcta en el campo `Password`.
  3. Hacer clic en el botón `Log in`.
- **Resultado esperado**: El sistema autentica al usuario, redirige a la página principal y muestra en la barra superior el email de la cuenta junto al enlace `Log out` (reemplazando a `Register` y `Log in`).

### LOGIN-02: Verificar Login fallido con contraseña incorrecta
- **Módulo**: Página de Login ([https://demowebshop.tricentis.com/login](https://demowebshop.tricentis.com/login))
- **Prioridad**: Alta
- **Precondiciones**: El usuario cuenta con una cuenta registrada y se encuentra en la Página de Login.
- **Datos de prueba**:
  - Email: `vzfldljdpixuocifoz@jbsze.com`
  - Contraseña: `Testing111`
- **Pasos**:
  1. Ingresar el correo registrado en el campo `Email`.
  2. Ingresar una contraseña errónea en el campo `Password`.
  3. Hacer clic en el botón `Log in`.
- **Resultado esperado**: El sistema impide el acceso, mantiene al usuario en la página de Login y muestra el mensaje de error indicando que las credenciales son inválidas (`"Login was unsuccessful. Please correct the errors and try again. The credentials provided are incorrect"`).

### LOGIN-03: Verificar funcionamiento de la casilla Remember me?
- **Módulo**: Página de Login ([https://demowebshop.tricentis.com/login](https://demowebshop.tricentis.com/login))
- **Prioridad**: Media
- **Precondiciones**: El usuario dispone de una cuenta creada en `https://demowebshop.tricentis.com/` y se halla en el apartado de acceso con el selector `Remember me?` sin marcar.
- **Datos de prueba**:
  - Email: `vzfldljdpixuocifoz@jbsze.com`
  - Contraseña: `Testing123`
- **Pasos**:
  1. Colocar el mail y clave en los campos correspondientes.
  2. Seleccionar la casilla `Remember me?`.
  3. Hacer clic en el botón `Log in`.
  4. Cerrar la pestaña del browser y volver a ingresar a `https://demowebshop.tricentis.com/` en una nueva pestaña sin desloguearse previamente.
- **Resultado esperado**: La página mantiene la sesión activa, redirige correctamente y exhibe en el menú superior la cuenta del usuario junto al botón `Log out`.

## 2. Casos de Prueba Manuales — Módulo Carrito de Compras

### CART-01: Agregar múltiples unidades de un mismo ítem al carrito de compras
- **Módulo**: Carrito de Compras ([https://demowebshop.tricentis.com/cart](https://demowebshop.tricentis.com/cart))
- **Prioridad**: Alta
- **Precondiciones**: El usuario se encuentra en `https://demowebshop.tricentis.com/` con el carrito vacío.
- **Datos de prueba**: Cualquier producto simple | Cantidad final: `3`
- **Pasos**:
  1. Navegar al producto seleccionado y hacer clic en el botón `Add to cart`.
  2. Hacer clic nuevamente en el botón `Add to cart`.
  3. Dirigirse a la sección `Shopping cart` en el menú superior.
  4. Modificar la cantidad del ítem en la casilla `Qty.` a `3` y hacer clic en `Update shopping cart`.
- **Resultado esperado**: El sistema consolida los productos en una única línea del carrito, actualiza la cantidad en el campo `Qty.` a `3`, refleja la cantidad en el contador superior `(3)` y calcula correctamente el precio subtotal correspondiente.

### CART-02: Cálculo de monto total con varios ítems en el carrito de compras
- **Módulo**: Carrito de Compras ([https://demowebshop.tricentis.com/cart](https://demowebshop.tricentis.com/cart))
- **Prioridad**: Alta
- **Precondiciones**: El usuario se sitúa en `https://demowebshop.tricentis.com/` teniendo su carrito sin productos agregados.
- **Datos de prueba**: Ítem A (valor A, cantidad 2) e Ítem B (valor B, cantidad 1).
- **Pasos**:
  1. Seleccionar el producto A y hacer clic en él.
  2. En la página del producto, en el campo de `Qty` agregar `2` del mismo producto.
  3. Hacer clic en `Add to cart`.
  4. Acceder al segundo artículo seleccionado y hacer clic en `Add to cart`.
  5. Dirigirse a la opción `Shopping cart` situada en el menú superior.
- **Resultado esperado**: La plataforma muestra la suma total de elementos en el indicador superior `(3)`, computa adecuadamente cada valor parcial por elemento y determina el importe final reflejando la suma exacta de los productos.

### CART-03: Seleccionar múltiples ítems del carrito de compras para eliminar
- **Módulo**: Carrito de Compras ([https://demowebshop.tricentis.com/cart](https://demowebshop.tricentis.com/cart))
- **Prioridad**: Alta
- **Precondiciones**: El usuario se encuentra en la página de Shopping Cart con 3 productos distintos cargados, 1 unidad de cada uno; contador en Shopping Cart muestra `(3)`.
- **Datos de prueba**: Ítems seleccionados para eliminar: Ítem A e Ítem B. Ítem que permanece: Ítem C.
- **Pasos**:
  1. Marcar el checkbox `Remove` correspondiente al Ítem A.
  2. Marcar el checkbox `Remove` correspondiente al Ítem B.
  3. Dejar desmarcado el checkbox `Remove` del Ítem C.
  4. Hacer clic en el botón `Update shopping cart`.
- **Resultado esperado**: Ítems A y B se eliminan del listado, Ítem C permanece en el carrito sin alteraciones, el contador superior baja a `Shopping cart (1)` y el Total se recalcula mostrando únicamente el importe del Ítem C.

## 3. Cobertura Automatizada de Flujos Clave y Servicios Web

| ID Caso | Flujo / Módulo | Archivo de Test | Descripción |
| :--- | :--- | :--- | :--- |
| **AUT-REG-01** | Registro | `tests/register.spec.ts` | Registro de usuario nuevo con email único y verificación de sesión activa en la barra superior. |
| **AUT-REG-02** | Registro | `tests/register.spec.ts` | Registro con email ya existente y verificación del mensaje `"The specified email already exists"`. |
| **AUT-LOGIN-01** | Login | `tests/login.spec.ts` | Inicio de sesión exitoso con credenciales válidas (`vzfldljdpixuocifoz@jbsze.com`). |
| **AUT-LOGIN-02** | Login | `tests/login.spec.ts` | Inicio de sesión fallido con contraseña errónea (`Testing111`) y validación de mensaje de error. |
| **AUT-CART-02** | Carrito de Compras | `tests/cart.spec.ts` | Cálculo de subtotales parciales y monto total con múltiples ítems (Ítem A x2 + Ítem B x1). |
| **AUT-CART-03** | Carrito de Compras | `tests/cart.spec.ts` | Eliminación simultánea de múltiples ítems (A y B) conservando el Ítem C y recalculando el total. |
| **AUT-API-01** | Servicios Web (API) | `tests/api-mercadolibre.spec.ts` | Petición `GET https://www.mercadolibre.com.ar/menu/departments` verificando status `200 OK` y que el JSON contenga `"departments"`. |
| **BUG-CART-01** *(Falla Forzada)* | Carrito de Compras | `tests/forced-failure-bug.spec.ts` | Caso de falla forzada que reproduce `BUG-CART-01` (`Qty = 9999999999`) para validar la creación automática de screenshots al fallar un test. |
