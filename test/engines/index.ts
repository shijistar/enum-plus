import type { TestEngine } from './config';
import { JestEngine } from './jest';
import { PlaywrightEngine } from './playwright';

export const createEngine = (type: TestEngine) => {
  if (type === 'jest') {
    return new JestEngine();
  }
  if (type === 'playwright') {
    return new PlaywrightEngine();
  }
  throw new Error(`Unsupported test framework: ${type}`);
};
