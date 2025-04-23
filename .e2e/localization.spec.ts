import { playwright } from '../test/engines';
import testLocalization from '../test/test-suites/localization';

testLocalization(playwright);
