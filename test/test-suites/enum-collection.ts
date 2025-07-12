import { defaultLocalize, IS_ENUM_COLLECTION as IS_ENUM_COLLECTION_IN_NODE } from '@enum-plus';
import type TestEngineBase from '../engines/base';
import { toPlainEnums } from '../utils/index';
import { addEnumValuesTestSuite } from './enum-items';

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
      'enums.values should return an array of enum values',
      ({ EnumPlus: { Enum }, WeekConfig: { StandardWeekConfig, WeekNumberConfig } }) => {
        const week = Enum(StandardWeekConfig);
        return { week, StandardWeekConfig, WeekNumberConfig };
      },
      ({ week, WeekNumberConfig }) => {
        engine.expect(week.values).toEqual(Object.values(WeekNumberConfig));
      }
    );

    engine.test(
      'enums.labels should return a strings array',
      ({ EnumPlus: { Enum }, WeekConfig: { StandardWeekConfig } }) => {
        const week = Enum(StandardWeekConfig);
        return { week, StandardWeekConfig };
      },
      ({ week, StandardWeekConfig }) => {
        engine.expect(week.labels).toBeInstanceOf(Array);
        engine.expect(week.labels).toHaveLength(Object.keys(StandardWeekConfig).length);
      }
    );

    engine.test(
      'the methods should be same as EnumItemsArray',
      ({ EnumPlus: { Enum }, WeekConfig: { StandardWeekConfig } }) => {
        const week = Enum(StandardWeekConfig);
        return { week };
      },
      ({ week }) => {
        engine.expect(week.label(1)).toBe(week.items.label(1));
        engine.expect(week.key(1)).toBe(week.items.key(1));
        engine.expect(week.has(1)).toBe(week.items.has(1));
        engine.expect(week.raw()).toBe(week.items.raw());
        engine.expect(week.toList()).toEqual(week.items.toList());
        engine.expect(week.toMenu()).toEqual(week.items.toMenu());
        engine.expect(week.toFilter()).toEqual(week.items.toFilter());
        engine.expect(week.toValueMap()).toEqual(week.items.toValueMap());
      }
    );

    engine.test(
      'the system fields should be protected and auto renamed to fallback names in case of conflicting with enum members',
      ({ EnumPlus: { Enum, KEYS, ITEMS, VALUES, LABELS } }) => {
        const strangeEnumConfig = {
          keys: { value: 101, label: 'foo' },
          values: { value: 102, label: 'baz' },
          labels: { value: 103, label: 'bar' },

          raw: { value: 99, label: 'raw' },
          label: { value: 1, label: 'label' },
          key: { value: 2, label: 'key' },
          has: { value: 3, label: 'has' },
          toList: { value: 4, label: 'toList' },
          toValueMap: { value: 5, label: 'toValueMap' },
          toFilter: { value: 6, label: 'toFilter' },
          toMenu: { value: 7, label: 'toMenu' },
        } as const;
        const strangeEnum = Enum(strangeEnumConfig);

        const strangerEnumConfig = {
          ...strangeEnumConfig,
          items: { value: 101, label: 'bar' },
        } as const;
        const strangerEnum = Enum(strangerEnumConfig);
        return {
          strangeEnumConfig,
          strangerEnumConfig,
          strangeEnum,
          strangerEnum,
          KEYS,
          ITEMS,
          VALUES,
          LABELS,
        };
      },
      ({ strangeEnumConfig, strangeEnum, strangerEnumConfig, strangerEnum, KEYS, ITEMS, VALUES, LABELS }) => {
        engine.expect(strangeEnum.keys).toBe(101);
        // @ts-expect-error: because KEYS equals Symbol.for('[keys]')
        engine.expect(strangeEnum[KEYS] as string[]).toEqual(Object.keys(strangeEnumConfig));
        engine.expect(strangeEnum.values).toBe(102);
        // @ts-expect-error: because VALUES equals Symbol.for('[values]')
        engine.expect(strangeEnum[VALUES] as number[]).toEqual(Object.values(strangeEnumConfig).map((i) => i.value));
        engine.expect(strangeEnum.labels).toBe(103);
        // @ts-expect-error: because LABELS equals Symbol.for('[labels]')
        engine.expect(strangeEnum[LABELS] as string[]).toBeInstanceOf(Array);
        // @ts-expect-error: because LABELS equals Symbol.for('[labels]')
        engine.expect(strangeEnum[LABELS] as string[]).toHaveLength(Object.keys(strangeEnumConfig).length);
        engine.expect(Array.from(strangeEnum.items).map((i) => i.key)).toEqual(Object.keys(strangeEnumConfig));

        engine.expect(strangeEnum.raw).toBe(99);
        engine.expect(strangeEnum.label).toBe(1);
        engine.expect(strangeEnum.items.label(1)).toBe('label');
        engine.expect(strangeEnum.key).toBe(2);
        engine.expect(strangeEnum.items.key(2)).toBe('key');
        engine.expect(strangeEnum.has).toBe(3);
        engine.expect(strangeEnum.items.has(3)).toBe(true);
        engine.expect(strangeEnum.toList).toBe(4);
        engine.expect(strangeEnum.items.toList()).toHaveLength(Object.keys(strangeEnumConfig).length);
        engine.expect(strangeEnum.toFilter).toBe(6);
        engine.expect(strangeEnum.items.toFilter()).toHaveLength(Object.keys(strangeEnumConfig).length);
        engine.expect(strangeEnum.toMenu).toBe(7);
        engine.expect(strangeEnum.items.toMenu()).toHaveLength(Object.keys(strangeEnumConfig).length);
        engine.expect(strangeEnum.toValueMap).toBe(5);
        const map: Record<string, { text: string | undefined }> = {};
        Object.entries(strangeEnumConfig).forEach(([key, item]) => {
          map[item.value] = { text: item.label };
        });
        engine.expect(strangeEnum.items.toValueMap()).toEqual(map);

        engine.expect(strangerEnum.items).toBe(101);
        const standardEnumItems = Object.keys(strangerEnumConfig).map((key) => ({
          key,
          value: strangerEnumConfig[key as keyof typeof strangerEnumConfig].value,
          label: strangerEnumConfig[key as keyof typeof strangerEnumConfig].label,
        }));
        // @ts-expect-error: because ITEMS equals Symbol.for('[items]')
        engine.expect(Array.isArray(strangerEnum[ITEMS])).toBeTruthy();
        // @ts-expect-error: because ITEMS equals Symbol.for('[items]')
        engine.expect(toPlainEnums(strangerEnum[ITEMS])).toEqual(standardEnumItems);
        // @ts-expect-error: because LABELS equals Symbol.for('[labels]')
        engine.expect(strangerEnum[LABELS] as string[]).toBeInstanceOf(Array);
        // @ts-expect-error: because LABELS equals Symbol.for('[labels]')
        engine.expect(strangerEnum[LABELS] as string[]).toHaveLength(Object.keys(strangerEnumConfig).length);
      }
    );

    engine.test(
      'should have [ENUM_COLLECTION] property to indicate that this is an enum collection',
      ({ EnumPlus: { Enum, IS_ENUM_COLLECTION }, WeekConfig: { StandardWeekConfig } }) => {
        const week = Enum(StandardWeekConfig);
        return { week, IS_ENUM_COLLECTION };
      },
      ({ week, IS_ENUM_COLLECTION }) => {
        // @ts-expect-error: because IS_ENUM_COLLECTION is hidden by the interface, but it actually exists
        engine.expect(week[IS_ENUM_COLLECTION]).toBe(true);
        engine.expect(week[IS_ENUM_COLLECTION_IN_NODE]).toBe(true);
        // @ts-expect-error: because IS_ENUM_COLLECTION and Symbol.for('[IsEnumCollection]') are equal
        engine.expect(week[Symbol.for('[IsEnumCollection]')]).toBe(true);
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
