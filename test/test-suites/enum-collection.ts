import { defaultLocalize } from '@enum-plus';
import type TestEngineBase from '../engines/base';
import { toPlainEnums } from '../utils';
import { addEnumValuesTestSuite } from './enum-values';

const testEnumCollection = (engine: TestEngineBase) => {
  engine.describe('The EnumCollectionClass api', () => {
    addEnumValuesTestSuite(engine);

    engine.test(
      'enums.keys should return all enum keys',
      ({ EnumPlus: { Enum }, WeekConfig: { StandardWeekConfig } }) => {
        const week = Enum(StandardWeekConfig);
        return { week, StandardWeekConfig };
      },
      ({ week, StandardWeekConfig }) => {
        engine.expect(week.keys).toEqual(Object.keys(StandardWeekConfig));
      }
    );

    engine.test(
      'enums.items should return an array of enum items',
      ({ EnumPlus: { Enum }, WeekConfig: { StandardWeekConfig, locales }, WeekData: { getStandardWeekData } }) => {
        const week = Enum(StandardWeekConfig);
        return { week, getStandardWeekData, locales };
      },
      ({ week, getStandardWeekData, locales }) => {
        engine.expect(Array.isArray(week.items)).toBeTruthy();
        engine.expect(toPlainEnums(week.items)).toEqual(getStandardWeekData(locales));
      }
    );

    engine.test(
      'the methods should be same as EnumValuesArray',
      ({ EnumPlus: { Enum }, WeekConfig: { StandardWeekConfig } }) => {
        const week = Enum(StandardWeekConfig);
        return { week };
      },
      ({ week }) => {
        engine.expect(week.label(1)).toBe(week.items.label(1));
        engine.expect(week.key(1)).toBe(week.items.key(1));
        engine.expect(week.has(1)).toBe(week.items.has(1));
        engine.expect(week.raw()).toBe(week.items.raw());
        engine.expect(week.toSelect()).toEqual(week.items.toSelect());
        engine.expect(week.toMenu()).toEqual(week.items.toMenu());
        engine.expect(week.toFilter()).toEqual(week.items.toFilter());
        engine.expect(week.toValueMap()).toEqual(week.items.toValueMap());
      }
    );

    engine.test(
      'enums.keys and enums.items should be auto renamed to fallback names once they are conflicted with Enum keys',
      ({ EnumPlus: { Enum, KEYS, ITEMS } }) => {
        const strangeEnumConfig = {
          label: { value: 1, label: 'label' },
          key: { value: 2, label: 'key' },
          has: { value: 3, label: 'has' },
          toSelect: { value: 4, label: 'toSelect' },
          toValueMap: { value: 5, label: 'toValueMap' },
          toFilter: { value: 6, label: 'toFilter' },
          toMenu: { value: 7, label: 'toMenu' },
          raw: { value: 99, label: 'raw' },
          keys: { value: 101, label: 'foo' },
        } as const;
        const strangeEnum = Enum(strangeEnumConfig);

        const strangerEnumConfig = {
          ...strangeEnumConfig,
          items: { value: 101, label: 'bar' },
          values: { value: 102, label: 'baz' },
        } as const;
        const strangerEnum = Enum(strangerEnumConfig);
        return {
          strangeEnumConfig,
          strangeEnum,
          strangerEnum,
          strangerEnumConfig,
          keysUnserializable: { KEYS: strangerEnum[KEYS], ITEMS: strangerEnum[ITEMS] },
        };
      },
      ({ strangeEnumConfig, strangeEnum, strangerEnum, strangerEnumConfig, keysUnserializable: { KEYS, ITEMS } }) => {
        engine.expect(strangeEnum.label).toBe(1);
        engine.expect(strangeEnum.items.label(1)).toBe('label');
        engine.expect(strangeEnum.key).toBe(2);
        engine.expect(strangeEnum.items.key(2)).toBe('key');
        engine.expect(strangeEnum.has).toBe(3);
        engine.expect(strangeEnum.items.has(3)).toBe(true);
        engine.expect(strangeEnum.toSelect).toBe(4);
        engine.expect(strangeEnum.items.toSelect()).toHaveLength(Object.keys(strangeEnumConfig).length);
        engine.expect(strangeEnum.toFilter).toBe(6);
        engine.expect(strangeEnum.items.toFilter()).toHaveLength(Object.keys(strangeEnumConfig).length);
        engine.expect(strangeEnum.toMenu).toBe(7);
        engine.expect(strangeEnum.items.toMenu()).toHaveLength(Object.keys(strangeEnumConfig).length);
        engine.expect(strangeEnum.toValueMap).toBe(5);
        engine
          .expect(Object.keys(strangeEnum.items.toValueMap()))
          .toEqual(
            Object.keys(strangeEnumConfig).map((key) =>
              strangeEnumConfig[key as keyof typeof strangeEnumConfig].value.toString()
            )
          );
        engine.expect(strangeEnum.keys).toBe(101);
        engine.expect(strangeEnum.items.map((i) => i.key)).toEqual(Object.keys(strangeEnumConfig));

        engine.expect(strangerEnum.items).toBe(101);
        engine.expect(strangerEnum.values).toBe(102);
        engine.expect(KEYS).toEqual(Object.keys(strangerEnumConfig));
        const standardEnumItems = Object.keys(strangerEnumConfig).map((key) => ({
          key,
          value: strangerEnumConfig[key as keyof typeof strangerEnumConfig].value,
          label: strangerEnumConfig[key as keyof typeof strangerEnumConfig].label,
        }));
        engine.expect(Array.isArray(ITEMS)).toBeTruthy();
        engine.expect(toPlainEnums(ITEMS)).toEqual(standardEnumItems);
      }
    );

    engine.test(
      'enums.toString should show the type of EnumCollection',
      ({ EnumPlus: { Enum }, WeekConfig: { StandardWeekConfig } }) => {
        const week = Enum(StandardWeekConfig);
        return { week };
      },
      ({ week }) => {
        engine.expect(week.toString()).toBe('[object EnumCollection]');
        engine.expect(Object.prototype.toString.call(week)).toBe('[object EnumCollection]');
      }
    );

    engine.test(
      'enums.value/enums.key/enums.label should be applicable to "instanceof" operator',
      ({ EnumPlus: { Enum }, WeekConfig: { StandardWeekConfig, lang, getLocales, genSillyLocalizer } }) => {
        const week = Enum(StandardWeekConfig);
        return { week, lang, getLocales, genSillyLocalizer };
      },
      ({ week, lang, getLocales, genSillyLocalizer }) => {
        const sillyLocalize = genSillyLocalizer(lang, getLocales, defaultLocalize);
        engine.expect((0 as unknown) instanceof (week as unknown as () => void)).toBeTruthy();
        engine.expect(('Sunday' as unknown) instanceof (week as unknown as () => void)).toBeTruthy();
        engine
          .expect((sillyLocalize('weekday.sunday') as unknown) instanceof (week as unknown as () => void))
          .toBeTruthy();
        engine.expect((6 as unknown) instanceof (week as unknown as () => void)).toBeTruthy();
        engine.expect(('Saturday' as unknown) instanceof (week as unknown as () => void)).toBeTruthy();
        engine
          .expect((sillyLocalize('weekday.saturday') as unknown) instanceof (week as unknown as () => void))
          .toBeTruthy();
        engine.expect((7 as unknown) instanceof (week as unknown as () => void)).toBeFalsy();
        engine.expect(('[Not Exists]' as unknown) instanceof (week as unknown as () => void)).toBeFalsy();
      }
    );
  });
};

export default testEnumCollection;
