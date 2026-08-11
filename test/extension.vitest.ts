import { createEngine } from './engines/vitest-index';
import testExtension from './test-suites/extension';

declare const VITEST_ENGINE: 'vitest-node' | 'vitest-browser';

testExtension(createEngine(VITEST_ENGINE) as unknown as Parameters<typeof testExtension>[0]);
