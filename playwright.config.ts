import type { PlaywrightTestConfig } from '@playwright/test';
import { devices } from '@playwright/test';

const port = 7080;

const config: PlaywrightTestConfig = {
  testDir: './e2e/specs',
  testMatch: '**/*.spec.ts',
  outputDir: './e2e/test-results',
  globalSetup: require.resolve('./e2e/global.setup.ts'),
  globalTeardown: require.resolve('./e2e/global.teardown.ts'),
  forbidOnly: !!process.env.CI,
  retries: 2,
  use: {
    baseURL: `http://localhost:${port}`,
    headless: true,
  },
  projects: [
    // Modern browsers
    {
      name: 'chrome',
      use: devices['Desktop Chrome'],
      workers: 1,
    },
    {
      name: 'firefox',
      use: devices['Desktop Firefox'],
      workers: 1,
    },
    {
      name: 'webkit',
      use: devices['Desktop Safari'],
      workers: 1,
    },
    {
      name: 'edge',
      use: devices['Desktop Edge'],
      workers: 1,
    },
    // Legacy browsers (simulated)
    // {
    //   name: 'chromium-legacy',
    //   use: {
    //     browserName: 'chromium',
    //     // Use specific flags to simulate legacy browser behavior
    //     launchOptions: {
    //       args: ['--js-flags=--noturbo'],
    //     },
    //   },
    // },
  ],
  webServer: {
    command: `npx http-server ./e2e/fixtures -p ${port}`,
    port: 7080,
    reuseExistingServer: false,
  },
};

export default config;
