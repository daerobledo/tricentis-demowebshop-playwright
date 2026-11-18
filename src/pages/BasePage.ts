import { expect, Locator, Page } from '@playwright/test';

/**
 * Clase base del patrón Page Object Model (POM).
 * Centraliza los elementos comunes de la barra superior (Header) y métodos de navegación.
 */
export abstract class BasePage {
  protected readonly page: Page;
  readonly registerHeaderLink: Locator;
  readonly loginHeaderLink: Locator;
  readonly logoutHeaderLink: Locator;
  readonly accountHeaderLink: Locator;
  readonly shoppingCartHeaderLink: Locator;
  readonly shoppingCartQtyBadge: Locator;
  readonly notificationBarSuccess: Locator;

  constructor(page: Page) {
    this.page = page;
    this.registerHeaderLink = page.locator('.header-links a.ico-register');
    this.loginHeaderLink = page.locator('.header-links a.ico-login');
    this.logoutHeaderLink = page.locator('.header-links a.ico-logout');
    this.accountHeaderLink = page.locator('.header-links a.account');
    this.shoppingCartHeaderLink = page.locator('#topcartlink a.ico-cart');
    this.shoppingCartQtyBadge = page.locator('#topcartlink span.cart-qty');
    this.notificationBarSuccess = page.locator('#bar-notification.success');
  }

  /**
   * Navega a una ruta relativa dentro de https://demowebshop.tricentis.com/
   */
  async navigateTo(path = '/'): Promise<void> {
    await this.page.goto(path, { waitUntil: 'domcontentloaded' });
  }

  /**
   * Hace clic en la opción Register de la barra superior.
   */
  async clickRegisterInHeader(): Promise<void> {
    await this.registerHeaderLink.click();
  }

  /**
   * Hace clic en la opción Log in de la barra superior.
   */
  async clickLoginInHeader(): Promise<void> {
    await this.loginHeaderLink.click();
  }

  /**
   * Hace clic en la opción Shopping cart de la barra superior.
   */
  async clickShoppingCartInHeader(): Promise<void> {
    await this.shoppingCartHeaderLink.click();
  }

  /**
   * Obtiene el número entero mostrado en el contador superior Shopping cart (X).
   */
  async getHeaderCartQuantity(): Promise<number> {
    const rawText = (await this.shoppingCartQtyBadge.innerText()).trim();
    const match = rawText.match(/\((\d+)\)/);
    return match ? Number(match[1]) : 0;
  }

  /**
   * Valida que el usuario tenga sesión activa en la barra superior:
   * - Muestra el email de la cuenta en el enlace de usuario.
   * - Muestra el enlace Log out.
   * - Oculta los enlaces Register y Log in.
   */
  async expectAuthenticatedHeader(expectedEmail: string): Promise<void> {
    await expect(this.accountHeaderLink).toBeVisible();
    await expect(this.accountHeaderLink).toHaveText(expectedEmail);
    await expect(this.logoutHeaderLink).toBeVisible();
    await expect(this.registerHeaderLink).toBeHidden();
    await expect(this.loginHeaderLink).toBeHidden();
  }
}
