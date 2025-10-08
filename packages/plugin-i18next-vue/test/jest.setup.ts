import { createApp } from 'vue';
import { Enum } from 'enum-plus';
import i18next from 'i18next';
import I18NextVue from 'i18next-vue';
import useLocale from './components/useLocale';
import initInstance from './data/initInstance';

/*
 * This file is used to set up the testing environment for Jest.
 * It runs before EACH TEST FILE in the suite.
 */

beforeAll(() => {
  initInstance();
  const app = createApp({});
  app.use(I18NextVue, { i18next });
  Enum.localize = (key: string | undefined) => {
    return useLocale().t.value(key!);
  };
  // jest.spyOn(console, 'warn').mockImplementation(() => {
  //   // Mock console.warn to suppress warnings during tests
  // });
});

beforeEach(() => {
  const app = createApp({});
  app.use(I18NextVue, { i18next });
});

// afterAll(() => {
//   jest.clearAllMocks();
// });
