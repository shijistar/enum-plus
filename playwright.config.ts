import type { PlaywrightTestConfig } from '@playwright/test';
import { devices } from '@playwright/test';

// todo: 支持legacy浏览器的测试
const config: PlaywrightTestConfig = {
  testDir: './e2e/specs',
  testMatch: '**/*.spec.ts',
  outputDir: './e2e/test-results',
  globalSetup: require.resolve('./e2e/global.setup.ts'),
  globalTeardown: require.resolve('./e2e/global.teardown.ts'),
  workers: 16,
  forbidOnly: !!process.env.CI,
  retries: 2,
  use: {
    baseURL: 'http://localhost:7080',
    headless: true,
  },
  projects: [
    // Modern browsers
    {
      name: 'chromium',
      use: devices['Desktop Chrome'],
    },
    {
      name: 'firefox',
      use: devices['Desktop Firefox'],
    },
    {
      name: 'webkit',
      use: devices['Desktop Safari'],
    },
    // Legacy browsers (simulated)
    {
      name: 'chromium-legacy',
      use: {
        browserName: 'chromium',
        // Use specific flags to simulate legacy browser behavior
        launchOptions: {
          args: ['--js-flags=--noturbo'],
        },
      },
    },
  ],
  webServer: {
    command: 'npx http-server ./e2e/fixtures -p 7080',
    port: 7080,
    reuseExistingServer: !process.env.CI,
  },
};

export default config;
