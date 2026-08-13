import { createEngine } from '../../engines/vitest';
import testLocalization from '../../test-suites/localization';

declare const VITEST_ENGINE: 'vitest-node' | 'vitest-browser';

testLocalization(createEngine(VITEST_ENGINE));
