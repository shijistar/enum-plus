import { createEngine } from '../../engines/vitest';
import testVersion from '../../test-suites/version';

declare const VITEST_ENGINE: 'vitest-node' | 'vitest-browser';

testVersion(createEngine(VITEST_ENGINE));
