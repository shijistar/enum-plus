import { createEngine } from '../../engines/vitest';
import testEnumItem from '../../test-suites/enum-item';

declare const VITEST_ENGINE: 'vitest-node' | 'vitest-browser';

testEnumItem(createEngine(VITEST_ENGINE));
