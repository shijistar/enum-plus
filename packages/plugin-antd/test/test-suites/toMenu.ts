import { defaultLocalize } from '@enum-plus';
import { getLocales, localizeConfigData, StandardWeekConfig } from '../../../../test/data/week-config';
import type TestEngineBase from '../../../../test/engines/base';
import '../../src/index';

const testEnumItems = (engine: TestEngineBase) => {
  engine.describe('The toMenu plugin', () => {
    engine.test(
      'should generate an object array for AntDesign Menu',
      ({ EnumPlus: { Enum }, WeekConfig: { StandardWeekConfig } }) => {
        const weekEnum = Enum(StandardWeekConfig);
        const menuItems = weekEnum.toMenu();
        return { menuItems };
      },
      ({ menuItems }) => {
        engine.expect(menuItems).toEqual(
          Object.values(localizeConfigData(StandardWeekConfig, getLocales, defaultLocalize)).map(
            ({ value, label }) => ({
              key: value,
              label: label,
            })
          )
        );
      }
    );
  });
};

export default testEnumItems;
