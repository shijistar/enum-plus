import { createEngine } from './engines/vitest-index';
import testTyping from './test-suites/interface';

declare const VITEST_ENGINE: 'vitest-node' | 'vitest-browser';

testTyping(createEngine(VITEST_ENGINE) as unknown as Parameters<typeof testTyping>[0]);
