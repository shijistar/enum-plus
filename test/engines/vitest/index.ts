import type { TestEngine } from '../types';
import viTestBrowserEngine from './vitest-browser';
import viTestNodeEngine from './vitest-node';

/**
 * Vitest dedicated engine selector (used only by the Vitest entry).
 *
 * Why not use test/engines/index.ts: index.ts statically imports the Playwright engine, while
 * playwright.ts imports '@playwright/test' at runtime (Node-only). If a Vitest browser project is
 * loaded via index.ts, Vite will include '@playwright/test' in the browser bundle, causing
 * 'ReferenceError: process is not defined'.
 *
 * Here, only two Vitest engines are statically imported (vitest-browser.ts only depends on
 * vitest/@vitest/browser, without any Node-only dependencies), so Playwright will not appear in the
 * browser bundle.
 */
export const createEngine = (type: Extract<TestEngine, 'vitest-node' | 'vitest-browser'>) => {
  if (type === 'vitest-node') {
    return viTestNodeEngine;
  } else if (type === 'vitest-browser') {
    return viTestBrowserEngine;
  }
  throw new Error(`Unsupported vitest test framework: ${type}`);
};
