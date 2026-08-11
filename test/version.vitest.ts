import { createEngine } from './engines/vitest-index';
import testVersion from './test-suites/version';

declare const VITEST_ENGINE: 'vitest-node' | 'vitest-browser';

testVersion(createEngine(VITEST_ENGINE) as unknown as Parameters<typeof testVersion>[0]);
