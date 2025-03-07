import type { EnumInit } from '../src';
import { Enum } from '../src';
import {
  BooleanStandardConfig,
  DateStandardConfig,
  locales,
  StandardWeekConfig,
  WeekCompactConfig,
  WeekEmptyConfig,
  WeekLabelOnlyConfig,
  WeekNumberConfig,
  WeekStandardArray,
  WeekStringConfig,
  WeekValueOnlyConfig,
} from './data/week-config';
import {
  getStandardBooleanData,
  getStandardDateData,
  getStandardWeekData,
  getWeekDataHasKeyEmptyObjectValueNoLabel,
  getWeekDataHasKeyHasValueNoLabel,
  getWeekDataHasKeyNoValueHasLabel,
  getWeekDataHasValueHasLabelNoKey,
  getWeekDataHasValueNoKeyNoLabel,
} from './data/week-data';
import { toPlainEnums } from './utils';

describe('should be able to create an enum from object', () => {
  test('should have a return', () => {
    const week = Enum(StandardWeekConfig);
    expect(week).toBeDefined();
    expect(week).not.toBeNull();
    expect(week?.items?.length).toBe(7);
  });
  test('values is deprecated to items', () => {
    const week = Enum(StandardWeekConfig);
    expect(week.values).toBe(week.items);
  });

  test('create weekdays enum with normal config', () => {
    const week = Enum(StandardWeekConfig);
    expect(toPlainEnums(week.items)).toEqual(getStandardWeekData(locales));
  });

  test('create weekdays enum with number', () => {
    const week = Enum(WeekNumberConfig);
    expect(toPlainEnums(week.items)).toEqual(getWeekDataHasKeyHasValueNoLabel());
  });

  test('create weekdays enum with string', () => {
    const week = Enum(WeekStringConfig);
    expect(toPlainEnums(week.items)).toEqual(getWeekDataHasKeyEmptyObjectValueNoLabel());
  });

  test('create weekdays enum with value-only config', () => {
    const week = Enum(WeekValueOnlyConfig);
    expect(toPlainEnums(week.items)).toEqual(getWeekDataHasKeyHasValueNoLabel());
  });

  test('create weekdays enum with label-only config', () => {
    const week = Enum(WeekLabelOnlyConfig);
    expect(toPlainEnums(week.items)).toEqual(getWeekDataHasKeyNoValueHasLabel(locales));
    const weekWithEmptyLabel = Enum(
      Object.keys(WeekLabelOnlyConfig).reduce(
        (acc, key) => {
          // clear label
          acc[key] = { ...acc[key], label: undefined as unknown as string };
          return acc;
        },
        {} as Record<string, { label: string }>
      )
    );
    expect(toPlainEnums(weekWithEmptyLabel.items)).toEqual(getWeekDataHasKeyEmptyObjectValueNoLabel());
  });

  test('create weekdays enum with compact config', () => {
    const week = Enum(WeekCompactConfig);
    expect(toPlainEnums(week.items)).toEqual(getWeekDataHasKeyEmptyObjectValueNoLabel());
    const week2 = Enum(WeekEmptyConfig);
    expect(toPlainEnums(week2.items)).toEqual(getWeekDataHasKeyEmptyObjectValueNoLabel());
  });

  test('create weekdays enum with boolean values', () => {
    const week = Enum(BooleanStandardConfig);
    expect(toPlainEnums(week.items)).toEqual(getStandardBooleanData(locales));
  });

  test('create weekdays enum with date values', () => {
    const week = Enum(DateStandardConfig);
    expect(toPlainEnums(week.items)).toEqual(getStandardDateData(locales));
  });

  test('create weekdays enum with empty config', () => {
    const week = Enum({});
    expect(week.items.length).toBe(0);
  });

  test('create weekdays enum with undefined', () => {
    const week = Enum(undefined as unknown as EnumInit);
    expect(week.items.length).toBe(0);
  });

  test('create weekdays enum with some supported but invalid values', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect(toPlainEnums(Enum({ foo: /regexp/ } as Record<string, any>).items)).toEqual([
      { key: 'foo', value: /regexp/, label: 'foo' },
    ]);
    const date = new Date();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect(toPlainEnums(Enum({ foo: date } as Record<string, any>).items)).toEqual([
      { key: 'foo', value: date, label: 'foo' },
    ]);
  });

  test('should throw error if enum value is invalid', () => {
    expect(() => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      Enum({ foo: () => void 0 } as Record<string, any>);
    }).toThrow();
  });
});

describe('should be able to create an enum from array', () => {
  test('should have a return', () => {
    const week = Enum(WeekStandardArray);
    expect(week).toBeDefined();
    expect(week).not.toBeNull();
    expect(week?.items?.length).toBe(7);
  });

  test('created weekdays enum with normal config items array', () => {
    const weekWithDefaultFields = Enum(WeekStandardArray);
    expect(toPlainEnums(weekWithDefaultFields.items)).toEqual(getStandardWeekData(locales));
    const week = Enum(WeekStandardArray, {
      getValue: 'value',
      getLabel: 'label',
      getKey: 'key',
    });
    expect(toPlainEnums(week.items)).toEqual(getStandardWeekData(locales));
    const weekWithFieldFunctions = Enum(WeekStandardArray, {
      getValue: (item) => item.value,
      getLabel: (item) => item.label,
      getKey: (item) => item.key as 'key',
    });
    expect(toPlainEnums(weekWithFieldFunctions.items)).toEqual(getStandardWeekData(locales));
  });

  test('created weekdays enum with normal config items array, but without key', () => {
    const week = Enum(WeekStandardArray, {
      getValue: 'value',
      getLabel: 'label',
      getKey: '' as 'key',
    });
    expect(toPlainEnums(week.items)).toEqual(getWeekDataHasValueHasLabelNoKey(locales));
    const weekWithDefaultKey = Enum(WeekStandardArray, {
      getValue: 'value',
      getLabel: 'label',
      getKey: undefined,
    });
    expect(toPlainEnums(weekWithDefaultKey.items)).toEqual(getStandardWeekData(locales));
  });

  test('created weekdays enum with normal config items array, but without label', () => {
    const week = Enum(WeekStandardArray, {
      getValue: 'value',
      getLabel: '' as 'label',
      getKey: 'key',
    });
    expect(toPlainEnums(week.items)).toEqual(getWeekDataHasKeyHasValueNoLabel());
    const weekWithDefaultLabel = Enum(WeekStandardArray, {
      getValue: 'value',
      getKey: 'key',
    });
    expect(toPlainEnums(weekWithDefaultLabel.items)).toEqual(getStandardWeekData(locales));
  });

  test('created weekdays enum with normal config items array, but without key and label', () => {
    const week = Enum(WeekStandardArray, {
      getValue: 'value',
      getLabel: '' as 'label',
      getKey: '' as 'key',
    });
    expect(toPlainEnums(week.items)).toEqual(getWeekDataHasValueNoKeyNoLabel());
    const weekWithNoting = Enum(WeekStandardArray, {
      getValue: '' as 'value',
      getLabel: '' as 'label',
      getKey: '' as 'key',
    });
    expect(toPlainEnums(weekWithNoting.items)).toEqual([
      {
        key: 'undefined', // why 'undefined' string? key is always in string form, even it's undefined.
        value:
          'undefined' /* Why string 'undefined' too? the enum value is undefined, then fallback to [key], so its value is equal to the key */,
        label: undefined,
      },
    ]);
  });

  test('[raw] should be able to return the raw object used to initialize the enums', () => {
    const WeekConfig = StandardWeekConfig;
    const week = Enum(WeekConfig);
    expect(week.raw()).toBe(WeekConfig);
    expect(week.raw(0)).toBe(WeekConfig.Sunday);
    expect(week.raw('Sunday')).toBe(WeekConfig.Sunday);
    expect(week.raw(6)).toBe(WeekConfig.Saturday);
    expect(week.raw('Saturday')).toBe(WeekConfig.Saturday);
    expect(week.raw(7)).toBeUndefined();
    expect(week.raw('Saturday').status).toEqual('error');
    expect(week.raw('Monday').status).toEqual('warning');
    expect(week.raw('Friday').status).toEqual('success');
  });
});

describe('should support auto-incremented number enums', () => {
  test('should be able to create auto-incremented enums', () => {
    enum firstSeedInit {
      A = 1,
      B,
      C,
    }
    const firstSeedEnum = Enum(firstSeedInit);
    expect(toPlainEnums(firstSeedEnum.items)).toEqual([
      { value: 1, label: 'A', key: 'A' },
      { value: 2, label: 'B', key: 'B' },
      { value: 3, label: 'C', key: 'C' },
    ]);

    enum noneInitializerInit {
      A,
      B,
      C,
    }
    const noneInitializer = Enum(noneInitializerInit);
    expect(toPlainEnums(noneInitializer.items)).toEqual([
      { value: 0, label: 'A', key: 'A' },
      { value: 1, label: 'B', key: 'B' },
      { value: 2, label: 'C', key: 'C' },
    ]);

    enum withDiffInitializerInit {
      A,
      B,
      C,
      D = 5,
      E,
    }
    const withDiffInitializer = Enum(withDiffInitializerInit);
    expect(toPlainEnums(withDiffInitializer.items)).toEqual([
      { value: 0, label: 'A', key: 'A' },
      { value: 1, label: 'B', key: 'B' },
      { value: 2, label: 'C', key: 'C' },
      { value: 5, label: 'D', key: 'D' },
      { value: 6, label: 'E', key: 'E' },
    ]);

    enum withDiffInitializerInit2 {
      A,
      B,
      C,
      D = 5,
      E,
      F = 9,
      G,
    }
    const withDiffInitializer2 = Enum(withDiffInitializerInit2);
    expect(toPlainEnums(withDiffInitializer2.items)).toEqual([
      { value: 0, label: 'A', key: 'A' },
      { value: 1, label: 'B', key: 'B' },
      { value: 2, label: 'C', key: 'C' },
      { value: 5, label: 'D', key: 'D' },
      { value: 6, label: 'E', key: 'E' },
      { value: 9, label: 'F', key: 'F' },
      { value: 10, label: 'G', key: 'G' },
    ]);
  });

  test('should stop auto-increment starting from "non-number" enum item', () => {
    enum stringIncrementInit {
      A = 'AAA',
      B = 1,
      C,
    }
    const stringIncrement = Enum(stringIncrementInit);
    expect(toPlainEnums(stringIncrement.items)).toEqual([
      { value: 'AAA', label: 'A', key: 'A' },
      { value: 1, label: 'B', key: 'B' },
      { value: 2, label: 'C', key: 'C' },
    ]);

    enum mixedInit {
      A,
      B = 0,
      C,
      D = 'DDD',
    }
    const mixed = Enum(mixedInit);
    expect(toPlainEnums(mixed.items)).toEqual([
      { value: 0, label: 'A', key: 'A' },
      { value: 0, label: 'B', key: 'B' },
      { value: 1, label: 'C', key: 'C' },
      { value: 'DDD', label: 'D', key: 'D' },
    ]);

    enum mixedInit2 {
      A = -1,
      B,
      C,
      D = 5,
      E,
      F = 9,
      G,
      K = 'KKK',
    }
    const mixed2 = Enum(mixedInit2);
    expect(toPlainEnums(mixed2.items)).toEqual([
      { value: -1, label: 'A', key: 'A' },
      { value: 0, label: 'B', key: 'B' },
      { value: 1, label: 'C', key: 'C' },
      { value: 5, label: 'D', key: 'D' },
      { value: 6, label: 'E', key: 'E' },
      { value: 9, label: 'F', key: 'F' },
      { value: 10, label: 'G', key: 'G' },
      { value: 'KKK', label: 'K', key: 'K' },
    ]);
  });
});
