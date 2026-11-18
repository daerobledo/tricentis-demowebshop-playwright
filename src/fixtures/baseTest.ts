import { test as base, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';
import { MercadoLibreApiService } from '../api/MercadoLibreApiService';
import { LoginPage } from '../pages/LoginPage';
import { ProductPage } from '../pages/ProductPage';
import { RegisterPage } from '../pages/RegisterPage';
import { ShoppingCartPage } from '../pages/ShoppingCartPage';

interface DemoWebShopFixtures {
  registerPage: RegisterPage;
  loginPage: LoginPage;
  productPage: ProductPage;
  shoppingCartPage: ShoppingCartPage;
  mercadoLibreApi: MercadoLibreApiService;
  captureScreenshotOnFailure: void;
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
  captureScreenshotOnFailure: [
    async ({ page }, use, testInfo) => {
      await use();
      if (testInfo.status !== testInfo.expectedStatus && page.url() !== 'about:blank') {
        const screenshotsDir = path.resolve(__dirname, '../../tests/screenshots');
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
    },
    { auto: true },
  ],
});

export { expect };