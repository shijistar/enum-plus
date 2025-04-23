import { playwright } from '../test/adapter-one';
import testEnumValues from '../test/test-suites/enum-values';

testEnumValues(playwright);
