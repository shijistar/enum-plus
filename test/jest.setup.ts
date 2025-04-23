import { defaultLocalize, Enum } from '@enum-plus';
import { getLocales, setLang } from './data/week-config';

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
