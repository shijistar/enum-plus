import { defaultLocalize, IS_ENUM_ITEMS as ENUM_ITEMS_IN_NODE } from '@enum-plus';
import { getLocales, localizeConfigData, StandardWeekConfig } from '../data/week-config';
import { getStandardWeekData } from '../data/week-data';
import type TestEngineBase from '../engines/base';
import { copyList, pickArray } from '../utils/index';

const testEnumValues = (engine: TestEngineBase) => {
  engine.describe('The EnumItemsArray api', () => {
    addEnumValuesTestSuite(engine);
  });
};

export function addEnumValuesTestSuite(engine: TestEngineBase) {
  engine.test(
    'enums.label should be able to get enum label by key or value',
    ({ EnumPlus: { Enum }, WeekConfig: { StandardWeekConfig, locales } }) => {
      const weekEnum = Enum(StandardWeekConfig);
      return { weekEnum, locales };
    },
    ({ weekEnum, locales }) => {
      engine.expect(weekEnum.label(0)).toBe(locales.Sunday);
      engine.expect(weekEnum.label('Sunday')).toBe(locales.Sunday);
      engine.expect(weekEnum.label(6)).toBe(locales.Saturday);
      engine.expect(weekEnum.label('Saturday')).toBe(locales.Saturday);
      engine.expect(weekEnum.label(7 as typeof weekEnum.valueType)).toBeUndefined();
    }
  );

  engine.test(
    'enums.key should be able to get enum key by value',
    ({ EnumPlus: { Enum }, WeekConfig: { StandardWeekConfig } }) => {
      const weekEnum = Enum(StandardWeekConfig);
      return { weekEnum };
    },
    ({ weekEnum }) => {
      engine.expect(weekEnum.key(0)).toBe('Sunday');
      engine.expect(weekEnum.key(6)).toBe('Saturday');
      engine.expect(weekEnum.key(7 as typeof weekEnum.valueType)).toBeUndefined();
    }
  );

  engine.test(
    'enums.has should be able to check enum item exist or not',
    ({ EnumPlus: { Enum }, WeekConfig: { StandardWeekConfig } }) => {
      const weekEnum = Enum(StandardWeekConfig);
      return { weekEnum };
    },
    ({ weekEnum }) => {
      engine.expect(weekEnum.has(0)).toBe(true);
      engine.expect(weekEnum.has('Sunday')).toBe(true);
      engine.expect(weekEnum.has(6)).toBe(true);
      engine.expect(weekEnum.has('Saturday')).toBe(true);
      engine.expect(weekEnum.has(7 as typeof weekEnum.valueType)).toBe(false);
    }
  );

  engine.test(
    'enums.find should be able to find enum item by key, value or custom meta fields',
    ({ EnumPlus: { Enum }, WeekConfig: { StandardWeekConfig, WeekCompactConfig } }) => {
      const weekEnum = Enum(StandardWeekConfig);
      const compactWeekEnum = Enum(WeekCompactConfig);
      return { weekEnum, compactWeekEnum };
    },
    ({ weekEnum, compactWeekEnum }) => {
      engine.expect(weekEnum.findBy('key', 'Monday')).toBe(weekEnum.items[1]);
      engine.expect(weekEnum.findBy('key', 'Saturday')).toBe(weekEnum.items[6]);
      engine.expect(weekEnum.findBy('key', 'Invalid Key')).toBe(undefined);
      engine.expect(weekEnum.findBy('value', 1)).toBe(weekEnum.items[1]);
      engine.expect(weekEnum.findBy('value', 6)).toBe(weekEnum.items[6]);
      engine.expect(weekEnum.findBy('value', 99)).toBe(undefined);
      engine.expect(weekEnum.findBy('label', 'weekday.monday')).toBe(weekEnum.items[1]);
      engine.expect(weekEnum.findBy('label', 'weekday.saturday')).toBe(weekEnum.items[6]);
      engine.expect(weekEnum.findBy('label', 'Invalid Label')).toBe(undefined);
      engine.expect(compactWeekEnum.findBy('key', 'Monday')).toBe(compactWeekEnum.items[1]);
      engine.expect(compactWeekEnum.findBy('key', 'Invalid Key')).toBe(undefined);
      engine.expect(compactWeekEnum.findBy('value', 1)).toBe(undefined);
      engine.expect(compactWeekEnum.findBy('value', 99)).toBe(undefined);
      engine.expect(compactWeekEnum.findBy('label', 'weekday.monday')).toBe(undefined);

      // Custom meta field
      engine.expect(weekEnum.findBy('status', 'error')).toEqual(weekEnum.items[0]);
      engine.expect(weekEnum.findBy('status', 'warning')).toEqual(weekEnum.items[1]);
      engine.expect(weekEnum.findBy('status', 'success')).toEqual(weekEnum.items[3]);
      engine.expect(weekEnum.findBy('status', 'invalid')).toEqual(undefined);
      engine.expect(compactWeekEnum.findBy('status' as 'key', 'success')).toEqual(undefined);
    }
  );

  engine.test(
    'enums.toList should generate an object array',
    ({ EnumPlus: { Enum }, WeekConfig: { StandardWeekConfig, locales } }) => {
      const weekEnum = Enum(StandardWeekConfig);
      const defaultListItems = weekEnum.toList();
      return { locales, defaultListItems };
    },
    ({ locales, defaultListItems }) => {
      engine.expect(copyList(defaultListItems)).toEqual(pickArray(getStandardWeekData(locales), ['value', 'label']));

      // Add first-option by boolean flag
      // const withDefaultFirstOption = weekEnum.toList({ firstOption: true });
      // engine.expect(withDefaultFirstOption).toHaveLength(8);
      // engine.expect(withDefaultFirstOption[0]).toEqual({
      //   value: '',
      //   key: '',
      //   label: 'All',
      // });

      // Add first-option by boolean flag with custom value
      // const customDefaultOption = weekEnum.toList({
      //   firstOption: true,
      //   firstOptionValue: 99 as 1,
      //   firstOptionLabel: 'Select All',
      // });
      // engine.expect(customDefaultOption).toHaveLength(8);
      // engine.expect(customDefaultOption[0]).toEqual({ value: 99, key: '', label: 'Select All' });

      // Add custom first-option
      // const customOption = { value: 99, key: '99', label: 'WeekdayX' };
      // const withCustomFirstOption = weekEnum.toList({
      //   firstOption: customOption,
      // });
      // engine.expect(withCustomFirstOption[0]).toEqual(customOption);

      // Add custom first-option using value as key
      // const customOptionWithoutKey = { value: 99, label: 'WeekdayX' };
      // const withCustomFirstOptionUsingValueAsKey = weekEnum.toList({
      //   firstOption: customOptionWithoutKey,
      // });
      // engine.expect(withCustomFirstOptionUsingValueAsKey[0]).toEqual({
      //   ...customOptionWithoutKey,
      //   key: customOptionWithoutKey.value,
      // });
    }
  );

  engine.test(
    'enums.toList should generate an object array with custom field names',
    ({ EnumPlus: { Enum }, WeekConfig: { StandardWeekConfig, locales } }) => {
      const weekEnum = Enum(StandardWeekConfig);
      const idNameListItems = weekEnum.toList({
        valueField: 'id',
        labelField: 'name',
      });
      const valueNameListItems = weekEnum.toList({
        valueField: 'value',
        labelField: 'name',
      });
      const idLabelListItems = weekEnum.toList({
        valueField: 'id',
        labelField: 'label',
      });
      return { locales, idNameListItems, valueNameListItems, idLabelListItems };
    },
    ({ locales, idNameListItems, valueNameListItems, idLabelListItems }) => {
      engine.expect(Array.from(idNameListItems)).toEqual(
        getStandardWeekData(locales).map((item) => ({
          id: item.value,
          name: item.label,
        }))
      );
      engine.expect(Array.from(valueNameListItems)).toEqual(
        getStandardWeekData(locales).map((item) => ({
          value: item.value,
          name: item.label,
        }))
      );
      engine.expect(Array.from(idLabelListItems)).toEqual(
        getStandardWeekData(locales).map((item) => ({
          id: item.value,
          label: item.label,
        }))
      );
    }
  );

  engine.test(
    'enums.toList should generate an object array with custom field names in function style',
    ({ EnumPlus: { Enum }, WeekConfig: { StandardWeekConfig, locales } }) => {
      const weekEnum = Enum(StandardWeekConfig);
      const staticFieldListItems = weekEnum.toList({
        valueField: () => 'id' as const,
        labelField: () => 'name' as const,
      });
      const dynamicFieldListItems = weekEnum.toList({
        valueField: (item) => `id-${item.value}`,
        labelField: (item) => `name-${item.value}`,
      });
      return { locales, staticFieldListItems, dynamicFieldListItems };
    },
    ({ locales, staticFieldListItems, dynamicFieldListItems }) => {
      engine.expect(Array.from(staticFieldListItems)).toEqual(
        getStandardWeekData(locales).map((item) => ({
          id: item.value,
          name: item.label,
        }))
      );
      engine.expect(Array.from(dynamicFieldListItems)).toEqual(
        getStandardWeekData(locales).map((item) => ({
          ['id-' + item.value]: item.value,
          ['name-' + item.value]: item.label,
        }))
      );
    }
  );

  engine.test(
    'enums.toValueMap should generate an object array for AntDesignPro',
    ({ EnumPlus: { Enum }, WeekConfig: { StandardWeekConfig } }) => {
      const weekEnum = Enum(StandardWeekConfig);
      return { weekEnum };
    },
    ({ weekEnum }) => {
      engine.expect(weekEnum.toValueMap()).toEqual(
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

  engine.test(
    'enums.toMenu should generate an object array for AntDesign Menu',
    ({ EnumPlus: { Enum }, WeekConfig: { StandardWeekConfig } }) => {
      const weekEnum = Enum(StandardWeekConfig);
      return { weekEnum };
    },
    ({ weekEnum }) => {
      engine.expect(Array.from(weekEnum.toMenu())).toEqual(
        Object.values(localizeConfigData(StandardWeekConfig, getLocales, defaultLocalize)).map(({ value, label }) => ({
          key: value,
          label: label,
        }))
      );
    }
  );

  engine.test(
    'enums.toFilter should generate an object array for AntDesign Table',
    ({ EnumPlus: { Enum }, WeekConfig: { StandardWeekConfig } }) => {
      const weekEnum = Enum(StandardWeekConfig);
      return { weekEnum };
    },
    ({ weekEnum }) => {
      engine.expect(Array.from(weekEnum.toFilter())).toEqual(
        Object.values(localizeConfigData(StandardWeekConfig, getLocales, defaultLocalize)).map(({ value, label }) => ({
          text: label,
          value,
        }))
      );
    }
  );

  engine.test(
    'enums.raw should return the raw object used to initialize the Enum',
    ({ EnumPlus: { Enum }, WeekConfig: { StandardWeekConfig } }) => {
      const WeekConfig = StandardWeekConfig;
      const weekEnum = Enum(StandardWeekConfig);
      return { weekEnum, WeekConfig };
    },
    ({ weekEnum, WeekConfig }) => {
      engine.expect(weekEnum.raw()).toEqual(WeekConfig);
      engine.expect(weekEnum.raw(0)).toEqual(WeekConfig.Sunday);
      engine.expect(weekEnum.raw('Sunday')).toEqual(WeekConfig.Sunday);
      engine.expect(weekEnum.raw(6)).toEqual(WeekConfig.Saturday);
      engine.expect(weekEnum.raw('Saturday')).toEqual(WeekConfig.Saturday);
      engine.expect(weekEnum.raw('Saturday').status).toEqual('error');
      engine.expect(weekEnum.raw('Monday').status).toEqual('warning');
      engine.expect(weekEnum.raw('Friday').status).toEqual('success');
      engine.expect(weekEnum.raw(7 as typeof weekEnum.valueType)).toBeUndefined();
    }
  );

  engine.test(
    'should have [ENUM_ITEMS] property to indicate that this is an enum items array',
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
}

export default testEnumValues;
