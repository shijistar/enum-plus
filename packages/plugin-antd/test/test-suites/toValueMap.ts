// eslint-disable-next-line import/no-unresolved
import { getLocales, localizeConfigData, StandardWeekConfig } from '@enum-plus/test/data/week-config';
import type TestEngineBase from '@enum-plus/test/engines/base';
import { defaultLocalize } from 'enum-plus';
import toValueMapPlugin from '../../src/toValueMap';

const testEnumItems = (engine: TestEngineBase<'jest'>) => {
  engine.describe('The toValueMap plugin', () => {
    engine.test(
      'should generate an object array for AntDesignPro',
      ({ EnumPlus: { Enum }, WeekConfig: { StandardWeekConfig } }) => {
        Enum.install(toValueMapPlugin);
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
