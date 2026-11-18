import { expect, Locator, Page } from '@playwright/test';
import { LoginCredentials } from '../types';
import { BasePage } from './BasePage';

/**
 * Page Object para la pantalla de Login (/login).
 */
export class LoginPage extends BasePage {
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly rememberMeCheckbox: Locator;
  readonly loginButton: Locator;
  readonly validationErrorSummary: Locator;

  constructor(page: Page) {
    super(page);
    this.emailInput = page.locator('#Email');
    this.passwordInput = page.locator('#Password');
    this.rememberMeCheckbox = page.locator('#RememberMe');
    this.loginButton = page.locator('input.login-button');
    this.validationErrorSummary = page.locator('.validation-summary-errors');
  }

  /**
   * Navega directamente a la pantalla de Login.
   */
  async open(): Promise<void> {
    await this.navigateTo('/login');
    await expect(this.page).toHaveURL(/\/login/i);
  }

  /**
   * Ejecuta el flujo de inicio de sesión con las credenciales provistas.
   */
  async login(credentials: LoginCredentials, rememberMe = false): Promise<void> {
    await this.emailInput.fill(credentials.email);
    await this.passwordInput.fill(credentials.password);
    if (rememberMe) {
      await this.rememberMeCheckbox.check();
    }
    await this.loginButton.click();
  }

  /**
   * Obtiene el bloque completo del mensaje de error de autenticación fallida.
   */
  async getLoginErrorMessage(): Promise<string> {
    await expect(this.validationErrorSummary).toBeVisible();
    return (await this.validationErrorSummary.innerText()).trim();
  }
}
