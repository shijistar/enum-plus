import type { expect as playwrightExpect } from '@playwright/test';
import type { Locator } from '@vitest/browser/context' with { 'resolution-mode': 'import' };
import '@vitest/browser/matchers';
import type { Assertion, ExpectPollOptions, PromisifyDomAssertion, expect as vitestExpect } from 'vitest';
import type { MakeMatchers } from './playwright-types';

export type TestEngine = 'jest' | 'playwright' | 'vitest-node' | 'vitest-browser';

export interface Matchers<T> {
  jest: jest.JestMatchers<T>;
  // eslint-disable-next-line @typescript-eslint/ban-types
  playwright: MakeMatchers<void, T, {}>;
  'vitest-node': Assertion<T>;
  'vitest-browser': PromisifyDomAssertion<Awaited<Element | null>>;
}

export interface ExpectData {
  jest: unknown;
  playwright: unknown;
  'vitest-node': unknown;
  'vitest-browser': Locator;
}

export interface ExpectOptions {
  jest: never;
  playwright: Parameters<typeof playwrightExpect>[1];
  'vitest-node': Parameters<typeof vitestExpect>[1];
  'vitest-browser': ExpectPollOptions;
}
