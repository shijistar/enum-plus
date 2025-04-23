import { defaultLocalize, Enum } from '@enum-plus';
import { getLocales, setLang } from './data/week-config';

beforeAll(() => {
  setLang('en-US', Enum, getLocales, defaultLocalize);
  jest.spyOn(console, 'warn').mockImplementation(() => {
    // Mock console.warn to suppress warnings during tests
  });
});

afterAll(() => {
  jest.clearAllMocks();
});
