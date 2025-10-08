import { config } from '@vue/test-utils';
import { beforeAll } from 'vitest';
import i18n from './data/i18n';
import legacyI18n from './data/legacy-i18n';

// @ts-expect-error: because env is not defined in some environments
const isLegacy = import.meta.env && import.meta.env.VITE_LEGACY === '1';
beforeAll(() => {
  if (isLegacy) {
    config.global.plugins = [legacyI18n];
  } else {
    config.global.plugins = [i18n];
  }
});
