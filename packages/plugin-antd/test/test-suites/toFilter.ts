import { defaultLocalize } from '@enum-plus';
import { getLocales, localizeConfigData, StandardWeekConfig } from '../../../../test/data/week-config';
import type TestEngineBase from '../../../../test/engines/base';
import '../../src/index';

const testEnumItems = (engine: TestEngineBase) => {
  engine.describe('The toFilter plugin', () => {
    engine.test(
      'should generate an object array for AntDesign Table',
      ({ EnumPlus: { Enum }, WeekConfig: { StandardWeekConfig } }) => {
        const weekEnum = Enum(StandardWeekConfig);
        const filterItems = weekEnum.toFilter();
        return { filterItems };
      },
      ({ filterItems }) => {
        engine.expect(filterItems).toEqual(
          Object.values(localizeConfigData(StandardWeekConfig, getLocales, defaultLocalize)).map(
            ({ value, label }) => ({
              text: label,
              value,
            })
          )
        );
      }
    );
  });
};

export default testEnumItems;
