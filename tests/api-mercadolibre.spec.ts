import { expect, test } from '../src/fixtures/baseTest';

test.describe('Módulo de Servicios Web (API) - Mercado Libre', () => {
  test('AUT-API-01: Verificar que GET https://www.mercadolibre.com.ar/menu/departments contenga "departments"', async ({
    mercadoLibreApi,
  }) => {
    const { response, body } = await test.step(
      '1. Enviar petición GET a https://www.mercadolibre.com.ar/menu/departments',
      async () => {
        return await mercadoLibreApi.getDepartments();
      }
    );

    await test.step('2. Verificar que el código de estado HTTP sea 200 OK', async () => {
      expect(response.ok()).toBeTruthy();
      expect(response.status()).toBe(200);
    });

    await test.step('3. Verificar que la respuesta contenga la propiedad "departments" con elementos', async () => {
      expect(body).toHaveProperty('departments');
      expect(Array.isArray(body.departments)).toBe(true);
      expect(body.departments.length).toBeGreaterThan(0);
    });
  });
});
