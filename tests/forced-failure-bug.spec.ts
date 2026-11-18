import { EXPECTED_MESSAGES, TEST_PRODUCTS } from '../src/data/testData';
import { expect, test } from '../src/fixtures/baseTest';

test.describe('Validación de Captura de Screenshots ante Fallas (Reproducción BUG-CART-01)', () => {
  /**
   * Caso de prueba de falla forzada basado en el bug real documentado BUG-CART-01:
   * "[CART] - No se muestra mensaje de error al agregar 9999999999 en el campo de Qty para un item".
   *
   * Propósito:
   * 1. Reproducir de forma automatizada el defecto detectado manualmente en el Carrito de Compras.
   * 2. Validar que cuando una aserción falla en Playwright, el framework genera automáticamente
   *    la captura de pantalla (screenshot) tanto en `tests/screenshots/` como en `test-results/`
   *    y la adjunta al reporte HTML (`playwright-report/`).
   */
  test('BUG-CART-01 (Falla Forzada): Validar mensaje de error al ingresar 9999999999 en Qty del carrito', async ({
    productPage,
    shoppingCartPage,
    page,
  }) => {
    const item = TEST_PRODUCTS.ITEM_A;

    await test.step('Precondición: Agregar 1 producto al carrito de compras', async () => {
      await productPage.addProductToCart(item, 1);
    });

    await test.step('1. Ingresar al carrito de compras desde el botón Shopping cart superior', async () => {
      await shoppingCartPage.openFromHeader();
    });

    await test.step('2. En el campo Qty ingresar 9999999999 y hacer clic en Update shopping cart', async () => {
      await shoppingCartPage.updateItemQuantity(item.name, '9999999999');
    });

    await test.step('3. Validar que aparezca el mensaje "The maximum quantity allowed for purchase is 10000."', async () => {
      // Esta aserción falla porque la aplicación tiene el bug BUG-CART-01 (no renderiza el mensaje de error),
      // disparando la captura automática del screenshot de evidencia.
      await expect(page.getByText(EXPECTED_MESSAGES.CART_MAX_QTY_EXCEEDED)).toBeVisible({
        timeout: 4_000,
      });
    });
  });
});
