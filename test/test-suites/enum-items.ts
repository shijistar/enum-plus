import { defaultLocalize, IS_ENUM_ITEMS as ENUM_ITEMS_IN_NODE, KEYS, VALUES } from '@enum-plus';
import { getLocales, localizeConfigData } from '../data/week-config';
import { getStandardWeekData } from '../data/week-data';
import type TestEngineBase from '../engines/base';
import { pickArray } from '../utils/index';

const testEnumItems = (engine: TestEngineBase<'jest' | 'playwright'>) => {
  engine.describe('The EnumItemsArray api', () => {
    addEnumItemsTestSuite(engine);
  });
};

export function addEnumItemsTestSuite(engine: TestEngineBase<'jest' | 'playwright'>) {
  engine.test(
    'should have [IS_ENUM_ITEMS] property to indicate that this is an enum items array',
    ({ EnumPlus: { Enum, IS_ENUM_ITEMS }, WeekConfig: { StandardWeekConfig } }) => {
      const weekEnum = Enum(StandardWeekConfig);
      return { weekEnum, IS_ENUM_ITEMS };
    },
    ({ weekEnum, IS_ENUM_ITEMS }) => {
      // @ts-expect-error: because IS_ENUM_ITEMS is hidden by the interface, but it actually exists
      engine.expect(weekEnum.items[IS_ENUM_ITEMS]).toBe(true);
      engine.expect(weekEnum.items[ENUM_ITEMS_IN_NODE]).toBe(true);
      // @ts-expect-error: because IS_ENUM_ITEMS and Symbol.for('[IsEnumItems]') are equal
      engine.expect(weekEnum.items[Symbol.for('[IsEnumItems]')]).toBe(true);
    }
  );

  engine.test(
    'enum.items should be applicable to "instanceof" operator',
    ({ EnumPlus: { Enum }, WeekConfig: { StandardWeekConfig } }) => {
      const week = Enum(StandardWeekConfig);
      return { week };
    },
    ({ week }) => {
      engine.expect((0 as unknown) instanceof week.items).toBeTruthy();
      engine.expect(('Sunday' as unknown) instanceof week.items).toBeTruthy();
      engine.expect((6 as unknown) instanceof week.items).toBeTruthy();
      engine.expect(('Saturday' as unknown) instanceof week.items).toBeTruthy();
      engine.expect((7 as unknown) instanceof week.items).toBeFalsy();
      engine.expect(('[Not Exists]' as unknown) instanceof week.items).toBeFalsy();
    }
  );

  engine.test(
    'enum.items[KEYS] should return all enum keys',
    ({ EnumPlus: { Enum }, WeekConfig: { StandardWeekConfig } }) => {
      const week = Enum(StandardWeekConfig);
      return { week, StandardWeekConfig };
    },
    ({ week, StandardWeekConfig }) => {
      engine.expect(week.items[KEYS]).toEqual(Object.keys(StandardWeekConfig));
    }
  );
  engine.test(
    'enum.items[VALUES] should return an array of enum values',
    ({ EnumPlus: { Enum }, WeekConfig: { StandardWeekConfig, WeekNumberConfig } }) => {
      const week = Enum(StandardWeekConfig);
      return { week, StandardWeekConfig, WeekNumberConfig };
    },
    ({ week, WeekNumberConfig }) => {
      engine.expect(week.items[VALUES]).toEqual(Object.values(WeekNumberConfig));
    }
  );

  engine.test(
    'enum.items.labels should return a strings array',
    ({ EnumPlus: { Enum }, WeekConfig: { StandardWeekConfig } }) => {
      const week = Enum(StandardWeekConfig);
      return { week, StandardWeekConfig };
    },
    ({ week, StandardWeekConfig }) => {
      engine.expect(week.items.labels).toBeInstanceOf(Array);
      engine.expect(week.items.labels).toHaveLength(Object.keys(StandardWeekConfig).length);
    }
  );

  engine.test(
    'enum.items.named should return a mapping object of enum items by keys',
    ({ EnumPlus: { Enum }, WeekConfig: { StandardWeekConfig } }) => {
      const week = Enum(StandardWeekConfig);
      const conflictNameEnum = Enum({
        ...StandardWeekConfig,
        named: { value: 9, label: 'named' },
      });
      return { week, StandardWeekConfig, conflictNameEnum };
    },
    ({ week, StandardWeekConfig, conflictNameEnum }) => {
      week.items.forEach((item) => {
        engine.expect(week.items.named[item.key]).toBe(item);
      });
      engine.expect(Object.keys(week.items.named)).toEqual(Object.keys(StandardWeekConfig));
      engine.expect(conflictNameEnum.named).toBe(9);
      engine
        .expect(conflictNameEnum.items.named.named)
        .toBe(conflictNameEnum.items.find((item) => item.key === 'named'));
    }
  );

  engine.test(
    'enum.items.meta should return a values of custom meta fields',
    ({ EnumPlus: { Enum }, WeekConfig: { StandardWeekConfig } }) => {
      const week = Enum(StandardWeekConfig);
      const nullMetaEnum = Enum({
        foo: { value: 1, label: 'foo', status: 'error', type: 1 },
        bar: { value: 2, label: 'bar', status: null },
        baz: { value: 3, label: 'baz', status: undefined },
        qux: { value: 4, label: 'qux', status: 'warning' },
      });
      return { week, nullMetaEnum, StandardWeekConfig };
    },
    ({ week, nullMetaEnum, StandardWeekConfig }) => {
      engine
        .expect(week.items.meta.status)
        .toEqual(
          Object.keys(StandardWeekConfig).map(
            (key) => StandardWeekConfig[key as keyof typeof StandardWeekConfig].status
          )
        );
      engine
        .expect(nullMetaEnum.items.meta.status)
        .toEqual(Array.from(nullMetaEnum.items.map((item) => item.raw.status).filter(Boolean)));
      engine
        // @ts-expect-error: because some items have no type field
        .expect(nullMetaEnum.items.meta.type)
        .toEqual(
          Array.from(
            nullMetaEnum.items
              // @ts-expect-error: because some items have no type field
              .map((item) => item.raw.type)
              .filter(Boolean)
          )
        );
    }
  );

  engine.test(
    'enum.items.label should be able to get enum label by key or value',
    ({ EnumPlus: { Enum }, WeekConfig: { StandardWeekConfig, locales } }) => {
      const weekEnum = Enum(StandardWeekConfig);
      return { weekEnum, locales };
    },
    ({ weekEnum, locales }) => {
      engine.expect(weekEnum.items.label(0)).toBe(locales.Sunday);
      engine.expect(weekEnum.items.label('Sunday')).toBe(locales.Sunday);
      engine.expect(weekEnum.items.label(6)).toBe(locales.Saturday);
      engine.expect(weekEnum.items.label('Saturday')).toBe(locales.Saturday);
      engine.expect(weekEnum.items.label(7 as typeof weekEnum.valueType)).toBeUndefined();
    }
  );

  engine.test(
    'enum.items.key should be able to get enum key by value',
    ({ EnumPlus: { Enum }, WeekConfig: { StandardWeekConfig } }) => {
      const weekEnum = Enum(StandardWeekConfig);
      return { weekEnum };
    },
    ({ weekEnum }) => {
      engine.expect(weekEnum.items.key(0)).toBe('Sunday');
      engine.expect(weekEnum.items.key(6)).toBe('Saturday');
      engine.expect(weekEnum.items.key(7 as typeof weekEnum.valueType)).toBeUndefined();
    }
  );

  engine.test(
    'enum.items.has should be able to check enum item exist or not',
    ({ EnumPlus: { Enum }, WeekConfig: { StandardWeekConfig } }) => {
      const weekEnum = Enum(StandardWeekConfig);
      return { weekEnum };
    },
    ({ weekEnum }) => {
      engine.expect(weekEnum.items.has(0)).toBe(true);
      engine.expect(weekEnum.items.has('Sunday')).toBe(true);
      engine.expect(weekEnum.items.has(6)).toBe(true);
      engine.expect(weekEnum.items.has('Saturday')).toBe(true);
      engine.expect(weekEnum.items.has(7 as typeof weekEnum.valueType)).toBe(false);
    }
  );

  engine.test(
    'enum.items.find should be able to find enum item by key, value or custom meta fields',
    ({ EnumPlus: { Enum }, WeekConfig: { StandardWeekConfig, WeekCompactConfig } }) => {
      const weekEnum = Enum(StandardWeekConfig);
      const compactWeekEnum = Enum(WeekCompactConfig);
      return { weekEnum, compactWeekEnum };
    },
    ({ weekEnum, compactWeekEnum }) => {
      engine.expect(weekEnum.items.findBy('key', 'Monday')).toBe(weekEnum.items[1]);
      engine.expect(weekEnum.items.findBy('key', 'Saturday')).toBe(weekEnum.items[6]);
      engine.expect(weekEnum.items.findBy('key', 'Invalid Key')).toBe(undefined);
      engine.expect(weekEnum.items.findBy('value', 1)).toBe(weekEnum.items[1]);
      engine.expect(weekEnum.items.findBy('value', 6)).toBe(weekEnum.items[6]);
      engine.expect(weekEnum.items.findBy('value', 99)).toBe(undefined);
      engine.expect(weekEnum.items.findBy('label', 'weekday.monday')).toBe(weekEnum.items[1]);
      engine.expect(weekEnum.items.findBy('label', 'weekday.saturday')).toBe(weekEnum.items[6]);
      engine.expect(weekEnum.items.findBy('label', 'Invalid Label')).toBe(undefined);
      engine.expect(compactWeekEnum.items.findBy('key', 'Monday')).toBe(compactWeekEnum.items[1]);
      engine.expect(compactWeekEnum.items.findBy('key', 'Invalid Key')).toBe(undefined);
      engine.expect(compactWeekEnum.items.findBy('value', 1)).toBe(undefined);
      engine.expect(compactWeekEnum.items.findBy('value', 99)).toBe(undefined);
      engine.expect(compactWeekEnum.items.findBy('label', 'weekday.monday')).toBe(undefined);

      // Custom meta field
      engine.expect(weekEnum.items.findBy('status', 'error')).toEqual(weekEnum.items[0]);
      engine.expect(weekEnum.items.findBy('status', 'warning')).toEqual(weekEnum.items[1]);
      engine.expect(weekEnum.items.findBy('status', 'success')).toEqual(weekEnum.items[3]);
      engine.expect(weekEnum.items.findBy('status', 'invalid')).toEqual(undefined);
      engine.expect(compactWeekEnum.items.findBy('status' as 'key', 'success')).toEqual(undefined);
    }
  );

  engine.test(
    'enum.items.toList should generate the default objects array with value and label',
    ({ EnumPlus: { Enum }, WeekConfig: { StandardWeekConfig, locales } }) => {
      const weekEnum = Enum(StandardWeekConfig);
      const defaultListItems = weekEnum.items.toList();
      const defaultListItems2 = weekEnum.items.toList({});
      const defaultListItems3 = weekEnum.items.toList({
        valueField: 'value',
      });
      const defaultListItems4 = weekEnum.items.toList({
        labelField: 'label',
      });
      return {
        locales,
        defaultListItems,
        defaultListItems2,
        defaultListItems3,
        defaultListItems4,
      };
    },
    ({ locales, defaultListItems, defaultListItems2, defaultListItems3, defaultListItems4 }) => {
      const defaultData = pickArray(getStandardWeekData(locales), ['value', 'label']);
      engine.expect(defaultListItems).toEqual(defaultData);
      engine.expect(defaultListItems2).toEqual(defaultData);
      engine.expect(defaultListItems3).toEqual(defaultData);
      engine.expect(defaultListItems4).toEqual(defaultData);
    }
  );

  engine.test(
    'enum.items.toList should generate an object array with custom field names',
    ({ EnumPlus: { Enum }, WeekConfig: { StandardWeekConfig, locales } }) => {
      const weekEnum = Enum(StandardWeekConfig);
      const idNameListItems = weekEnum.items.toList({
        valueField: 'id',
        labelField: 'name',
      });
      const valueNameListItems = weekEnum.items.toList({
        labelField: 'name',
      });
      const idLabelListItems = weekEnum.items.toList({
        valueField: 'id',
      });
      const idNameStatusListItems = weekEnum.items.toList({
        valueField: 'id',
        labelField: 'name',
        extra: (item) => ({ status: item.raw.status }),
      });
      return {
        locales,
        StandardWeekConfig,
        idNameListItems,
        valueNameListItems,
        idLabelListItems,
        idNameStatusListItems,
      };
    },
    ({ locales, StandardWeekConfig, idNameListItems, valueNameListItems, idLabelListItems, idNameStatusListItems }) => {
      engine.expect(idNameListItems).toEqual(
        getStandardWeekData(locales).map((item) => ({
          id: item.value,
          name: item.label,
        }))
      );
      engine.expect(valueNameListItems).toEqual(
        getStandardWeekData(locales).map((item) => ({
          value: item.value,
          name: item.label,
        }))
      );
      engine.expect(idLabelListItems).toEqual(
        getStandardWeekData(locales).map((item) => ({
          id: item.value,
          label: item.label,
        }))
      );
      engine.expect(idNameStatusListItems).toEqual(
        getStandardWeekData(locales).map((item) => ({
          id: item.value,
          name: item.label,
          status: StandardWeekConfig[item.key as keyof typeof StandardWeekConfig].status,
        }))
      );
    }
  );

  engine.test(
    'enum.items.toList should generate an object array with custom field names in function style',
    ({ EnumPlus: { Enum }, WeekConfig: { StandardWeekConfig, locales } }) => {
      const weekEnum = Enum(StandardWeekConfig);
      const staticFieldListItems = weekEnum.items.toList({
        valueField: () => 'id' as const,
        labelField: () => 'name' as const,
      });
      const staticFieldStatusListItems = weekEnum.items.toList({
        valueField: () => 'id' as const,
        labelField: () => 'name' as const,
        extra: (item) => ({ status: item.raw.status }),
      });
      const dynamicFieldListItems = weekEnum.items.toList({
        valueField: (item) => `id-${item.value}`,
        labelField: (item) => `name-${item.value}`,
      });
      const dynamicFieldStatusListItems = weekEnum.items.toList({
        valueField: (item) => `id-${item.value}`,
        labelField: (item) => `name-${item.value}`,
        extra: (item) => ({ status: item.raw.status }),
      });
      return {
        locales,
        StandardWeekConfig,
        staticFieldListItems,
        staticFieldStatusListItems,
        dynamicFieldListItems,
        dynamicFieldStatusListItems,
      };
    },
    ({
      locales,
      StandardWeekConfig,
      staticFieldListItems,
      dynamicFieldListItems,
      staticFieldStatusListItems,
      dynamicFieldStatusListItems,
    }) => {
      engine.expect(Array.from(staticFieldListItems)).toEqual(
        getStandardWeekData(locales).map((item) => ({
          id: item.value,
          name: item.label,
        }))
      );
      engine.expect(Array.from(staticFieldStatusListItems)).toEqual(
        getStandardWeekData(locales).map((item) => ({
          id: item.value,
          name: item.label,
          status: StandardWeekConfig[item.key as keyof typeof StandardWeekConfig].status,
        }))
      );
      engine.expect(Array.from(dynamicFieldListItems)).toEqual(
        getStandardWeekData(locales).map((item) => ({
          ['id-' + item.value]: item.value,
          ['name-' + item.value]: item.label,
        }))
      );
      engine.expect(Array.from(dynamicFieldStatusListItems)).toEqual(
        getStandardWeekData(locales).map((item) => ({
          ['id-' + item.value]: item.value,
          ['name-' + item.value]: item.label,
          status: StandardWeekConfig[item.key as keyof typeof StandardWeekConfig].status,
        }))
      );
    }
  );

  engine.test(
    'enum.items.toMap should generate a default mapping object with value and label',
    ({ EnumPlus: { Enum }, WeekConfig: { StandardWeekConfig } }) => {
      const weekEnum = Enum(StandardWeekConfig);
      return { weekEnum, StandardWeekConfig };
    },
    ({ weekEnum, StandardWeekConfig }) => {
      const defaultMapData = Object.values(localizeConfigData(StandardWeekConfig, getLocales, defaultLocalize)).reduce(
        (acc, { value, label }) => {
          acc[value] = label;
          return acc;
        },
        {} as Record<number, string>
      );
      engine.expect(weekEnum.items.toMap({ keySelector: 'value' })).toEqual(defaultMapData);
      engine.expect(weekEnum.items.toMap({ valueSelector: 'label' })).toEqual(defaultMapData);
    }
  );

  engine.test(
    'enum.items.toMap should generate a mapping object with custom field of keys and values',
    ({ EnumPlus: { Enum }, WeekConfig: { StandardWeekConfig } }) => {
      const weekEnum = Enum(StandardWeekConfig);
      return { weekEnum, StandardWeekConfig };
    },
    ({ weekEnum, StandardWeekConfig }) => {
      engine
        .expect(
          weekEnum.items.toMap({
            keySelector: 'key',
            valueSelector: 'value',
          })
        )
        .toEqual(
          Object.keys(StandardWeekConfig).reduce(
            (acc, key) => {
              acc[key] = StandardWeekConfig[key as keyof typeof StandardWeekConfig].value;
              return acc;
            },
            {} as Record<string, number>
          )
        );
    }
  );

  engine.test(
    'enum.items.toMap should generate a mapping object with custom functions',
    ({ EnumPlus: { Enum }, WeekConfig: { StandardWeekConfig } }) => {
      const weekEnum = Enum(StandardWeekConfig);
      return { weekEnum, StandardWeekConfig };
    },
    ({ weekEnum, StandardWeekConfig }) => {
      engine
        .expect(
          weekEnum.items.toMap({
            keySelector: 'key',
            valueSelector: (item) => ({ value: item.value }),
          })
        )
        .toEqual(
          Object.keys(StandardWeekConfig).reduce(
            (acc, key) => {
              acc[key] = { value: StandardWeekConfig[key as keyof typeof StandardWeekConfig].value };
              return acc;
            },
            {} as Record<string, { value: number }>
          )
        );
      engine
        .expect(
          weekEnum.items.toMap({
            keySelector: (item) => item.value,
            valueSelector: 'key',
          })
        )
        .toEqual(
          Object.keys(StandardWeekConfig).reduce(
            (acc, key) => {
              const item = StandardWeekConfig[key as keyof typeof StandardWeekConfig];
              acc[item.value] = key;
              return acc;
            },
            {} as Record<string, string>
          )
        );
      engine
        .expect(
          weekEnum.items.toMap({
            keySelector: (item) => item.key,
            valueSelector: (item) => item.value,
          })
        )
        .toEqual(
          Object.keys(StandardWeekConfig).reduce(
            (acc, key) => {
              const item = StandardWeekConfig[key as keyof typeof StandardWeekConfig];
              acc[key] = item.value;
              return acc;
            },
            {} as Record<string, number>
          )
        );
      engine
        .expect(
          weekEnum.items.toMap({
            keySelector: (item) => item.key,
            valueSelector: (item) => ({ value: item.value, status: item.raw.status }),
          })
        )
        .toEqual(
          Object.keys(StandardWeekConfig).reduce(
            (acc, key) => {
              const item = StandardWeekConfig[key as keyof typeof StandardWeekConfig];
              acc[key] = { value: item.value, status: item.status };
              return acc;
            },
            {} as Record<string, { value: number; status: string }>
          )
        );
    }
  );

  engine.test(
    'enum.items.raw should return the raw object used to initialize the Enum',
    ({ EnumPlus: { Enum }, WeekConfig: { StandardWeekConfig } }) => {
      const WeekConfig = StandardWeekConfig;
      const weekEnum = Enum(StandardWeekConfig);
      return { weekEnum, WeekConfig };
    },
    ({ weekEnum, WeekConfig }) => {
      engine.expect(weekEnum.items.raw()).toEqual(WeekConfig);
      engine.expect(weekEnum.items.raw(0)).toEqual(WeekConfig.Sunday);
      engine.expect(weekEnum.items.raw('Sunday')).toEqual(WeekConfig.Sunday);
      engine.expect(weekEnum.items.raw(6)).toEqual(WeekConfig.Saturday);
      engine.expect(weekEnum.items.raw('Saturday')).toEqual(WeekConfig.Saturday);
      engine.expect(weekEnum.items.raw('Saturday').status).toEqual('error');
      engine.expect(weekEnum.items.raw('Monday').status).toEqual('warning');
      engine.expect(weekEnum.items.raw('Friday').status).toEqual('success');
      engine.expect(weekEnum.items.raw(7 as typeof weekEnum.valueType)).toBeUndefined();
    }
  );
}

export default testEnumItems;
