import { createEngine } from '../../engines/vitest-index';
import testEnumCollection from '../../test-suites/enum-collection';

declare const VITEST_ENGINE: 'vitest-node' | 'vitest-browser';

testEnumCollection(createEngine(VITEST_ENGINE));
