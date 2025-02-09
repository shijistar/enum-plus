import { Enum } from '../src';
import type { IEnumValues } from '../src/types';
import { locales, localizeConfigData, StandardWeekConfig } from './data/week-config';
import { getStandardWeekData } from './data/week-data';
import { getOptionsData, pickArray } from './utils';

describe('the EnumValuesArray api', () => {
  addEnumValuesTestSuite(Enum(StandardWeekConfig).items);
});

export function addEnumValuesTestSuite(
  weekEnum: IEnumValues<
    typeof StandardWeekConfig,
    keyof typeof StandardWeekConfig,
    (typeof StandardWeekConfig)[keyof typeof StandardWeekConfig]['value']
  >
) {
  test('[label] should be able to get enum label by key or value', () => {
    expect(weekEnum.label(0)).toBe(locales.Sunday);
    expect(weekEnum.label('Sunday')).toBe(locales.Sunday);
    expect(weekEnum.label(6)).toBe(locales.Saturday);
    expect(weekEnum.label('Saturday')).toBe(locales.Saturday);
    expect(weekEnum.label(7)).toBeUndefined();
  });

  test('[key] should be able to get enum key by value', () => {
    expect(weekEnum.key(0)).toBe('Sunday');
    expect(weekEnum.key(6)).toBe('Saturday');
    expect(weekEnum.key(7)).toBeUndefined();
  });

  test('[has] should be able to check enum item exist or not', () => {
    expect(weekEnum.has(0)).toBe(true);
    expect(weekEnum.has('Sunday')).toBe(true);
    expect(weekEnum.has(6)).toBe(true);
    expect(weekEnum.has('Saturday')).toBe(true);
    expect(weekEnum.has(7)).toBe(false);
  });

  test('[options] should be able to generate select options', () => {
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

    // options is deprecated, should be same as toSelect
    expect(weekEnum.options()).toEqual(weekEnum.toSelect());
  });

  test('[valuesEnum] should be able to generate enum type for AntDesignPro', () => {
    expect(weekEnum.toValueMap()).toEqual(
      Object.values(localizeConfigData(StandardWeekConfig)).reduce(
        (acc, { value, label }) => {
          acc[value] = { text: label };
          return acc;
        },
        {} as Record<number, { text: string }>
      )
    );
    // valuesEnum is deprecated, should be same as toValueMap
    expect(weekEnum.valuesEnum()).toEqual(weekEnum.toValueMap());
  });

  test('[menus] should be able to generate data for AntDesign Menu', () => {
    expect(weekEnum.toMenu()).toEqual(
      Object.values(localizeConfigData(StandardWeekConfig)).map(({ value, label }) => ({
        key: value,
        label: label,
      }))
    );
    // menus is deprecated, should be same as toMenu
    expect(weekEnum.menus()).toEqual(weekEnum.toMenu());
  });

  test('[filters] should be able to generate filter items for AntDesign Table', () => {
    expect(weekEnum.toFilter()).toEqual(
      Object.values(localizeConfigData(StandardWeekConfig)).map(({ value, label }) => ({
        text: label,
        value,
      }))
    );
    // filters is deprecated, should be same as toFilter
    expect(weekEnum.filters()).toEqual(weekEnum.toFilter());
  });

  test('[raw] should be able to return the raw object used to initialize the enums', () => {
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

  test('[valueType] should throw error when valueType accessor is called at runtime', () => {
    expect(() => weekEnum.valueType).toThrow();
  });

  test('[keyType] should throw error when keyType accessor is called at runtime', () => {
    expect(() => weekEnum.keyType).toThrow();
  });

  test('[rawType] should throw error when rawType accessor is called at runtime', () => {
    expect(() => weekEnum.rawType).toThrow();
  });
}
