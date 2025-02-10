import { Enum, ITEMS, KEYS, VALUES } from '../src';
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
    expect(Array.isArray(week.items)).toBeTruthy();
    expect(toPlainEnums(week.items)).toEqual(getStandardWeekData(locales));
  });

  test('api methods should be same as EnumValuesArray', () => {
    const week = Enum(StandardWeekConfig);
    expect(week.label(1)).toBe(week.items.label(1));
    expect(week.key(1)).toBe(week.items.key(1));
    expect(week.has(1)).toBe(week.items.has(1));
    expect(week.raw()).toBe(week.items.raw());
    expect(week.toSelect()).toEqual(week.items.toSelect());
    expect(week.options()).toEqual(week.items.options());
    expect(week.toMenu()).toEqual(week.items.toMenu());
    expect(week.menus()).toEqual(week.items.menus());
    expect(week.toFilter()).toEqual(week.items.toFilter());
    expect(week.filters()).toEqual(week.items.filters());
    expect(week.toValueMap()).toEqual(week.items.toValueMap());
    expect(week.valuesEnum()).toEqual(week.items.valuesEnum());
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
    } as const;
    const strangeEnum = Enum(strangeEnumConfig);
    expect(strangeEnum.label).toBe(1);
    expect(strangeEnum.items.label(1)).toBe('label');
    expect(strangeEnum.key).toBe(2);
    expect(strangeEnum.items.key(2)).toBe('key');
    expect(strangeEnum.has).toBe(3);
    expect(strangeEnum.items.has(3)).toBe(true);
    expect(strangeEnum.toSelect).toBe(4);
    expect(strangeEnum.items.toSelect()).toHaveLength(Object.keys(strangeEnumConfig).length);
    expect(strangeEnum.toFilter).toBe(6);
    expect(strangeEnum.items.toFilter()).toHaveLength(Object.keys(strangeEnumConfig).length);
    expect(strangeEnum.toMenu).toBe(7);
    expect(strangeEnum.items.toMenu()).toHaveLength(Object.keys(strangeEnumConfig).length);
    expect(strangeEnum.toValueMap).toBe(5);
    expect(Object.keys(strangeEnum.items.toValueMap())).toEqual(
      Object.keys(strangeEnumConfig).map((key) =>
        strangeEnumConfig[key as keyof typeof strangeEnumConfig].value.toString()
      )
    );
    expect(strangeEnum.keys).toBe(101);
    expect(strangeEnum.items.map((i) => i.key)).toEqual(Object.keys(strangeEnumConfig));

    const strangerEnumConfig = {
      ...strangeEnumConfig,
      items: { value: 101, label: 'bar' },
      values: { value: 102, label: 'baz' },
    } as const;
    const strangerEnum = Enum(strangerEnumConfig);
    expect(strangerEnum.items).toBe(101);
    expect(strangerEnum.values).toBe(102);
    expect(strangerEnum[KEYS]).toEqual(Object.keys(strangerEnumConfig));
    expect(strangerEnum[ITEMS]).toBeInstanceOf(EnumValuesArray);
    expect(strangerEnum[VALUES]).toBeInstanceOf(EnumValuesArray);
    expect(Array.isArray(strangerEnum[ITEMS])).toBeTruthy();
    expect(toPlainEnums(strangerEnum[ITEMS])).toEqual(
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
    expect(Object.prototype.toString.call(week)).toBe('[object EnumCollection]');
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
