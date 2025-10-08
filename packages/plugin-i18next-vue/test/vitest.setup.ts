import { config } from '@vue/test-utils';
import i18next from 'i18next';
import I18NextVue from 'i18next-vue';
import { beforeAll } from 'vitest';
import initInstance from './data/initInstance';

beforeAll(() => {
  initInstance();
  config.global.plugins = [[I18NextVue, { i18next, rerenderOn: ['languageChanged', 'loaded'] }]];
});
