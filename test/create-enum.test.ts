import type { EnumInit } from '../src';
import { Enum } from '../src';
import { toPlainEnums } from './utils';
import {
  WeekCompactConfig,
  WeekEmptyConfig,
  WeekLabelOnlyConfig,
  WeekNumberConfig,
  WeekStandardArray,
  WeekStandardConfig,
  WeekStringConfig,
  WeekValueOnlyConfig,
} from './data/week-config';
import {
  StandardWeekData,
  WeekDataHasKeyHasValueNoLabel,
  WeekDataHasKeyNoValueHasLabel,
  WeekDataHasKeyNoValueNoLabel,
  WeekDataHasValueHasLabelNoKey,
  WeekDataHasValueNoKeyNoLabel,
} from './data/week-data';

describe('should be able to create an enum from object', () => {
  test('should have a return', () => {
    const week = Enum(WeekStandardConfig);
    expect(week).toBeDefined();
    expect(week).not.toBeNull();
    expect(week?.values?.length).toBe(7);
  });

  test('created weekdays enum with normal config', () => {
    const week = Enum(WeekStandardConfig);
    expect(toPlainEnums(week.values)).toEqual(StandardWeekData);
  });

  test('created weekdays enum with number', () => {
    const week = Enum(WeekNumberConfig);
    expect(toPlainEnums(week.values)).toEqual(WeekDataHasKeyHasValueNoLabel);
  });

  test('created weekdays enum with string', () => {
    const week = Enum(WeekStringConfig);
    expect(toPlainEnums(week.values)).toEqual(WeekDataHasKeyNoValueNoLabel);
  });

  test('created weekdays enum with value-only config', () => {
    const week = Enum(WeekValueOnlyConfig);
    expect(toPlainEnums(week.values)).toEqual(WeekDataHasKeyHasValueNoLabel);
  });

  test('created weekdays enum with label-only config', () => {
    const week = Enum(WeekLabelOnlyConfig);
    expect(toPlainEnums(week.values)).toEqual(WeekDataHasKeyNoValueHasLabel);
    const weekWithEmptyLabel = Enum(
      Object.keys(WeekLabelOnlyConfig).reduce((acc, key) => {
        // clear label
        acc[key] = { ...acc[key], label: undefined };
        return acc;
      }, {})
    );
    expect(toPlainEnums(weekWithEmptyLabel.values)).toEqual(WeekDataHasKeyNoValueNoLabel);
  });

  test('created weekdays enum with compact config', () => {
    const week = Enum(WeekCompactConfig);
    expect(toPlainEnums(week.values)).toEqual(WeekDataHasKeyNoValueNoLabel);
    const week2 = Enum(WeekEmptyConfig);
    expect(toPlainEnums(week2.values)).toEqual(WeekDataHasKeyNoValueNoLabel);
  });

  test('created weekdays enum with empty config', () => {
    const week = Enum({});
    expect(week.values.length).toEqual(0);
  });

  test('created weekdays enum with undefined', () => {
    const week = Enum(undefined as unknown as EnumInit);
    expect(week.values.length).toEqual(0);
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
    expect(toPlainEnums(weekWithDefaultFields.values)).toEqual(StandardWeekData);
    const week = Enum(WeekStandardArray, 'value', 'label', 'key');
    expect(toPlainEnums(week.values)).toEqual(StandardWeekData);
    const weekWithFieldFunctions = Enum(
      WeekStandardArray,
      (item) => item.value,
      (item) => item.label,
      (item) => item.key
    );
    expect(toPlainEnums(weekWithFieldFunctions.values)).toEqual(StandardWeekData);
  });

  test('created weekdays enum with normal config items array, but without key', () => {
    const week = Enum(WeekStandardArray, 'value', 'label', '' as 'key');
    expect(toPlainEnums(week.values)).toEqual(WeekDataHasValueHasLabelNoKey);
    const weekWithDefaultKey = Enum(WeekStandardArray, 'value', 'label');
    expect(toPlainEnums(weekWithDefaultKey.values)).toEqual(WeekStandardArray);
  });

  test('created weekdays enum with normal config items array, but without label', () => {
    const week = Enum(WeekStandardArray, 'value', '' as 'label', 'key');
    expect(toPlainEnums(week.values)).toEqual(WeekDataHasKeyHasValueNoLabel);
    const weekWithDefaultLabel = Enum(WeekStandardArray, 'value', undefined, 'key');
    expect(toPlainEnums(weekWithDefaultLabel.values)).toEqual(StandardWeekData);
  });

  test('created weekdays enum with normal config items array, but without key and label', () => {
    const week = Enum(WeekStandardArray, 'value', '' as 'label', '' as 'key');
    expect(toPlainEnums(week.values)).toEqual(WeekDataHasValueNoKeyNoLabel);
    const weekWithNoting = Enum(WeekStandardArray, '' as 'value', '' as 'label', '' as 'key');
    expect(toPlainEnums(weekWithNoting.values)).toEqual([
      {
        key: 'undefined', // why 'undefined' string? key is always in string form, even it's undefined.
        value:
          'undefined' /* Why string 'undefined' too? the enum value is undefined, then fallback to [key], so its value is equal to the key */,
        label: undefined,
      },
    ]);
  });
});
