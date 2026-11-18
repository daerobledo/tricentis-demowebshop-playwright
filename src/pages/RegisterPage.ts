import { expect, Locator, Page } from '@playwright/test';
import { Gender, RegisterUserData } from '../types';
import { BasePage } from './BasePage';

/**
 * Page Object para la pantalla de Registro (/register).
 */
export class RegisterPage extends BasePage {
  readonly genderMaleRadio: Locator;
  readonly genderFemaleRadio: Locator;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly confirmPasswordInput: Locator;
  readonly registerButton: Locator;
  readonly continueButton: Locator;
  readonly registrationCompletedMessage: Locator;
  readonly validationErrorSummary: Locator;

  constructor(page: Page) {
    super(page);
    this.genderMaleRadio = page.locator('#gender-male');
    this.genderFemaleRadio = page.locator('#gender-female');
    this.firstNameInput = page.locator('#FirstName');
    this.lastNameInput = page.locator('#LastName');
    this.emailInput = page.locator('#Email');
    this.passwordInput = page.locator('#Password');
    this.confirmPasswordInput = page.locator('#ConfirmPassword');
    this.registerButton = page.locator('#register-button');
    this.continueButton = page.locator('input.register-continue-button');
    this.registrationCompletedMessage = page.locator('.page.registration-result-page .result');
    this.validationErrorSummary = page.locator('.validation-summary-errors');
  }

  /**
   * Abre la página principal y navega a Register desde la barra superior.
   */
  async openFromHome(): Promise<void> {
    await this.navigateTo('/');
    await this.clickRegisterInHeader();
    await expect(this.page).toHaveURL(/\/register/i);
  }

  /**
   * Selecciona el género indicado.
   */
  async selectGender(gender: Gender): Promise<void> {
    if (gender === 'Male') {
      await this.genderMaleRadio.check();
    } else {
      await this.genderFemaleRadio.check();
    }
  }

  /**
   * Completa todos los campos obligatorios del formulario de registro y envía el formulario.
   */
  async submitRegistrationForm(userData: RegisterUserData): Promise<void> {
    await this.selectGender(userData.gender);
    await this.firstNameInput.fill(userData.firstName);
    await this.lastNameInput.fill(userData.lastName);
    await this.emailInput.fill(userData.email);
    await this.passwordInput.fill(userData.password);
    await this.confirmPasswordInput.fill(userData.confirmPassword);
    await this.registerButton.click();
  }

  /**
   * Completa el alta exitosa y avanza a la página principal si aparece la pantalla de confirmación.
   */
  async completeRegistrationAndRedirectHome(userData: RegisterUserData): Promise<void> {
    await this.submitRegistrationForm(userData);
    await expect(this.registrationCompletedMessage).toContainText('Your registration completed');
    if (await this.continueButton.isVisible()) {
      await this.continueButton.click();
    }
  }

  /**
   * Devuelve el mensaje de error de validación del formulario de registro.
   */
  async getErrorMessage(): Promise<string> {
    await expect(this.validationErrorSummary).toBeVisible();
    return (await this.validationErrorSummary.innerText()).trim();
  }
}
