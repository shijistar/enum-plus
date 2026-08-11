import { defaultLocalize, Enum } from '@enum-plus';
import { afterAll, beforeAll, beforeEach, vi } from 'vitest';
import { getLocales, setLang } from './data/week-config';

/*
 * This file is used to set up the testing environment for Vitest.
 * It mirrors test/jest.setup.ts using vitest's `vi` API.
 * It runs before EACH TEST FILE in the suite.
 */

beforeAll(() => {
  vi.spyOn(console, 'warn').mockImplementation(() => {
    // Mock console.warn to suppress warnings during tests
  });
});

beforeEach(() => {
  setLang(undefined, Enum, getLocales, defaultLocalize);
});

afterAll(() => {
  vi.clearAllMocks();
});
