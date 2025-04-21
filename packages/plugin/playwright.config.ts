import type { PlaywrightTestConfig } from '@playwright/test';

const config: PlaywrightTestConfig = {
  testDir: './test-browser/specs',
  testMatch: '**/*.spec.ts',
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
    command: 'npx http-server ./test-browser/fixtures -p 7081',
    port: 7081,
    reuseExistingServer: !process.env.CI,
  },
};

export default config;
