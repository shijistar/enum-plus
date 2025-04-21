import { Enum, ENUM_ITEMS } from '@enum-plus';
import type { IEnumItems } from '@enum-plus/types';
import { locales, localizeConfigData, StandardWeekConfig } from './data/week-config';
import { getStandardWeekData } from './data/week-data';
import { getOptionsData, pickArray } from './utils';

describe('The EnumValuesArray api', () => {
  addEnumValuesTestSuite(Enum(StandardWeekConfig).items);
});

export function addEnumValuesTestSuite(
  weekEnum: IEnumItems<
    typeof StandardWeekConfig,
    keyof typeof StandardWeekConfig,
    (typeof StandardWeekConfig)[keyof typeof StandardWeekConfig]['value']
  >
) {
  test('enums.label should be able to get enum label by key or value', () => {
    expect(weekEnum.label(0)).toBe(locales.Sunday);
    expect(weekEnum.label('Sunday')).toBe(locales.Sunday);
    expect(weekEnum.label(6)).toBe(locales.Saturday);
    expect(weekEnum.label('Saturday')).toBe(locales.Saturday);
    expect(weekEnum.label(7 as typeof weekEnum.valueType)).toBeUndefined();
  });

  test('enums.key should be able to get enum key by value', () => {
    expect(weekEnum.key(0)).toBe('Sunday');
    expect(weekEnum.key(6)).toBe('Saturday');
    expect(weekEnum.key(7 as typeof weekEnum.valueType)).toBeUndefined();
  });

  test('enums.has should be able to check enum item exist or not', () => {
    expect(weekEnum.has(0)).toBe(true);
    expect(weekEnum.has('Sunday')).toBe(true);
    expect(weekEnum.has(6)).toBe(true);
    expect(weekEnum.has('Saturday')).toBe(true);
    expect(weekEnum.has(7 as typeof weekEnum.valueType)).toBe(false);
  });

  test('enums.toSelect should generate an object array for AntDesign Select', () => {
    expect(getOptionsData(weekEnum.toSelect())).toEqual(pickArray(getStandardWeekData(locales), ['label', 'value']));
    expect(getOptionsData(weekEnum.toSelect({}))).toEqual(pickArray(getStandardWeekData(locales), ['label', 'value']));

    // Add first-option by boolean flag
    const withDefaultFirstOption = weekEnum.toSelect({ firstOption: true });
    expect(withDefaultFirstOption).toHaveLength(8);
    expect(withDefaultFirstOption[0]).toEqual({
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
    expect(customDefaultOption).toHaveLength(8);
    expect(customDefaultOption[0]).toEqual({ value: 99, key: '', label: 'Select All' });

    // Add custom first-option
    const customOption = { value: 99, key: '99', label: 'WeekdayX' };
    const withCustomFirstOption = weekEnum.toSelect({
      firstOption: customOption,
    });
    expect(withCustomFirstOption[0]).toEqual(customOption);

    // Add custom first-option using value as key
    const customOptionWithoutKey = { value: 99, label: 'WeekdayX' };
    const withCustomFirstOptionUsingValueAsKey = weekEnum.toSelect({
      firstOption: customOptionWithoutKey,
    });
    expect(withCustomFirstOptionUsingValueAsKey[0]).toEqual({
      ...customOptionWithoutKey,
      key: customOptionWithoutKey.value,
    });
  });

  test('enums.toValueMap should generate an object array for AntDesignPro', () => {
    expect(weekEnum.toValueMap()).toEqual(
      Object.values(localizeConfigData(StandardWeekConfig)).reduce(
        (acc, { value, label }) => {
          acc[value] = { text: label };
          return acc;
        },
        {} as Record<number, { text: string }>
      )
    );
  });

  test('enums.toMenu should generate an object array for AntDesign Menu', () => {
    expect(weekEnum.toMenu()).toEqual(
      Object.values(localizeConfigData(StandardWeekConfig)).map(({ value, label }) => ({
        key: value,
        label: label,
      }))
    );
  });

  test('enums.toFilter should generate an object array for AntDesign Table', () => {
    expect(weekEnum.toFilter()).toEqual(
      Object.values(localizeConfigData(StandardWeekConfig)).map(({ value, label }) => ({
        text: label,
        value,
      }))
    );
  });

  test('enums.raw should return the raw object used to initialize the Enum', () => {
    const WeekConfig = StandardWeekConfig;
    expect(weekEnum.raw()).toEqual(WeekConfig);
    expect(weekEnum.raw(0)).toEqual(WeekConfig.Sunday);
    expect(weekEnum.raw('Sunday')).toEqual(WeekConfig.Sunday);
    expect(weekEnum.raw(6)).toEqual(WeekConfig.Saturday);
    expect(weekEnum.raw('Saturday')).toEqual(WeekConfig.Saturday);
    expect(weekEnum.raw('Saturday').status).toEqual('error');
    expect(weekEnum.raw('Monday').status).toEqual('warning');
    expect(weekEnum.raw('Friday').status).toEqual('success');
    expect(weekEnum.raw(7)).toBeUndefined();
  });

  test('should have [ENUM_ITEMS] property to indicate that this is an enum items array', () => {
    const week = Enum(StandardWeekConfig);
    // @ts-expect-error: because ENUM_ITEMS is hidden by the interface, but it actually exists
    expect(week.items[ENUM_ITEMS]).toBe(true);
    // @ts-expect-error: because ENUM_ITEMS equals Symbol.for('[EnumItems]')
    expect(week.items[Symbol.for('[EnumItems]')]).toBe(true);
  });

  test('enums.valueType should throw error when called at runtime', () => {
    expect(() => weekEnum.valueType).toThrow();
  });

  test('enums.keyType should throw error when called at runtime', () => {
    expect(() => weekEnum.keyType).toThrow();
  });

  test('enums.rawType should throw error when called at runtime', () => {
    expect(() => weekEnum.rawType).toThrow();
  });
}
