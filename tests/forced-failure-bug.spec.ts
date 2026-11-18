import { EXPECTED_MESSAGES, TEST_PRODUCTS } from '../src/data/testData';
import { expect, test } from '../src/fixtures/baseTest';

test.describe('Validación de Captura de Screenshots ante Fallas (Reproducción BUG-CART-01)', () => {
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
      await expect(page.getByText(EXPECTED_MESSAGES.CART_MAX_QTY_EXCEEDED)).toBeVisible({
        timeout: 4_000,
      });
    });
  });
});
