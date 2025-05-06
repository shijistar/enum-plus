import type { PlaywrightTestConfig } from '@playwright/test';

const config: PlaywrightTestConfig = {
  testDir: './e2e/specs',
  testMatch: '**/*.spec.ts',
  outputDir: './e2e/test-results',
  globalSetup: require.resolve('./e2e/global.setup.ts'),
  globalTeardown: require.resolve('./e2e/global.teardown.ts'),
  use: {
    headless: true,
  },
  projects: [
    // Modern browsers
    {
      name: 'chromium',
      use: { browserName: 'chromium' },
    },
    {
      name: 'firefox',
      use: { browserName: 'firefox' },
    },
    {
      name: 'webkit',
      use: { browserName: 'webkit' },
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
