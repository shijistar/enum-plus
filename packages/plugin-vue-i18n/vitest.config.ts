import vue from '@vitejs/plugin-vue';
import { playwright } from '@vitest/browser-playwright';
import { join } from 'node:path';
import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@enum-plus/test': join(__dirname, '../../tses/test'),
      '@enum-plus': join(__dirname, '../../es'),
    },
  },
  test: {
    include: ['test/**/*.{test,spec}.ts'],
    setupFiles: ['./test/vitest.setup.ts'],
    watch: false,
    env: { VITE_LEGACY: process.env.LEGACY },
    coverage: {
      provider: 'istanbul',
      enabled: true,
      include: ['src/**/*.ts'],
      thresholds: {
        statements: 100,
        branches: 100,
        functions: 100,
        lines: 100,
      },
    },
    browser: {
      enabled: true,
      provider: playwright(),
      headless: true,
      instances: [{ browser: 'chromium' } /* { browser: 'firefox' }, { browser: 'webkit' } */],
    },
  },
});
