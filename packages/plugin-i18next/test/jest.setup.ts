import { defaultLocalize, Enum } from '@enum-plus';
import { getLocales, setLang } from '../../../test/data/week-config';
import antdPlugins from '../src';

/*
 * This file is used to set up the testing environment for Jest.
 * It runs before EACH TEST FILE in the suite.
 */

beforeAll(() => {
  Enum.install(antdPlugins);
  setLang('en-US', Enum, getLocales, defaultLocalize);
  jest.spyOn(console, 'warn').mockImplementation(() => {
    // Mock console.warn to suppress warnings during tests
  });
});

afterAll(() => {
  jest.clearAllMocks();
});
