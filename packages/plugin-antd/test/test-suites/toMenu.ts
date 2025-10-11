// eslint-disable-next-line import/no-unresolved
import { getLocales, localizeConfigData, StandardWeekConfig } from '@enum-plus/test/data/week-config';
import type TestEngineBase from '@enum-plus/test/engines/base';
import { defaultLocalize } from 'enum-plus';
import toMenuPlugin from '../../src/toMenu';

const testEnumItems = (engine: TestEngineBase<'jest'>) => {
  engine.describe('The toMenu plugin', () => {
    engine.test(
      'should generate an object array for AntDesign Menu',
      ({ EnumPlus: { Enum }, WeekConfig: { StandardWeekConfig } }) => {
        Enum.install(toMenuPlugin);
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
