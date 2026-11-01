import { defineConfig, devices } from '@playwright/test';

const E2E_WEB_PORT = Number(process.env.E2E_WEB_PORT ?? 5300);
/** Set to test a server that is already running, such as the production image (TECH-004). */
const E2E_EXTERNAL_URL = process.env.E2E_EXTERNAL_URL;
const E2E_WEB_URL = E2E_EXTERNAL_URL ?? `http://localhost:${E2E_WEB_PORT}`;

/**
 * Real browser against the real static build, so the PWA is tested as shipped: run `pnpm test:e2e`
 * from the root, which builds first. Portrait phone first, then a laptop (.project/ux-direction.md).
 */
export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  workers: 1,
  retries: 0,
  // On CI the failures also become annotations: those can be read without signing in to GitHub.
  reporter: process.env.CI ? [['list'], ['github']] : [['list']],
  use: {
    baseURL: E2E_WEB_URL,
    locale: 'vi-VN',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'phone-portrait',
      use: { ...devices['Pixel 7'], viewport: { width: 390, height: 844 } },
    },
    {
      name: 'laptop',
      use: { ...devices['Desktop Chrome'], viewport: { width: 1280, height: 800 } },
    },
  ],
  webServer: E2E_EXTERNAL_URL
    ? undefined
    : {
        command: 'pnpm --filter @cstar/web start',
        url: E2E_WEB_URL,
        reuseExistingServer: false,
        timeout: 30_000,
        env: { PORT: String(E2E_WEB_PORT) },
      },
});
