import { config } from '@vue/test-utils';
import { beforeAll } from 'vitest';
import i18n from './data/i18n';
import legacyI18n from './data/legacy-i18n';
import { isLegacy } from './utils';

beforeAll(() => {
  if (isLegacy) {
    config.global.plugins = [legacyI18n];
  } else {
    config.global.plugins = [i18n];
  }
});
