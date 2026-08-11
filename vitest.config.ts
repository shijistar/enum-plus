import { playwright } from '@vitest/browser-playwright';
import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vitest/config';

const srcIndex = fileURLToPath(new URL('./src/index.ts', import.meta.url));
const srcDir = fileURLToPath(new URL('./src/', import.meta.url));
const setupFile = fileURLToPath(new URL('./test/vitest.setup.ts', import.meta.url));

// 与 jest.config.js 的 moduleNameMapper 对齐：
//   '^@enum-plus/(.*)$': '<rootDir>/src/$1'
//   '^@enum-plus':       '<rootDir>/src'
const alias = [
  { find: '@enum-plus/', replacement: srcDir },
  { find: '@enum-plus', replacement: srcIndex },
];

export default defineConfig({
  resolve: { alias },
  test: {
    // coverage 是进程级配置（vitest 官方文档），放在根 test 层；
    // Node 环境经 CLI `--coverage` 启用，浏览器环境不启用（用户决策 1）
    coverage: {
      provider: 'istanbul',
      include: ['src/**/*.{ts,tsx}'],
      exclude: [
        'src/types.ts',
        'src/localize-interface.ts',
        'src/extension.d.ts',
        '**/*.d.ts',
        '**/*.test.ts',
        '**/*.vitest.ts',
      ],
      thresholds: {
        statements: 100,
        // branches 99%：src/enum-item.ts:104 的 else-if 隐式 else 分支为工具口径差异（jest 不统计、
        // vitest istanbul 拆分为双分支），逻辑不可达，无法通过测试输入覆盖（用户 08-12 决策）。
        branches: 99,
        functions: 100,
        lines: 100,
      },
    },
    // 一套 test/*.vitest.ts 入口，由 VITEST_ENGINE 区分引擎
    projects: [
      {
        // ---------- Node.js 环境 ----------
        extends: true,
        define: {
          VITEST_ENGINE: '"vitest-node"',
        },
        test: {
          name: 'node',
          environment: 'node',
          include: ['test/**/*.vitest.ts'],
          setupFiles: [setupFile],
        },
      },
      {
        // ---------- 浏览器环境（browser-mode）----------
        extends: true,
        define: {
          VITEST_ENGINE: '"vitest-browser"',
        },
        test: {
          name: 'browser',
          include: ['test/**/*.vitest.ts'],
          setupFiles: [setupFile],
          browser: {
            enabled: true,
            provider: playwright(),
            headless: true,
            instances: [{ browser: 'chromium' }],
          },
          // 浏览器环境不设覆盖率门槛（用户决策 1：与 Node 跑相同用例，全绿即可）
        },
      },
    ],
  },
});
