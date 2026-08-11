import { createEngine } from './engines/vitest-index';
import testEnumItems from './test-suites/enum-items';

declare const VITEST_ENGINE: 'vitest-node' | 'vitest-browser';

testEnumItems(createEngine(VITEST_ENGINE) as unknown as Parameters<typeof testEnumItems>[0]);
