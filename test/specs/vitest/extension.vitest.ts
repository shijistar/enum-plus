import { createEngine } from '../../engines/vitest';
import testExtension from '../../test-suites/extension';

declare const VITEST_ENGINE: 'vitest-node' | 'vitest-browser';

testExtension(createEngine(VITEST_ENGINE));
