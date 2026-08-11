import type { TestEngine } from './types';
import viTestBrowserEngine from './vitest-browser';
import viTestNodeEngine from './vitest-node';

/*
 * Vitest 专用引擎选择器（仅 vitest 入口使用）。
 *
 * 为什么不用 test/engines/index.ts：
 * index.ts 静态 import 了 playwright 引擎，playwright.ts 运行时 import
 * '@playwright/test'（Node 专用）。vitest browser project 若经 index.ts 加载，
 * vite 会把 '@playwright/test' 打进浏览器 bundle，导致
 * 'ReferenceError: process is not defined'。
 *
 * 这里只静态 import 两个 vitest 引擎（vitest-browser.ts 仅依赖
 * vitest/@vitest/browser，无 Node 专用依赖），浏览器 bundle 中不会出现
 * playwright。
 */
export const createEngine = (type: TestEngine) => {
  if (type === 'vitest-node') {
    return viTestNodeEngine;
  } else if (type === 'vitest-browser') {
    return viTestBrowserEngine;
  }
  throw new Error(`Unsupported vitest test framework: ${type}`);
};
