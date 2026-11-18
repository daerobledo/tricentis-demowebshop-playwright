import { TEST_PRODUCTS } from '../src/data/testData';
import { expect, test } from '../src/fixtures/baseTest';

test.describe('Módulo de Carrito de Compras - Cobertura Automatizada', () => {
  test('AUT-CART-02: Cálculo de monto total con varios ítems en el carrito de compras', async ({
    productPage,
    shoppingCartPage,
  }) => {
    const itemA = TEST_PRODUCTS.ITEM_A; // Computing and Internet ($10.00)
    const qtyA = 2;
    const itemB = TEST_PRODUCTS.ITEM_B; // Fiction ($24.00)
    const qtyB = 1;

    await test.step('1. Seleccionar el producto A, ingresar cantidad 2 en Qty y hacer clic en Add to cart', async () => {
      await productPage.addProductToCart(itemA, qtyA);
    });

    await test.step('2. Acceder al segundo artículo (Producto B) y hacer clic en Add to cart (cantidad 1)', async () => {
      await productPage.addProductToCart(itemB, qtyB);
    });

    await test.step('3. Dirigirse a la opción Shopping cart situada en el menú superior', async () => {
      await shoppingCartPage.openFromHeader();
    });

    await test.step('4. Verificar indicador superior (3), subtotales parciales y suma exacta del total', async () => {
      const headerCount = await shoppingCartPage.getHeaderCartQuantity();
      expect(headerCount).toBe(qtyA + qtyB);

      const unitPriceA = await shoppingCartPage.getItemUnitPrice(itemA.name);
      const subtotalA = await shoppingCartPage.getItemSubtotal(itemA.name);
      expect(subtotalA).toBe(unitPriceA * qtyA);

      const unitPriceB = await shoppingCartPage.getItemUnitPrice(itemB.name);
      const subtotalB = await shoppingCartPage.getItemSubtotal(itemB.name);
      expect(subtotalB).toBe(unitPriceB * qtyB);

      const expectedTotal = subtotalA + subtotalB;
      const actualTotal = await shoppingCartPage.getCalculatedCartTotal();
      expect(actualTotal).toBe(expectedTotal);
    });
  });

  test('AUT-CART-03: Seleccionar múltiples ítems del carrito de compras para eliminar', async ({
    productPage,
    shoppingCartPage,
  }) => {
    const itemA = TEST_PRODUCTS.ITEM_A;
    const itemB = TEST_PRODUCTS.ITEM_B;
    const itemC = TEST_PRODUCTS.ITEM_C;

    await test.step('Precondición: Cargar 3 productos distintos (1 unidad de cada uno) y abrir Shopping Cart', async () => {
      await productPage.addProductToCart(itemA, 1);
      await productPage.addProductToCart(itemB, 1);
      await productPage.addProductToCart(itemC, 1);
      await shoppingCartPage.openFromHeader();

      const initialCount = await shoppingCartPage.getHeaderCartQuantity();
      expect(initialCount).toBe(3);
    });

    await test.step('1. Marcar el checkbox Remove para Ítem A e Ítem B, dejando desmarcado Ítem C', async () => {
      await shoppingCartPage.setRemoveCheckbox(itemA.name, true);
      await shoppingCartPage.setRemoveCheckbox(itemB.name, true);
      await shoppingCartPage.setRemoveCheckbox(itemC.name, false);
    });

    await test.step('2. Hacer clic en el botón Update shopping cart', async () => {
      await shoppingCartPage.clickUpdateShoppingCart();
    });

    await test.step('3. Verificar eliminación de A y B, permanencia de C, contador en (1) y recálculo del Total', async () => {
      await expect(shoppingCartPage.getRowByProductName(itemA.name)).toHaveCount(0);
      await expect(shoppingCartPage.getRowByProductName(itemB.name)).toHaveCount(0);
      await expect(shoppingCartPage.getRowByProductName(itemC.name)).toBeVisible();

      const updatedCount = await shoppingCartPage.getHeaderCartQuantity();
      expect(updatedCount).toBe(1);

      const itemCSubtotal = await shoppingCartPage.getItemSubtotal(itemC.name);
      const updatedTotal = await shoppingCartPage.getCalculatedCartTotal();
      expect(updatedTotal).toBe(itemCSubtotal);
    });
  });
});
