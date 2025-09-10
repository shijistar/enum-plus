import {
  ENUM_OPTIONS as NODE_ENUM_OPTIONS,
  IS_ENUM as NODE_IS_ENUM,
  ITEMS as NODE_ITEMS,
  KEYS as NODE_KEYS,
  LABELS as NODE_LABELS,
  META as NODE_META,
  NAMED as NODE_NAMED,
  VALUES as NODE_VALUES,
} from '@enum-plus';
import type TestEngineBase from '../engines/base';
import { toPlainEnums } from '../utils/index';
import { addEnumItemsTestSuite } from './enum-items';

const testEnumCollection = (engine: TestEngineBase) => {
  engine.describe('The EnumCollectionClass api', () => {
    addEnumItemsTestSuite(engine);

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
      'the methods should be same as EnumItemsArray',
      ({ EnumPlus: { Enum, KEYS, VALUES }, WeekConfig: { StandardWeekConfig } }) => {
        const week = Enum(StandardWeekConfig);
        const defaultListItems = week.toList();
        const customListItems = week.toList({ valueField: 'id', labelField: 'name' });
        const defaultMapItems = week.toMap();
        const customMapItems = week.toMap({ keySelector: 'key', valueSelector: 'value' });
        return { week, KEYS, VALUES, defaultListItems, customListItems, defaultMapItems, customMapItems };
      },
      ({ week, KEYS, VALUES, defaultListItems, customListItems, defaultMapItems, customMapItems }) => {
        engine.expect(week.keys).toBe(week.items[KEYS as typeof NODE_KEYS]);
        engine.expect(week.values).toBe(week.items[VALUES as typeof NODE_VALUES]);
        engine.expect(week.labels).toEqual(week.items.labels);
        engine.expect(week.named).toBe(week.items.named);
        engine.expect(week.meta).toBe(week.items.meta);
        engine.expect(week.label(1)).toBe(week.items.label(1));
        engine.expect(week.key(1)).toBe(week.items.key(1));
        engine.expect(week.has(1)).toBe(week.items.has(1));
        engine.expect(week.findBy('key', 'Monday')).toBe(week.items.findBy('key', 'Monday'));
        engine.expect(week.findBy('value', 1)).toBe(week.items.findBy('value', 1));
        engine.expect(week.findBy('label', 'weekday.monday')).toBe(week.items.findBy('label', 'weekday.monday'));
        engine.expect(week.findBy('status', 'success')).toBe(week.items.findBy('status', 'success'));
        engine.expect(week.raw()).toBe(week.items.raw());
        engine.expect(defaultListItems).toEqual(week.items.toList());
        engine.expect(customListItems).toEqual(week.items.toList({ valueField: 'id', labelField: 'name' }));
        engine.expect(defaultMapItems).toEqual(week.items.toMap());
        engine.expect(customMapItems).toEqual(week.items.toMap({ keySelector: 'key', valueSelector: 'value' }));
      }
    );

    engine.test(
      'utils.Symbols should be equal to node Symbols',
      ({ EnumPlus: { KEYS, ITEMS, VALUES, LABELS, NAMED, META, ENUM_OPTIONS } }) => {
        return { KEYS, ITEMS, VALUES, LABELS, NAMED, META, ENUM_OPTIONS };
      },
      ({ KEYS, ITEMS, VALUES, LABELS, NAMED, META, ENUM_OPTIONS }) => {
        engine.expect(KEYS).toBe(NODE_KEYS);
        engine.expect(ITEMS).toBe(NODE_ITEMS);
        engine.expect(VALUES).toBe(NODE_VALUES);
        engine.expect(LABELS).toBe(NODE_LABELS);
        engine.expect(NAMED).toBe(NODE_NAMED);
        engine.expect(META).toBe(NODE_META);
        engine.expect(ENUM_OPTIONS).toBe(NODE_ENUM_OPTIONS);
      }
    );

    engine.test(
      'should be able to get the initialization options by ENUM_OPTIONS symbol',
      ({ EnumPlus: { Enum, ENUM_OPTIONS }, WeekConfig: { StandardWeekConfig } }) => {
        const weekEnum = Enum(StandardWeekConfig, { name: 'weekDay.name' });
        return { weekEnum, ENUM_OPTIONS };
      },
      ({ weekEnum, ENUM_OPTIONS }) => {
        engine.expect(weekEnum[ENUM_OPTIONS as typeof NODE_ENUM_OPTIONS]).toEqual({
          name: 'weekDay.name',
        });
      }
    );
    engine.test(
      'the system fields should be protected and auto renamed to fallback names in case of conflicting with enum members',
      ({ EnumPlus: { Enum, KEYS, VALUES, LABELS, ITEMS, NAMED, META } }) => {
        const strangeEnumConfig = {
          keys: { value: 101, label: 'foo', type: 1101 },
          values: { value: 102, label: 'baz', type: 1102 },
          labels: { value: 103, label: 'bar', type: 1103 },
          named: { value: 104, label: 'named', type: 1104 },
          meta: { value: 105, label: 'meta', type: 1105 },

          raw: { value: 99, label: 'raw', type: 1099 },
          label: { value: 1, label: 'label', type: 1001 },
          key: { value: 2, label: 'key', type: 1002 },
          has: { value: 3, label: 'has', type: 1003 },
          toList: { value: 4, label: 'toList', type: 1004 },
          toMap: { value: 5, label: 'toMap', type: 1005 },
        } as const;
        const strangeEnum = Enum(strangeEnumConfig);

        const strangerEnumConfig = {
          ...strangeEnumConfig,
          items: { value: 100, label: 'bar' },
        } as const;
        const strangerEnum = Enum(strangerEnumConfig);
        return {
          strangeEnumConfig,
          strangerEnumConfig,
          strangeEnum,
          strangerEnum,
          KEYS,
          VALUES,
          LABELS,
          ITEMS,
          NAMED,
          META,
        };
      },
      ({
        strangeEnumConfig,
        strangeEnum,
        strangerEnumConfig,
        strangerEnum,
        KEYS,
        VALUES,
        LABELS,
        ITEMS,
        NAMED,
        META,
      }) => {
        engine.expect(strangeEnum.keys).toBe(101);
        engine.expect(strangeEnum[KEYS as typeof NODE_KEYS] as string[]).toEqual(Object.keys(strangeEnumConfig));
        engine.expect(strangeEnum.values).toBe(102);
        engine
          .expect(strangeEnum[VALUES as typeof NODE_VALUES] as number[])
          .toEqual(Object.values(strangeEnumConfig).map((i) => i.value));
        engine.expect(strangeEnum.labels).toBe(103);
        engine.expect(strangeEnum[LABELS as typeof NODE_LABELS] as string[]).toBeInstanceOf(Array);
        engine
          .expect(strangeEnum[LABELS as typeof NODE_LABELS] as string[])
          .toEqual(
            Object.keys(strangeEnumConfig).map((key) => strangeEnumConfig[key as keyof typeof strangeEnumConfig].label)
          );
        engine.expect(strangeEnum.named).toBe(104);
        strangeEnum.items.forEach((item) => {
          engine.expect(strangeEnum[NAMED as typeof NODE_NAMED][item.key]).toBe(item);
        });
        engine.expect(Object.keys(strangeEnum[NAMED as typeof NODE_NAMED])).toEqual(Object.keys(strangeEnumConfig));
        engine.expect(strangeEnum.meta).toBe(105);
        engine.expect(strangeEnum[META as typeof NODE_META].type).toBeInstanceOf(Array);
        engine
          .expect(strangeEnum[META as typeof NODE_META].type)
          .toEqual(
            Object.keys(strangeEnumConfig).map((key) => strangeEnumConfig[key as keyof typeof strangeEnumConfig].type)
          );
        engine.expect(Array.from(strangeEnum.items.map((i) => i.key))).toEqual(Object.keys(strangeEnumConfig));

        engine.expect(strangeEnum.raw).toBe(99);
        engine.expect(strangeEnum.label).toBe(1);
        engine.expect(strangeEnum.items.label(1)).toBe('label');
        engine.expect(strangeEnum.key).toBe(2);
        engine.expect(strangeEnum.items.key(2)).toBe('key');
        engine.expect(strangeEnum.has).toBe(3);
        engine.expect(strangeEnum.items.has(3)).toBe(true);
        engine.expect(strangeEnum.toList).toBe(4);
        engine
          .expect(
            strangeEnum.items.toList().map((i) => ({
              value: i.value,
              label: i.label,
            }))
          )
          .toEqual(
            Object.values(strangeEnumConfig).map((i) => ({
              value: i.value,
              label: i.label,
            }))
          );
        engine.expect(strangeEnum.toMap).toBe(5);
        const map: Record<string, string> = {};
        Object.entries(strangeEnumConfig).forEach(([, item]) => {
          map[item.value] = item.label;
        });
        engine.expect(strangeEnum.items.toMap()).toEqual(map);
        const valueMap: Record<string, { text: string | undefined }> = {};
        Object.entries(strangeEnumConfig).forEach(([, item]) => {
          valueMap[item.value] = { text: item.label };
        });

        engine.expect(strangerEnum.items).toBe(100);
        const standardEnumItems = Object.keys(strangerEnumConfig).map((key) => ({
          key,
          value: strangerEnumConfig[key as keyof typeof strangerEnumConfig].value,
          label: strangerEnumConfig[key as keyof typeof strangerEnumConfig].label,
        }));
        engine.expect(Array.isArray(strangerEnum[ITEMS as typeof NODE_ITEMS])).toBeTruthy();
        engine.expect(toPlainEnums(strangerEnum[ITEMS as typeof NODE_ITEMS])).toEqual(standardEnumItems);
        engine.expect(strangerEnum[LABELS as typeof NODE_LABELS]).toBeInstanceOf(Array);
        engine
          .expect(strangerEnum[LABELS as typeof NODE_LABELS])
          .toEqual(Object.values(strangerEnumConfig).map((i) => i.label));
      }
    );

    engine.test(
      'should have [ENUM_COLLECTION] property to indicate that this is an enum collection',
      ({ EnumPlus: { Enum, IS_ENUM }, WeekConfig: { StandardWeekConfig } }) => {
        const week = Enum(StandardWeekConfig);
        return { week, IS_ENUM };
      },
      ({ week, IS_ENUM }) => {
        // @ts-expect-error: because IS_ENUM is hidden by the interface, but it actually exists
        engine.expect(week[IS_ENUM as typeof NODE_IS_ENUM]).toBe(true);
        engine.expect(NODE_IS_ENUM in week && week[NODE_IS_ENUM]).toBe(true);
        // @ts-expect-error: because IS_ENUM and Symbol.for('[IsEnum]') are equal
        engine.expect(week[Symbol.for('[IsEnum]')]).toBe(true);
      }
    );

    engine.test(
      'Enum should be applicable to "instanceof" operator',
      ({ EnumPlus: { Enum }, WeekConfig: { StandardWeekConfig } }) => {
        const week = Enum(StandardWeekConfig);
        return { week };
      },
      ({ week }) => {
        // console.log(week.__items__);
        engine.expect((0 as unknown) instanceof week).toBeTruthy();
        engine.expect(('Sunday' as unknown) instanceof week).toBeTruthy();
        engine.expect((6 as unknown) instanceof week).toBeTruthy();
        engine.expect(('Saturday' as unknown) instanceof week).toBeTruthy();
        engine.expect((7 as unknown) instanceof week).toBeFalsy();
        engine.expect(('[Not Exists]' as unknown) instanceof week).toBeFalsy();
      }
    );

    engine.test(
      'enums.valueType should throw error when called at runtime',
      ({ EnumPlus: { Enum }, WeekConfig: { StandardWeekConfig } }) => {
        const weekEnum = Enum(StandardWeekConfig);
        let error: Error | undefined;
        try {
          weekEnum.valueType;
        } catch (e) {
          error = e as Error;
        }
        return { weekEnum, error };
      },
      ({ error }) => {
        engine.expect(error).toBeDefined();
      }
    );

    engine.test(
      'enums.keyType should throw error when called at runtime',
      ({ EnumPlus: { Enum }, WeekConfig: { StandardWeekConfig } }) => {
        const weekEnum = Enum(StandardWeekConfig);
        let error: Error | undefined;
        try {
          weekEnum.keyType;
        } catch (e) {
          error = e as Error;
        }
        return { weekEnum, error };
      },
      ({ error }) => {
        engine.expect(error).toBeDefined();
      }
    );

    engine.test(
      'enums.rawType should throw error when called at runtime',
      ({ EnumPlus: { Enum }, WeekConfig: { StandardWeekConfig } }) => {
        const weekEnum = Enum(StandardWeekConfig);
        let error: Error | undefined;
        try {
          weekEnum.rawType;
        } catch (e) {
          error = e as Error;
        }
        return { weekEnum, error };
      },
      ({ error }) => {
        engine.expect(error).toBeDefined();
      }
    );
  });
};

export default testEnumCollection;
