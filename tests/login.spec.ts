import {
  EXPECTED_MESSAGES,
  INVALID_LOGIN_CREDENTIALS,
  VALID_LOGIN_CREDENTIALS,
} from '../src/data/testData';
import { expect, test } from '../src/fixtures/baseTest';

test.describe('Módulo de Login - Cobertura Automatizada', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.open();
  });

  test('AUT-LOGIN-01: Verificar Login con credenciales válidas', async ({
    loginPage,
    page,
  }) => {
    await test.step('1. Ingresar correo registrado, contraseña correcta y hacer clic en Log in', async () => {
      await loginPage.login(VALID_LOGIN_CREDENTIALS);
    });

    await test.step('2. Verificar redirección a la página principal y barra superior con email y Log out', async () => {
      await expect(page).toHaveURL('https://demowebshop.tricentis.com/');
      await loginPage.expectAuthenticatedHeader(VALID_LOGIN_CREDENTIALS.email);
    });
  });

  test('AUT-LOGIN-02: Verificar Login fallido con contraseña incorrecta', async ({
    loginPage,
    page,
  }) => {
    await test.step('1. Ingresar correo registrado, contraseña errónea y hacer clic en Log in', async () => {
      await loginPage.login(INVALID_LOGIN_CREDENTIALS);
    });

    await test.step('2. Verificar que permanece en Login y muestra el mensaje de credenciales inválidas', async () => {
      await expect(page).toHaveURL(/\/login/i);
      const errorText = await loginPage.getLoginErrorMessage();
      expect(errorText).toContain(EXPECTED_MESSAGES.LOGIN_UNSUCCESSFUL_SUMMARY);
      expect(errorText).toContain(EXPECTED_MESSAGES.LOGIN_INVALID_CREDENTIALS_DETAIL);
      await expect(loginPage.logoutHeaderLink).toBeHidden();
    });
  });
});
