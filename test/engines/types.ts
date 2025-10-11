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

export interface ExpectConfig<T> {
  jest: [[unknown, never, jest.JestMatchers<T>], [unknown, never, jest.JestMatchers<T>]];
  playwright: [
    // eslint-disable-next-line @typescript-eslint/ban-types
    [unknown, NonNullable<Parameters<typeof playwrightExpect>[1]>, MakeMatchers<void, T, {}>],
    // eslint-disable-next-line @typescript-eslint/ban-types
    [unknown, NonNullable<Parameters<typeof playwrightExpect>[1]>, MakeMatchers<void, T, {}>],
  ];
  'vitest-node': [
    [unknown, NonNullable<Parameters<typeof vitestExpect>[1]>, Assertion<T>],
    [unknown, NonNullable<Parameters<typeof vitestExpect>[1]>, Assertion<T>],
  ];
  'vitest-browser': [
    [unknown, string, Assertion<T>],
    [Locator, ExpectPollOptions, PromisifyDomAssertion<Awaited<Element | null>>],
  ];
}

export interface ExpectOptions {
  jest: never;
  playwright: Parameters<typeof playwrightExpect>[1];
  'vitest-node': Parameters<typeof vitestExpect>[1];
  'vitest-browser': ExpectPollOptions;
}
