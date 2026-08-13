import jestEngine from './jest';
import playwrightEngine from './playwright';
import type { TestEngine } from './types';
import viTestBrowserEngine from './vitest-browser';
import viTestNodeEngine from './vitest-node';

export const createEngine = (type: TestEngine) => {
  if (type === 'jest') {
    return jestEngine;
  } else if (type === 'playwright') {
    return playwrightEngine;
  } else if (type === 'vitest-node') {
    return viTestNodeEngine;
  } else if (type === 'vitest-browser') {
    return viTestBrowserEngine;
  }
  throw new Error(`Unsupported test framework: ${type}`);
};
