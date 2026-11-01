import { defineConfig, devices } from '@playwright/test';
import config from './playwright.config.js';

/** The art gallery of `shots/`: needs a running server (E2E_EXTERNAL_URL), writes pictures only. */
export default defineConfig({
  ...config,
  testDir: './shots',
  webServer: undefined,
  projects: [
    ...(config.projects ?? []),
    {
      name: 'tablet',
      use: { ...devices['Desktop Chrome'], viewport: { width: 820, height: 1180 } },
    },
    {
      name: 'desktop',
      use: { ...devices['Desktop Chrome'], viewport: { width: 1920, height: 1080 } },
    },
  ],
});
