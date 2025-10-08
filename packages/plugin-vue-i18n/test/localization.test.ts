// eslint-disable-next-line import/no-unresolved
import viTestBrowser from '@enum-plus/test/engines/vitest-browser';
import i18n from './data/i18n';
import legacyI18n from './data/legacy-i18n';
import testLocalization from './test-suites/localization';

// @ts-expect-error: because env is not defined in some environments
const isLegacy = import.meta.env && import.meta.env.VITE_LEGACY === '1';

testLocalization(viTestBrowser, isLegacy ? legacyI18n : i18n);
