import type { TestFramework } from './config';
import { JestAdapter } from './jest';
import { PlaywrightAdapter } from './playwright';

export const createAdapter = (type: TestFramework) => {
  if (type === 'jest') {
    return new JestAdapter();
  }
  if (type === 'playwright') {
    return new PlaywrightAdapter();
  }
  throw new Error(`Unsupported test framework: ${type}`);
};

export const jest = new JestAdapter();
export const playwright = new PlaywrightAdapter();
