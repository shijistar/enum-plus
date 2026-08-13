import { createEngine } from '../../engines/vitest';
import testPlugin from '../../test-suites/plugin';

declare const VITEST_ENGINE: 'vitest-node' | 'vitest-browser';

testPlugin(createEngine(VITEST_ENGINE));
