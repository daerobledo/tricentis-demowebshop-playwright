import { expect, Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Page Object para la pantalla de Carrito de Compras (/cart).
 */
export class ShoppingCartPage extends BasePage {
  readonly cartItemRows: Locator;
  readonly updateCartButton: Locator;
  readonly orderTotalValue: Locator;
  readonly cartWarningBox: Locator;

  constructor(page: Page) {
    super(page);
    this.cartItemRows = page.locator('tr.cart-item-row');
    this.updateCartButton = page.locator('input[name="updatecart"]');
    this.orderTotalValue = page.locator('.cart-total .order-total .product-price, .cart-total .cart-total-right .product-price').first();
    this.cartWarningBox = page.locator('.message-error, .warning-box, .terms-of-service-warning-box');
  }

  async openFromHeader(): Promise<void> {
    await this.clickShoppingCartInHeader();
    await expect(this.page).toHaveURL(/\/cart/i);
  }

  getRowByProductName(productName: string): Locator {
    return this.cartItemRows.filter({
      has: this.page.locator('a.product-name', { hasText: productName }),
    });
  }

  async getItemUnitPrice(productName: string): Promise<number> {
    const row = this.getRowByProductName(productName);
    const priceText = await row.locator('span.product-unit-price').innerText();
    return Number(priceText.trim());
  }

  async getItemSubtotal(productName: string): Promise<number> {
    const row = this.getRowByProductName(productName);
    const subtotalText = await row.locator('span.product-subtotal').innerText();
    return Number(subtotalText.trim());
  }

  async getItemQuantity(productName: string): Promise<number> {
    const row = this.getRowByProductName(productName);
    const value = await row.locator('input.qty-input').inputValue();
    return Number(value.trim());
  }

  async updateItemQuantity(productName: string, newQuantity: number | string): Promise<void> {
    const row = this.getRowByProductName(productName);
    const qtyInput = row.locator('input.qty-input');
    await qtyInput.fill(String(newQuantity));
    await this.updateCartButton.click();
  }

  async setRemoveCheckbox(productName: string, shouldRemove: boolean): Promise<void> {
    const row = this.getRowByProductName(productName);
    const checkbox = row.locator('input[name="removefromcart"]');
    if (shouldRemove) {
      await checkbox.check();
    } else {
      await checkbox.uncheck();
    }
  }

  async clickUpdateShoppingCart(): Promise<void> {
    await this.updateCartButton.click();
  }

  async getCalculatedCartTotal(): Promise<number> {
    const totalText = await this.orderTotalValue.innerText();
    return Number(totalText.trim());
  }
}
