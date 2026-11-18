# Reporte de Bugs Manuales — Tricentis Demo Web Shop

## BUG-CART-01: [CART] - No se muestra mensaje de error al agregar 9999999999 en el campo de Qty para un ítem
- **ID**: `BUG-CART-01`
- **URL**: [https://demowebshop.tricentis.com/cart](https://demowebshop.tricentis.com/cart)
- **Navegador**: Google Chrome
- **Severidad**: Media
- **Prioridad**: Media
- **Precondiciones**: El usuario tiene al menos un ítem cargado en el carrito de compras.
- **Pasos para Reproducir**:
  1. Ingresar al carrito de compras haciendo clic en el botón `Shopping cart` en la esquina superior derecha de la home page.
  2. En el campo `Qty.` ingresar `9999999999`.
  3. Presionar la tecla `Enter` o hacer clic en `Update shopping cart`.
- **Resultado Esperado**: Aparece un mensaje de error `"The maximum quantity allowed for purchase is 10000."` y se actualiza el monto en el campo de `Qty.` al valor original.
- **Resultado Obtenido**: No aparece ningún mensaje de error y únicamente se revierte el valor en el campo de `Qty.` al monto original sin informar al usuario el motivo.
- **Automatización Asociada**: Reproducido automáticamente en `tests/forced-failure-bug.spec.ts` para demostrar la generación de capturas de pantalla (`screenshots`) ante fallos.

## BUG-LOGIN-01: [LOGIN] - Se muestra el mail de la sesión cerrada al volver atrás en la página
- **ID**: `BUG-LOGIN-01`
- **URL**: [https://demowebshop.tricentis.com/](https://demowebshop.tricentis.com/)
- **Navegador**: Google Chrome
- **Severidad**: Media
- **Prioridad**: Media
- **Precondiciones**: El usuario está previamente logueado en el sistema.
- **Pasos para Reproducir**:
  1. En la página principal, observar que el mail del usuario está efectivamente logueado en el sistema.
  2. Hacer clic en `Log out`.
  3. Hacer clic en el botón **Atrás (Back)** del navegador.
- **Resultado Esperado**: Aunque se vuelva atrás en la página, la interfaz mantiene el estado de sesión cerrada.
- **Resultado Obtenido**: Al volver atrás en el navegador, la interfaz renderiza la barra superior desde la caché mostrando el mail del usuario como si la sesión siguiera activa.
