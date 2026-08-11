import { createEngine } from './engines/vitest-index';
import testEnumItem from './test-suites/enum-item';

declare const VITEST_ENGINE: 'vitest-node' | 'vitest-browser';

testEnumItem(createEngine(VITEST_ENGINE) as unknown as Parameters<typeof testEnumItem>[0]);
