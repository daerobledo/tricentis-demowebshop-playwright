import { test as base, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';
import { MercadoLibreApiService } from '../api/MercadoLibreApiService';
import { LoginPage } from '../pages/LoginPage';
import { ProductPage } from '../pages/ProductPage';
import { RegisterPage } from '../pages/RegisterPage';
import { ShoppingCartPage } from '../pages/ShoppingCartPage';

/**
 * Definición de fixtures tipados para inyectar los Page Objects (UI) y los Clientes de Servicios Web (API)
 * directamente en cualquier caso de prueba.
 */
interface DemoWebShopFixtures {
  registerPage: RegisterPage;
  loginPage: LoginPage;
  productPage: ProductPage;
  shoppingCartPage: ShoppingCartPage;
  mercadoLibreApi: MercadoLibreApiService;
}

export const test = base.extend<DemoWebShopFixtures>({
  registerPage: async ({ page }, use) => {
    await use(new RegisterPage(page));
  },
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  productPage: async ({ page }, use) => {
    await use(new ProductPage(page));
  },
  shoppingCartPage: async ({ page }, use) => {
    await use(new ShoppingCartPage(page));
  },
  mercadoLibreApi: async ({ request }, use) => {
    await use(new MercadoLibreApiService(request));
  },
});

/**
 * Hook global afterEach:
 * Además del ajuste `screenshot: 'only-on-failure'` en playwright.config.ts (que adjunta la
 * captura al reporte HTML y a `test-results/`), este hook guarda una copia con nombre legible
 * dentro de `tests/screenshots/` y la adjunta explícitamente al reporte cuando un test UI falla.
 */
test.afterEach(async ({ page }, testInfo) => {
  if (testInfo.status !== testInfo.expectedStatus && page.url() !== 'about:blank') {
    const screenshotsDir = path.resolve(process.cwd(), 'tests', 'screenshots');
    fs.mkdirSync(screenshotsDir, { recursive: true });

    const safeTitle = testInfo.title
      .replace(/[^a-zA-Z0-9_-]+/g, '_')
      .replace(/^_+|_+$/g, '')
      .toLowerCase();
    const screenshotPath = path.join(screenshotsDir, `FAILED_${safeTitle}.png`);

    const buffer = await page.screenshot({ path: screenshotPath, fullPage: true });
    await testInfo.attach('Evidencia de Falla (Screenshot)', {
      body: buffer,
      contentType: 'image/png',
    });
  }
});

export { expect };
