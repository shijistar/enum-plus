import vue from '@vitejs/plugin-vue';
import { playwright } from '@vitest/browser-playwright';
import { join } from 'node:path';
import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [vue()],
  resolve: {
    mainFields: ['module', 'jsnext:main', 'browser', 'main'],
    conditions: ['import', 'module', 'browser'],
    alias: {
      vue: 'vue/dist/vue.esm-bundler.js',
      '@vue/test-utils': '../../node_modules/@vue/test-utils/dist/vue-test-utils.esm-browser.js',
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@enum-plus/test': join(__dirname, '../../tses/test'),
      '@enum-plus': join(__dirname, '../../es'),
    },
  },
  ssr: {
    resolve: {
      conditions: ['import', 'module', 'browser'],
    },
    // 将依赖打包进 SSR，避免 Node 直接 require CJS
    noExternal: true,
  },
  test: {
    environment: 'jsdom',
    deps: {
      inline: [/^(vue|@vue\/test-utils|vitest-browser-vue)$/],
    },
    include: ['test/**/*.{test,spec}.ts'],
    browser: {
      enabled: true,
      provider: playwright(),
      headless: true,
      // at least one instance is required
      instances: [{ browser: 'chromium' }],
    },
  },
});
