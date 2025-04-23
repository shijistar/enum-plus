import { playwright } from '../test/adapter-one';
import testEnumCollection from '../test/test-suites/create-enum';

testEnumCollection(playwright);
