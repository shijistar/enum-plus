import { addEnumValuesTestSuite } from './enum-values.test';
import { Enum, KEYS, VALUES } from '../src';
import { WeekStandardConfig } from './data/week-config';
import { toPlainEnums } from './utils';
import { StandardWeekData } from './data/week-data';
import { EnumValuesArray } from '../src/enum-values';

describe('the EnumCollectionClass api', () => {
  addEnumValuesTestSuite(Enum(WeekStandardConfig));

  test('[keys] should be able to return all enum keys', () => {
    const week = Enum(WeekStandardConfig);
    expect(week.keys).toEqual(Object.keys(WeekStandardConfig));
  });

  test('[values] should be able to return an array of enum items', () => {
    const week = Enum(WeekStandardConfig);
    expect(Array.isArray(week.values)).toBeTruthy();
    expect(toPlainEnums(week.values)).toEqual(StandardWeekData);
  });

  test('[keys,values] should be able to auto renaming to a non-conflicting name', () => {
    const strangeEnumConfig = {
      label: { value: 1, label: 'label' },
      key: { value: 2, label: 'key' },
      has: { value: 3, label: 'has' },
      options: { value: 4, label: 'options' },
      valuesEnum: { value: 5, label: 'valuesEnum' },
      raw: { value: 6, label: 'raw' },
      keys: { value: 101, label: 'foo' },
    };
    const strangeEnum = Enum(strangeEnumConfig);
    expect(strangeEnum.label).toBe(1);
    expect(strangeEnum.values.label(1)).toBe('label');
    expect(strangeEnum.key).toBe(2);
    expect(strangeEnum.values.key(2)).toBe('key');
    expect(strangeEnum.has).toBe(3);
    expect(strangeEnum.values.has(3)).toBe(true);
    expect(strangeEnum.options).toBe(4);
    expect(strangeEnum.values.options()).toHaveLength(Object.keys(strangeEnumConfig).length);
    expect(strangeEnum.valuesEnum).toBe(5);
    expect(Object.keys(strangeEnum.values.valuesEnum())).toEqual(
      Object.keys(strangeEnumConfig).map((key) => strangeEnumConfig[key].value.toString())
    );
    expect(strangeEnum.keys).toBe(101);
    expect(strangeEnum.values.map((i) => i.key)).toEqual(Object.keys(strangeEnumConfig));

    const strangerEnumConfig = {
      ...strangeEnumConfig,
      values: { value: 102, label: 'bar' },
    };
    const strangerEnum = Enum(strangerEnumConfig);
    expect(strangerEnum.values).toBe(102);
    expect(strangerEnum[KEYS]).toEqual(Object.keys(strangerEnumConfig));
    expect(strangerEnum[VALUES]).toBeInstanceOf(EnumValuesArray);
    expect(Array.isArray(strangerEnum[VALUES])).toBeTruthy();
    expect(toPlainEnums(strangerEnum[VALUES])).toEqual(
      Object.keys(strangerEnumConfig).map((key) => ({
        key,
        value: strangerEnumConfig[key].value,
        label: strangerEnumConfig[key].label,
      }))
    );
  });

  test('[toString] should return a friendly name', () => {
    const week = Enum(WeekStandardConfig);
    expect(week.toString()).toBe('[object EnumCollection]');
  });

  test('enum value/key/label should be success by the [instanceof] operator', () => {
    const week = Enum(WeekStandardConfig);
    expect((0 as unknown) instanceof (week as any)).toBeTruthy();
    expect(('Sunday' as unknown) instanceof (week as any)).toBeTruthy();
    expect(('?????????' as unknown) instanceof (week as any)).toBeTruthy();
    expect((6 as unknown) instanceof (week as any)).toBeTruthy();
    expect(('Saturday' as unknown) instanceof (week as any)).toBeTruthy();
    expect(('?????????' as unknown) instanceof (week as any)).toBeTruthy();
    expect((7 as unknown) instanceof (week as any)).toBeFalsy();
    expect(('?????????' as unknown) instanceof (week as any)).toBeFalsy();
  });
});
