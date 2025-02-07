import { Enum, KEYS, VALUES } from '../src';
import { EnumValuesArray } from '../src/enum-values';
import { locales, sillyLocalize, StandardWeekConfig } from './data/week-config';
import { getStandardWeekData } from './data/week-data';
import { addEnumValuesTestSuite } from './enum-values.test';
import { toPlainEnums } from './utils';

describe('the EnumCollectionClass api', () => {
  addEnumValuesTestSuite(Enum(StandardWeekConfig));

  test('[keys] should be able to return all enum keys', () => {
    const week = Enum(StandardWeekConfig);
    expect(week.keys).toEqual(Object.keys(StandardWeekConfig));
  });

  test('[values] should be able to return an array of enum items', () => {
    const week = Enum(StandardWeekConfig);
    expect(Array.isArray(week.values)).toBeTruthy();
    expect(toPlainEnums(week.values)).toEqual(getStandardWeekData(locales));
  });

  test('api methods should be same as EnumValuesArray', () => {
    const week = Enum(StandardWeekConfig);
    expect(week.label(1)).toBe(week.values.label(1));
    expect(week.key(1)).toBe(week.values.key(1));
    expect(week.has(1)).toBe(week.values.has(1));
    expect(week.raw()).toBe(week.values.raw());
    expect(week.toSelect()).toEqual(week.values.toSelect());
    expect(week.options()).toEqual(week.values.options());
    expect(week.toMenu()).toEqual(week.values.toMenu());
    expect(week.menus()).toEqual(week.values.menus());
    expect(week.toFilter()).toEqual(week.values.toFilter());
    expect(week.filters()).toEqual(week.values.filters());
    expect(week.toValueMap()).toEqual(week.values.toValueMap());
    expect(week.valuesEnum()).toEqual(week.values.valuesEnum());
  });

  test('[keys,values] should be able to auto renaming to a non-conflicting name', () => {
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
    };
    const strangeEnum = Enum(strangeEnumConfig);
    expect(strangeEnum.label).toBe(1);
    expect(strangeEnum.values.label(1)).toBe('label');
    expect(strangeEnum.key).toBe(2);
    expect(strangeEnum.values.key(2)).toBe('key');
    expect(strangeEnum.has).toBe(3);
    expect(strangeEnum.values.has(3)).toBe(true);
    expect(strangeEnum.toSelect).toBe(4);
    expect(strangeEnum.values.toSelect()).toHaveLength(Object.keys(strangeEnumConfig).length);
    expect(strangeEnum.toFilter).toBe(6);
    expect(strangeEnum.values.toFilter()).toHaveLength(Object.keys(strangeEnumConfig).length);
    expect(strangeEnum.toMenu).toBe(7);
    expect(strangeEnum.values.toMenu()).toHaveLength(Object.keys(strangeEnumConfig).length);
    expect(strangeEnum.toValueMap).toBe(5);
    expect(Object.keys(strangeEnum.values.toValueMap())).toEqual(
      Object.keys(strangeEnumConfig).map((key) =>
        strangeEnumConfig[key as keyof typeof strangeEnumConfig].value.toString()
      )
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
        value: strangerEnumConfig[key as keyof typeof strangerEnumConfig].value,
        label: strangerEnumConfig[key as keyof typeof strangerEnumConfig].label,
      }))
    );
  });

  test('[toString] should return a friendly name', () => {
    const week = Enum(StandardWeekConfig);
    expect(week.toString()).toBe('[object EnumCollection]');
  });

  test('enum value/key/label should be success by the [instanceof] operator', () => {
    const week = Enum(StandardWeekConfig);
    expect((0 as unknown) instanceof (week as unknown as () => void)).toBeTruthy();
    expect(('Sunday' as unknown) instanceof (week as unknown as () => void)).toBeTruthy();
    expect((sillyLocalize?.('weekday.sunday') as unknown) instanceof (week as unknown as () => void)).toBeTruthy();
    expect((6 as unknown) instanceof (week as unknown as () => void)).toBeTruthy();
    expect(('Saturday' as unknown) instanceof (week as unknown as () => void)).toBeTruthy();
    expect((sillyLocalize?.('weekday.saturday') as unknown) instanceof (week as unknown as () => void)).toBeTruthy();
    expect((7 as unknown) instanceof (week as unknown as () => void)).toBeFalsy();
    expect(('[Not Exists]' as unknown) instanceof (week as unknown as () => void)).toBeFalsy();
  });
});
