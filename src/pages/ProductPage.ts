import { expect, Locator, Page } from '@playwright/test';
import { ProductTestData } from '../types';
import { BasePage } from './BasePage';

/**
 * Page Object para la ficha de detalle de un producto.
 */
export class ProductPage extends BasePage {
  readonly quantityInput: Locator;
  readonly addToCartButton: Locator;
  readonly productPriceLabel: Locator;

  constructor(page: Page) {
    super(page);
    this.quantityInput = page.locator('.add-to-cart-panel input.qty-input');
    this.addToCartButton = page.locator('.add-to-cart-panel input.add-to-cart-button');
    this.productPriceLabel = page.locator('.product-essential .product-price span').first();
  }

  /**
   * Abre la página del producto seleccionado.
   */
  async openProduct(product: ProductTestData): Promise<void> {
    await this.navigateTo(product.urlPath);
    await expect(this.page.locator('h1[itemprop="name"]')).toContainText(product.name);
  }

  /**
   * Configura la cantidad deseada en el campo Qty y agrega el producto al carrito,
   * esperando la barra de confirmación superior para garantizar que la petición AJAX finalice.
   */
  async addProductToCart(product: ProductTestData, quantity = 1): Promise<void> {
    await this.openProduct(product);
    await this.quantityInput.fill(String(quantity));
    await this.addToCartButton.click();
    await expect(this.notificationBarSuccess).toBeVisible();
  }
}
