// eslint-disable-next-line import/no-unresolved
import { getLocales, setLang } from '@enum-plus/test/data/week-config';
import { defaultLocalize, Enum } from 'enum-plus';

/*
 * This file is used to set up the testing environment for Jest.
 * It runs before EACH TEST FILE in the suite.
 */

beforeAll(() => {
  setLang('en-US', Enum, getLocales, defaultLocalize);
  jest.spyOn(console, 'warn').mockImplementation(() => {
    // Mock console.warn to suppress warnings during tests
  });
});

afterAll(() => {
  jest.clearAllMocks();
});
