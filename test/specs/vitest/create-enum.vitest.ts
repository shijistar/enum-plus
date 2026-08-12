import { createEngine } from '../../engines/vitest-index';
import testCreatingEnum from '../../test-suites/create-enum';

declare const VITEST_ENGINE: 'vitest-node' | 'vitest-browser';

testCreatingEnum(createEngine(VITEST_ENGINE));
