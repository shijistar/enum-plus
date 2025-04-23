import { defaultLocalize, ENUM_ITEMS as NODE_ENUM_ITEMS } from '@enum-plus';
import { getLocales, localizeConfigData, StandardWeekConfig } from '../data/week-config';
import { getStandardWeekData } from '../data/week-data';
import type TestEngineBase from '../engines/base';
import { getOptionsData, pickArray } from '../utils';

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
      engine.expect(weekEnum.label(7)).toBeUndefined();
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
      engine.expect(weekEnum.key(7)).toBeUndefined();
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
      engine.expect(weekEnum.has(7)).toBe(false);
    }
  );

  engine.test(
    'enums.toSelect should generate an object array for AntDesign Select',
    ({ EnumPlus: { Enum }, WeekConfig: { StandardWeekConfig, locales } }) => {
      const weekEnum = Enum(StandardWeekConfig);
      return { weekEnum, locales };
    },
    ({ weekEnum, locales }) => {
      engine
        .expect(getOptionsData(weekEnum.toSelect()))
        .toEqual(pickArray(getStandardWeekData(locales), ['label', 'value']));
      engine
        .expect(getOptionsData(weekEnum.toSelect({})))
        .toEqual(pickArray(getStandardWeekData(locales), ['label', 'value']));

      // Add first-option by boolean flag
      const withDefaultFirstOption = weekEnum.toSelect({ firstOption: true });
      engine.expect(withDefaultFirstOption).toHaveLength(8);
      engine.expect(withDefaultFirstOption[0]).toEqual({
        value: '',
        key: '',
        label: 'All',
      });

      // Add first-option by boolean flag with custom value
      const customDefaultOption = weekEnum.toSelect({
        firstOption: true,
        firstOptionValue: 99 as 1,
        firstOptionLabel: 'Select All',
      });
      engine.expect(customDefaultOption).toHaveLength(8);
      engine.expect(customDefaultOption[0]).toEqual({ value: 99, key: '', label: 'Select All' });

      // Add custom first-option
      const customOption = { value: 99, key: '99', label: 'WeekdayX' };
      const withCustomFirstOption = weekEnum.toSelect({
        firstOption: customOption,
      });
      engine.expect(withCustomFirstOption[0]).toEqual(customOption);

      // Add custom first-option using value as key
      const customOptionWithoutKey = { value: 99, label: 'WeekdayX' };
      const withCustomFirstOptionUsingValueAsKey = weekEnum.toSelect({
        firstOption: customOptionWithoutKey,
      });
      engine.expect(withCustomFirstOptionUsingValueAsKey[0]).toEqual({
        ...customOptionWithoutKey,
        key: customOptionWithoutKey.value,
      });
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
      engine.expect(weekEnum.raw(7)).toBeUndefined();
    }
  );

  engine.test(
    'should have [ENUM_ITEMS] property to indicate that this is an enum items array',
    ({ EnumPlus: { Enum, ENUM_ITEMS }, WeekConfig: { StandardWeekConfig } }) => {
      const weekEnum = Enum(StandardWeekConfig);
      return { weekEnum, ENUM_ITEMS };
    },
    ({ weekEnum, ENUM_ITEMS }) => {
      // @ts-expect-error: because ENUM_ITEMS is hidden by the interface, but it actually exists
      engine.expect(weekEnum.items[NODE_ENUM_ITEMS]).toBe(true);
      // @ts-expect-error: because ENUM_ITEMS is hidden by the interface, but it actually exists
      engine.expect(weekEnum.items[ENUM_ITEMS]).toBe(true);
      // @ts-expect-error: because ENUM_ITEMS equals Symbol.for('[EnumItems]')
      engine.expect(weekEnum.items[Symbol.for('[EnumItems]')]).toBe(true);
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
