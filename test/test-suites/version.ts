import { version as packageVersion } from '../../package.json';
import type TestEngineBase from '../engines/base';
import type { TestEngineTypes } from '../types';

const testVersion = (engine: TestEngineBase<TestEngineTypes>) => {
  engine.describe('Enum version', () => {
    engine.test(
      'should match the package.json version',
      ({ EnumPlus: { version } }) => {
        return { version };
      },
      ({ version }) => {
        engine.expect(version).toBe(packageVersion);
      },
    );
  });
};

export default testVersion;
