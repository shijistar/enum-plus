// eslint-disable-next-line import/no-unresolved
import type TestEngineBase from '@enum-plus/test/engines/base';
// eslint-disable-next-line import/no-unresolved
// import filterItemPlugin from '../../src/filterItem';
import samplePlugin from '../../src/index';

const testEnumItems = (engine: TestEngineBase<'jest'>) => {
  engine.describe('sample plugin', () => {
    engine.test(
      'should add the sample method to Enum instances',
      ({ EnumPlus: { Enum }, WeekConfig: { StandardWeekConfig } }) => {
        Enum.install(samplePlugin);
        const weekEnum = Enum(StandardWeekConfig);
        let hasError = false;
        try {
          weekEnum.sample();
        } catch (error) {
          hasError = true;
        }

        return { hasError };
      },
      ({ hasError }) => {
        engine.expect(hasError).toBe(false);
      },
    );
  });
};

export default testEnumItems;
