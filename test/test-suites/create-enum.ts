import type { EnumInit, Enum as EnumType } from '@enum-plus';
import type TestAdapterBase from '../adapter-one/base';
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
} from '../data/week-config';
import {
  getStandardBooleanData,
  getStandardDateData,
  getStandardWeekData,
  getWeekDataHasKeyEmptyObjectValueNoLabel,
  getWeekDataHasKeyHasValueNoLabel,
  getWeekDataHasKeyNoValueHasLabel,
  getWeekDataHasValueHasLabelNoKey,
  getWeekDataHasValueNoKeyNoLabel,
} from '../data/week-data';
import { toPlainEnums } from '../utils';

const testCreatingEnum = (adapter: TestAdapterBase, Enum: typeof EnumType) => {
  adapter.describe('Create Enum using static init data', () => {
    adapter.test('Should be created with standard init data', () => {
      const week = Enum(StandardWeekConfig);
      adapter.expect(week).toBeDefined();
      adapter.expect(week).not.toBeNull();
      adapter.expect(week?.items?.length).toBe(7);
      adapter.expect(toPlainEnums(week.items)).toEqual(getStandardWeekData(locales));
    });

    adapter.test('Should be created with number values', () => {
      const week = Enum(WeekNumberConfig);
      adapter.expect(toPlainEnums(week.items)).toEqual(getWeekDataHasKeyHasValueNoLabel());
    });

    adapter.test('Should be created with string values', () => {
      const week = Enum(WeekStringConfig);
      adapter.expect(toPlainEnums(week.items)).toEqual(getWeekDataHasKeyEmptyObjectValueNoLabel());
    });

    adapter.test('Should be created with value-only config', () => {
      const week = Enum(WeekValueOnlyConfig);
      adapter.expect(toPlainEnums(week.items)).toEqual(getWeekDataHasKeyHasValueNoLabel());
    });

    adapter.test('Should be created with label-only config', () => {
      const week = Enum(WeekLabelOnlyConfig);
      adapter.expect(toPlainEnums(week.items)).toEqual(getWeekDataHasKeyNoValueHasLabel(locales));
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
      adapter.expect(toPlainEnums(weekWithEmptyLabel.items)).toEqual(getWeekDataHasKeyEmptyObjectValueNoLabel());
    });

    adapter.test('Should be created with compact config', () => {
      const week = Enum(WeekCompactConfig);
      adapter.expect(toPlainEnums(week.items)).toEqual(getWeekDataHasKeyEmptyObjectValueNoLabel());
      const week2 = Enum(WeekEmptyConfig);
      adapter.expect(toPlainEnums(week2.items)).toEqual(getWeekDataHasKeyEmptyObjectValueNoLabel());
    });

    adapter.test('Should be created with boolean values', () => {
      const week = Enum(BooleanStandardConfig);
      adapter.expect(toPlainEnums(week.items)).toEqual(getStandardBooleanData(locales));
    });

    adapter.test('Should be created with date values', () => {
      const week = Enum(DateStandardConfig);
      adapter.expect(toPlainEnums(week.items)).toEqual(getStandardDateData(locales));
    });

    adapter.test('Should be created with empty config', () => {
      const week = Enum({});
      adapter.expect(week.items.length).toBe(0);
    });

    adapter.test('Should be created with undefined', () => {
      const week = Enum(undefined as unknown as EnumInit);
      adapter.expect(week.items.length).toBe(0);
    });

    adapter.test('Should be created with supported but invalid values', () => {
      adapter
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .expect(toPlainEnums(Enum({ foo: /regexp/ } as Record<string, any>).items))
        .toEqual([{ key: 'foo', value: /regexp/, label: 'foo' }]);
      const date = new Date();
      adapter
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .expect(toPlainEnums(Enum({ foo: date } as Record<string, any>).items))
        .toEqual([{ key: 'foo', value: date, label: 'foo' }]);
    });

    adapter.test('Should throw error if init data is invalid', () => {
      adapter
        .expect(() => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          Enum({ foo: () => void 0 } as Record<string, any>);
        })
        .toThrow();
    });
  });

  adapter.describe('Create Enum with dynamic array', () => {
    adapter.test('Should have a return', () => {
      const week = Enum(WeekStandardArray);
      adapter.expect(week).toBeDefined();
      adapter.expect(week).not.toBeNull();
      adapter.expect(week?.items?.length).toBe(7);
    });

    adapter.test('Should be created with standard array', () => {
      const weekWithDefaultFields = Enum(WeekStandardArray);
      adapter.expect(toPlainEnums(weekWithDefaultFields.items)).toEqual(getStandardWeekData(locales));
      const week = Enum(WeekStandardArray, {
        getValue: 'value',
        getLabel: 'label',
        getKey: 'key',
      });
      adapter.expect(toPlainEnums(week.items)).toEqual(getStandardWeekData(locales));
      const weekWithFieldFunctions = Enum(WeekStandardArray, {
        getValue: (item) => item.value,
        getLabel: (item) => item.label,
        getKey: (item) => item.key as 'key',
      });
      adapter.expect(toPlainEnums(weekWithFieldFunctions.items)).toEqual(getStandardWeekData(locales));
    });

    adapter.test('Should be created with standard items array, but without providing getKey', () => {
      const week = Enum(WeekStandardArray, {
        getValue: 'value',
        getLabel: 'label',
        getKey: '' as 'key',
      });
      adapter.expect(toPlainEnums(week.items)).toEqual(getWeekDataHasValueHasLabelNoKey(locales));
      const weekWithDefaultKey = Enum(WeekStandardArray, {
        getValue: 'value',
        getLabel: 'label',
        getKey: undefined,
      });
      adapter.expect(toPlainEnums(weekWithDefaultKey.items)).toEqual(getStandardWeekData(locales));
    });

    adapter.test('Should be created with standard items array, but without providing getLabel', () => {
      const week = Enum(WeekStandardArray, {
        getValue: 'value',
        getLabel: '' as 'label',
        getKey: 'key',
      });
      adapter.expect(toPlainEnums(week.items)).toEqual(getWeekDataHasKeyHasValueNoLabel());
      const weekWithDefaultLabel = Enum(WeekStandardArray, {
        getValue: 'value',
        getKey: 'key',
      });
      adapter.expect(toPlainEnums(weekWithDefaultLabel.items)).toEqual(getStandardWeekData(locales));
    });

    adapter.test('Should be created with standard items array, but without providing getKey and getLabel', () => {
      const week = Enum(WeekStandardArray, {
        getValue: 'value',
        getLabel: '' as 'label',
        getKey: '' as 'key',
      });
      adapter.expect(toPlainEnums(week.items)).toEqual(getWeekDataHasValueNoKeyNoLabel());
      const weekWithNoting = Enum(WeekStandardArray, {
        getValue: '' as 'value',
        getLabel: '' as 'label',
        getKey: '' as 'key',
      });
      adapter.expect(toPlainEnums(weekWithNoting.items)).toEqual([
        {
          key: 'undefined', // why 'undefined' string? key is always in string form, even it's undefined.
          value:
            'undefined' /* Why string 'undefined' too? the enum value is undefined, then fallback to [key], so its value is equal to the key */,
          label: undefined,
        },
      ]);
    });

    adapter.test('enums.raw should return the raw array used to initialize the enums', () => {
      const WeekConfig = StandardWeekConfig;
      const week = Enum(WeekConfig);
      adapter.expect(week.raw()).toBe(WeekConfig);
      adapter.expect(week.raw(0)).toBe(WeekConfig.Sunday);
      adapter.expect(week.raw('Sunday')).toBe(WeekConfig.Sunday);
      adapter.expect(week.raw(6)).toBe(WeekConfig.Saturday);
      adapter.expect(week.raw('Saturday')).toBe(WeekConfig.Saturday);
      adapter.expect(week.raw(7)).toBeUndefined();
      adapter.expect(week.raw('Saturday').status).toEqual('error');
      adapter.expect(week.raw('Monday').status).toEqual('warning');
      adapter.expect(week.raw('Friday').status).toEqual('success');
    });
  });

  adapter.describe('Create Enum with native enum', () => {
    adapter.test(
      'should be created with native enums, and the key and value should be consistent with the native enum',
      () => {
        enum firstSeedInit {
          A = 1,
          B,
          C,
        }
        const firstSeedEnum = Enum(firstSeedInit);
        adapter.expect(toPlainEnums(firstSeedEnum.items)).toEqual([
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
        adapter.expect(toPlainEnums(noneInitializer.items)).toEqual([
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
        adapter.expect(toPlainEnums(withDiffInitializer.items)).toEqual([
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
        adapter.expect(toPlainEnums(withDiffInitializer2.items)).toEqual([
          { value: 0, label: 'A', key: 'A' },
          { value: 1, label: 'B', key: 'B' },
          { value: 2, label: 'C', key: 'C' },
          { value: 5, label: 'D', key: 'D' },
          { value: 6, label: 'E', key: 'E' },
          { value: 9, label: 'F', key: 'F' },
          { value: 10, label: 'G', key: 'G' },
        ]);
      }
    );

    adapter.test('Should stop auto-increment starting from "non-number" enum item', () => {
      enum stringIncrementInit {
        A = 'AAA',
        B = 1,
        C,
      }
      const stringIncrement = Enum(stringIncrementInit);
      adapter.expect(toPlainEnums(stringIncrement.items)).toEqual([
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
      adapter.expect(toPlainEnums(mixed.items)).toEqual([
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
      adapter.expect(toPlainEnums(mixed2.items)).toEqual([
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
};

export default testCreatingEnum;
