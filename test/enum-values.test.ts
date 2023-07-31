import type { EnumInit, EnumKey, EnumValue, IEnumValues, ValueTypeFromSingleInit } from '../src';
import { getOptionsData } from './utils';
import { Enum } from '../src';
import { WeekStandardConfig } from './data/week-config';

describe('the EnumValuesArray api', () => {
  addEnumValuesTestSuite(Enum(WeekStandardConfig).values);
});

export function addEnumValuesTestSuite<
  T extends EnumInit<K, V>,
  K extends EnumKey<T> = EnumKey<T>,
  V extends EnumValue = ValueTypeFromSingleInit<T[K], K>
>(weekEnum: IEnumValues<T, K, V>) {
  test('[label] should be able to get enum label by key or value', () => {
    expect(weekEnum.label(0)).toBe('星期日');
    expect(weekEnum.label('Sunday')).toBe('星期日');
    expect(weekEnum.label(6)).toBe('星期六');
    expect(weekEnum.label('Saturday')).toBe('星期六');
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
    expect(getOptionsData(weekEnum.options())).toEqual(Object.values(WeekStandardConfig));
    expect(getOptionsData(weekEnum.options({}))).toEqual(Object.values(WeekStandardConfig));
    const withDefaultFirstOption = weekEnum.options({ firstOption: true });
    expect(withDefaultFirstOption).toHaveLength(8);
    expect(withDefaultFirstOption[0]).toEqual({ value: '', key: '', label: '全部' });
    const customOption = { value: 99, key: '99', label: 'WeekdayX' };
    const withCustomFirstOption = weekEnum.options({
      firstOption: customOption,
    });
    expect(withCustomFirstOption[0]).toEqual(customOption);
    const customOptionWithoutKey = { value: 99, label: 'WeekdayX' };
    const withCustomFirstOptionUsingValueAsKey = weekEnum.options({
      firstOption: customOptionWithoutKey,
    });
    expect(withCustomFirstOptionUsingValueAsKey[0]).toEqual({
      ...customOptionWithoutKey,
      key: customOptionWithoutKey.value,
    });
  });

  test('[valuesEnum] should be able to generate enum type for AntDesignPro', () => {
    expect(weekEnum.valuesEnum()).toEqual(
      Object.values(WeekStandardConfig).reduce((acc, { value, label }) => {
        acc[value] = { text: label };
        return acc;
      }, {})
    );
  });

  test('[filters] should be able to generate filter items for AntDesign Table', () => {
    expect(weekEnum.filters()).toEqual(
      Object.values(WeekStandardConfig).map(({ value, label }) => ({ text: label, value }))
    );
  });

  test('[raw] should be able to return the raw object used to initialize the enums', () => {
    expect(weekEnum.raw()).toBe(WeekStandardConfig);
    expect(weekEnum.raw(0)).toEqual(WeekStandardConfig.Sunday);
    expect(weekEnum.raw('Sunday')).toEqual(WeekStandardConfig.Sunday);
    expect(weekEnum.raw(6)).toEqual(WeekStandardConfig.Saturday);
    expect(weekEnum.raw('Saturday')).toEqual(WeekStandardConfig.Saturday);
    expect(weekEnum.raw(7)).toBeUndefined();
  });

  test('[valueType] should throw error when valueType accessor is called at runtime', () => {
    expect(() => {
      weekEnum.valueType;
    }).toThrow();
  });

  test('[keyType] should throw error when keyType accessor is called at runtime', () => {
    expect(() => {
      weekEnum.keyType;
    }).toThrow();
  });

  test('[rawType] should throw error when rawType accessor is called at runtime', () => {
    expect(() => {
      weekEnum.rawType;
    }).toThrow();
  });
}
