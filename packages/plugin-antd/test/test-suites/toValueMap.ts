import { defaultLocalize } from '@enum-plus';
import { getLocales, localizeConfigData, StandardWeekConfig } from '../../../../test/data/week-config';
import type TestEngineBase from '../../../../test/engines/base';
import '../../src/index';

const testEnumItems = (engine: TestEngineBase) => {
  engine.describe('The toValueMap plugin', () => {
    engine.test(
      'should generate an object array for AntDesignPro',
      ({ EnumPlus: { Enum }, WeekConfig: { StandardWeekConfig } }) => {
        const weekEnum = Enum(StandardWeekConfig);
        const valueMap = weekEnum.toValueMap();
        return { valueMap };
      },
      ({ valueMap }) => {
        engine.expect(valueMap).toEqual(
          Object.values(localizeConfigData(StandardWeekConfig, getLocales, defaultLocalize)).reduce(
            (acc, { value, label }) => {
              acc[value] = { text: label };
              return acc;
            },
            {} as Record<number, { text: string }>
          )
        );
      }
    );
  });
};

export default testEnumItems;
