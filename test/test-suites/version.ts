import { version as packageVersion } from '../../package.json';
import type TestEngineBase from '../engines/base';

const testVersion = (engine: TestEngineBase) => {
  engine.describe('Enum version', () => {
    engine.test(
      'Should be equal to package.json version',
      ({ EnumPlus: { version } }) => {
        return { version };
      },
      ({ version }) => {
        engine.expect(version).toBe(packageVersion);
      }
    );
  });
};

export default testVersion;
