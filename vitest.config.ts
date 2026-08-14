import { playwright } from '@vitest/browser-playwright';
import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vitest/config';

// @ts-expect-error: because alias should work in both nodejs and browser environments
const srcIndex = fileURLToPath(new URL('./src/index.ts', import.meta.url));
// @ts-expect-error: because alias should work in both nodejs and browser environments
const srcDir = fileURLToPath(new URL('./src/', import.meta.url));
// @ts-expect-error: because alias should work in both nodejs and browser environments
const setupFile = fileURLToPath(new URL('./test/specs/vitest/vitest.setup.ts', import.meta.url));

export default defineConfig({
  test: {
    coverage: {
      provider: 'istanbul', // 'istanbul' | 'v8'
      include: ['src/**/*.{ts,tsx}'],
      thresholds: {
        statements: 100,
        branches: 100,
        functions: 100,
        lines: 100,
      },
    },
    // A set of test/*.vitest.ts entry points, distinguished by VITEST_ENGINE
    projects: [
      {
        // ---------- Node.js Environment ----------
        extends: true,
        define: {
          VITEST_ENGINE: '"vitest-node"',
        },
        test: {
          name: 'node',
          environment: 'node',
          include: ['test/specs/vitest/**/*.vitest.ts'],
          setupFiles: [setupFile],
        },
      },
      {
        // ---------- Browser Environment (browser-mode) ----------
        extends: true,
        define: {
          VITEST_ENGINE: '"vitest-browser"',
        },
        test: {
          name: 'browser',
          include: ['test/specs/vitest/**/*.vitest.ts'],
          setupFiles: [setupFile],
          browser: {
            enabled: true,
            provider: playwright(),
            headless: true,
            instances: [{ browser: 'chromium' }, { browser: 'firefox' }, { browser: 'webkit' }],
          },
        },
      },
    ],
  },
  resolve: {
    alias: [
      { find: '@enum-plus/', replacement: srcDir },
      { find: '@enum-plus', replacement: srcIndex },
    ],
  },
});
