import type { EnumInit } from '../src';
import { Enum } from '../src';
import { toPlainEnums } from './utils';
import {
  WeekCompactConfig,
  WeekEmptyConfig,
  WeekLabelOnlyConfig,
  WeekNumberConfig,
  WeekStandardArray,
  WeekStringConfig,
  WeekValueOnlyConfig,
  StandardWeekConfig,
  locales,
} from './data/week-config';
import {
  getStandardWeekData,
  getWeekDataHasKeyHasValueNoLabel,
  getWeekDataHasKeyNoValueHasLabel,
  getWeekDataHasKeyNoValueNoLabel,
  getWeekDataHasValueHasLabelNoKey,
  getWeekDataHasValueNoKeyNoLabel,
} from './data/week-data';

describe('should be able to create an enum from object', () => {
  test('should have a return', () => {
    const week = Enum(StandardWeekConfig);
    expect(week).toBeDefined();
    expect(week).not.toBeNull();
    expect(week?.values?.length).toBe(7);
  });

  test('created weekdays enum with normal config', () => {
    const week = Enum(StandardWeekConfig);
    expect(toPlainEnums(week.values)).toEqual(getStandardWeekData(locales));
  });

  test('created weekdays enum with number', () => {
    const week = Enum(WeekNumberConfig);
    expect(toPlainEnums(week.values)).toEqual(getWeekDataHasKeyHasValueNoLabel());
  });

  test('created weekdays enum with string', () => {
    const week = Enum(WeekStringConfig);
    expect(toPlainEnums(week.values)).toEqual(getWeekDataHasKeyNoValueNoLabel());
  });

  test('created weekdays enum with value-only config', () => {
    const week = Enum(WeekValueOnlyConfig);
    expect(toPlainEnums(week.values)).toEqual(getWeekDataHasKeyHasValueNoLabel());
  });

  test('created weekdays enum with label-only config', () => {
    const week = Enum(WeekLabelOnlyConfig);
    expect(toPlainEnums(week.values)).toEqual(getWeekDataHasKeyNoValueHasLabel(locales));
    const weekWithEmptyLabel = Enum(
      Object.keys(WeekLabelOnlyConfig).reduce((acc, key) => {
        // clear label
        acc[key] = { ...acc[key], label: undefined as unknown as string };
        return acc;
      }, {} as Record<string, { label: string }>)
    );
    expect(toPlainEnums(weekWithEmptyLabel.values)).toEqual(getWeekDataHasKeyNoValueNoLabel());
  });

  test('created weekdays enum with compact config', () => {
    const week = Enum(WeekCompactConfig);
    expect(toPlainEnums(week.values)).toEqual(getWeekDataHasKeyNoValueNoLabel());
    const week2 = Enum(WeekEmptyConfig);
    expect(toPlainEnums(week2.values)).toEqual(getWeekDataHasKeyNoValueNoLabel());
  });

  test('created weekdays enum with empty config', () => {
    const week = Enum({});
    expect(week.values.length).toBe(0);
  });

  test('created weekdays enum with undefined', () => {
    const week = Enum(undefined as unknown as EnumInit);
    expect(week.values.length).toBe(0);
  });

  test('created weekdays enum with some supported but invalid values', () => {
    expect(toPlainEnums(Enum({ foo: /regexp/ } as Record<string, any>).values)).toEqual([
      { key: 'foo', value: /regexp/, label: 'foo' },
    ]);
    const date = new Date();
    expect(toPlainEnums(Enum({ foo: date } as Record<string, any>).values)).toEqual([
      { key: 'foo', value: date, label: 'foo' },
    ]);
  });

  test('should throw error if enum value is invalid', () => {
    expect(() => {
      Enum({ foo: () => void 0 } as Record<string, any>);
    }).toThrow();
  });
});

describe('should be able to create an enum from array', () => {
  test('should have a return', () => {
    const week = Enum(WeekStandardArray);
    expect(week).toBeDefined();
    expect(week).not.toBeNull();
    expect(week?.values?.length).toBe(7);
  });

  test('created weekdays enum with normal config items array', () => {
    const weekWithDefaultFields = Enum(WeekStandardArray);
    expect(toPlainEnums(weekWithDefaultFields.values)).toEqual(getStandardWeekData(locales));
    const week = Enum(WeekStandardArray, {
      getValue: 'value',
      getLabel: 'label',
      getKey: 'key',
    });
    expect(toPlainEnums(week.values)).toEqual(getStandardWeekData(locales));
    const weekWithFieldFunctions = Enum(WeekStandardArray, {
      getValue: (item) => item.value,
      getLabel: (item) => item.label,
      getKey: (item) => item.key as 'key',
    });
    expect(toPlainEnums(weekWithFieldFunctions.values)).toEqual(getStandardWeekData(locales));
  });

  test('created weekdays enum with normal config items array, but without key', () => {
    const week = Enum(WeekStandardArray, {
      getValue: 'value',
      getLabel: 'label',
      getKey: '' as 'key',
    });
    expect(toPlainEnums(week.values)).toEqual(getWeekDataHasValueHasLabelNoKey(locales));
    const weekWithDefaultKey = Enum(WeekStandardArray, {
      getValue: 'value',
      getLabel: 'label',
      getKey: undefined,
    });
    expect(toPlainEnums(weekWithDefaultKey.values)).toEqual(getStandardWeekData(locales));
  });

  test('created weekdays enum with normal config items array, but without label', () => {
    const week = Enum(WeekStandardArray, {
      getValue: 'value',
      getLabel: '' as 'label',
      getKey: 'key',
    });
    expect(toPlainEnums(week.values)).toEqual(getWeekDataHasKeyHasValueNoLabel());
    const weekWithDefaultLabel = Enum(WeekStandardArray, {
      getValue: 'value',
      getKey: 'key',
    });
    expect(toPlainEnums(weekWithDefaultLabel.values)).toEqual(getStandardWeekData(locales));
  });

  test('created weekdays enum with normal config items array, but without key and label', () => {
    const week = Enum(WeekStandardArray, {
      getValue: 'value',
      getLabel: '' as 'label',
      getKey: '' as 'key',
    });
    expect(toPlainEnums(week.values)).toEqual(getWeekDataHasValueNoKeyNoLabel());
    const weekWithNoting = Enum(WeekStandardArray, {
      getValue: '' as 'value',
      getLabel: '' as 'label',
      getKey: '' as 'key',
    });
    expect(toPlainEnums(weekWithNoting.values)).toEqual([
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
