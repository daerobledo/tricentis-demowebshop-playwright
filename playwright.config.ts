import { defineConfig, devices } from '@playwright/test';

/**
 * Configuración principal de Playwright para Tricentis Demo Web Shop y Servicios Web (API).
 * - Ejecuta las pruebas sobre Google Chrome.
 * - Captura screenshots automáticamente cuando un test falla y las adjunta al reporte HTML
 *   y al directorio de resultados.
 */
export default defineConfig({
  testDir: './tests',
  outputDir: './test-results',
  timeout: 45_000,
  expect: {
    timeout: 10_000,
  },
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  reporter: [
    ['list'],
    ['html', { open: 'never', outputFolder: 'playwright-report' }],
  ],
  use: {
    baseURL: 'https://demowebshop.tricentis.com',
    trace: 'retain-on-failure',
    /* Captura automática de screenshot al fallar cualquier prueba */
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    viewport: { width: 1280, height: 720 },
    actionTimeout: 15_000,
    navigationTimeout: 30_000,
    extraHTTPHeaders: {
      Accept: 'application/json, text/plain, */*',
    },
  },

  projects: [
    {
      name: 'Google Chrome',
      use: {
        ...devices['Desktop Chrome'],
        /* Ejecución explícita sobre el navegador Google Chrome */
        channel: 'chrome',
      },
    },
  ],
});
