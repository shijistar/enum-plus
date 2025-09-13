// eslint-disable-next-line import/no-unresolved
import { getLocales, localizeConfigData, StandardWeekConfig } from '@enum-plus/test/data/week-config';
import type TestEngineBase from '@enum-plus/test/engines/base';
import { defaultLocalize } from 'enum-plus';
import toFilterPlugin from '../../src/toFilter';

const testEnumItems = (engine: TestEngineBase) => {
  engine.describe('The toFilter plugin', () => {
    engine.test(
      'should generate an object array for AntDesign Table',
      ({ EnumPlus: { Enum }, WeekConfig: { StandardWeekConfig } }) => {
        Enum.install(toFilterPlugin);
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
