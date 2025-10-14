// eslint-disable-next-line import/no-unresolved
import viTestBrowser from '@enum-plus/test/engines/vitest-browser';
import i18n from './data/i18n';
import legacyI18n from './data/legacy-i18n';
import testLocalization from './test-suites/localization';
import { isLegacy } from './utils';

testLocalization(viTestBrowser, isLegacy ? legacyI18n : i18n);
