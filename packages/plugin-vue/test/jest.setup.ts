// eslint-disable-next-line import/no-named-as-default
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import initInstance from './data/initInstance';

/*
 * This file is used to set up the testing environment for Jest.
 * It runs before EACH TEST FILE in the suite.
 */

beforeAll(() => {
  // eslint-disable-next-line import/no-named-as-default-member
  i18n.use(initReactI18next);
  initInstance(i18n);
  jest.spyOn(console, 'warn').mockImplementation(() => {
    // Mock console.warn to suppress warnings during tests
  });
});

afterAll(() => {
  jest.clearAllMocks();
});
