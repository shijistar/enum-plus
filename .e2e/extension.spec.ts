import { playwright } from '../test/engines';
import testExtension from '../test/test-suites/extension';

testExtension(playwright);
