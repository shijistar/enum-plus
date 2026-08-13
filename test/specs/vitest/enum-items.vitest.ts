import { createEngine } from '../../engines/vitest';
import testEnumItems from '../../test-suites/enum-items';

declare const VITEST_ENGINE: 'vitest-node' | 'vitest-browser';

testEnumItems(createEngine(VITEST_ENGINE));
