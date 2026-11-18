import {
  buildNewRegisterUser,
  DUPLICATE_REGISTER_USER,
  EXPECTED_MESSAGES,
} from '../src/data/testData';
import { expect, test } from '../src/fixtures/baseTest';

test.describe('Módulo de Registro - Cobertura Automatizada', () => {
  test('AUT-REG-01: Registro de usuario nuevo con datos válidos', async ({
    registerPage,
    page,
  }) => {
    const newUser = buildNewRegisterUser();

    await test.step('1. Ingresar a https://demowebshop.tricentis.com/ y hacer clic en Register', async () => {
      await registerPage.openFromHome();
    });

    await test.step('2. Completar todos los datos obligatorios y hacer clic en Register', async () => {
      await registerPage.completeRegistrationAndRedirectHome(newUser);
    });

    await test.step('3. Verificar redirección a la página principal y sesión activa en barra superior', async () => {
      await expect(page).toHaveURL('https://demowebshop.tricentis.com/');
      await registerPage.expectAuthenticatedHeader(newUser.email);
    });
  });

  test('AUT-REG-02: Registro de usuario con mail ya cargado en el sistema', async ({
    registerPage,
  }) => {
    await test.step('1. Ingresar a https://demowebshop.tricentis.com/ y hacer clic en Register', async () => {
      await registerPage.openFromHome();
    });

    await test.step('2. Completar los datos obligatorios usando un email ya registrado y hacer clic en Register', async () => {
      await registerPage.submitRegistrationForm(DUPLICATE_REGISTER_USER);
    });

    await test.step('3. Verificar que no se registra y se muestra el mensaje "The specified email already exists"', async () => {
      const errorMessage = await registerPage.getErrorMessage();
      expect(errorMessage).toContain(EXPECTED_MESSAGES.DUPLICATE_EMAIL_ERROR);
      await expect(registerPage.logoutHeaderLink).toBeHidden();
    });
  });
});
