import type { EnumInit } from '@enum-plus';
import type TestAdapterBase from '../adapter-one/base';
import { toPlainEnums } from '../utils';

const testCreatingEnum = (adapter: TestAdapterBase) => {
  adapter.describe('Create Enum using static init data', () => {
    adapter.test(
      'Should be created with standard init data',
      ({ EnumPlus: { Enum }, WeekConfig: { StandardWeekConfig, locales }, WeekData: { getStandardWeekData } }) => {
        const weekEnum = Enum(StandardWeekConfig);
        return { weekEnum, getStandardWeekData, locales };
      },
      ({ weekEnum, getStandardWeekData, locales }) => {
        adapter.expect(weekEnum).toBeDefined();
        adapter.expect(weekEnum).not.toBeNull();
        adapter.expect(weekEnum?.items?.length).toBe(7);
        adapter.expect(toPlainEnums(weekEnum.items)).toEqual(getStandardWeekData(locales));
      }
    );

    adapter.test(
      'Should be created with number values',
      ({ EnumPlus: { Enum }, WeekConfig: { WeekNumberConfig }, WeekData: { getWeekDataHasKeyHasValueNoLabel } }) => {
        const weekEnum = Enum(WeekNumberConfig);
        return { weekEnum, getWeekDataHasKeyHasValueNoLabel };
      },
      ({ weekEnum, getWeekDataHasKeyHasValueNoLabel }) => {
        adapter.expect(toPlainEnums(weekEnum.items)).toEqual(getWeekDataHasKeyHasValueNoLabel());
      }
    );

    adapter.test(
      'Should be created with string values',
      ({
        EnumPlus: { Enum },
        WeekConfig: { WeekStringConfig },
        WeekData: { getWeekDataHasKeyEmptyObjectValueNoLabel },
      }) => {
        const weekEnum = Enum(WeekStringConfig);
        return { weekEnum, getWeekDataHasKeyEmptyObjectValueNoLabel };
      },
      ({ weekEnum, getWeekDataHasKeyEmptyObjectValueNoLabel }) => {
        adapter.expect(toPlainEnums(weekEnum.items)).toEqual(getWeekDataHasKeyEmptyObjectValueNoLabel());
      }
    );

    adapter.test(
      'Should be created with value-only config',
      ({ EnumPlus: { Enum }, WeekConfig: { WeekValueOnlyConfig }, WeekData: { getWeekDataHasKeyHasValueNoLabel } }) => {
        const weekEnum = Enum(WeekValueOnlyConfig);
        return { weekEnum, getWeekDataHasKeyHasValueNoLabel };
      },
      ({ weekEnum, getWeekDataHasKeyHasValueNoLabel }) => {
        adapter.expect(toPlainEnums(weekEnum.items)).toEqual(getWeekDataHasKeyHasValueNoLabel());
      }
    );

    adapter.test(
      'Should be created with label-only config',
      ({
        EnumPlus: { Enum },
        WeekConfig: { WeekLabelOnlyConfig, locales },
        WeekData: { getWeekDataHasKeyNoValueHasLabel, getWeekDataHasKeyEmptyObjectValueNoLabel },
      }) => {
        const weekEnum = Enum(WeekLabelOnlyConfig);
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
        return {
          weekEnum,
          weekWithEmptyLabel,
          locales,
          getWeekDataHasKeyNoValueHasLabel,
          getWeekDataHasKeyEmptyObjectValueNoLabel,
        };
      },
      ({
        weekEnum,
        weekWithEmptyLabel,
        locales,
        getWeekDataHasKeyNoValueHasLabel,
        getWeekDataHasKeyEmptyObjectValueNoLabel,
      }) => {
        adapter.expect(toPlainEnums(weekEnum.items)).toEqual(getWeekDataHasKeyNoValueHasLabel(locales));
        adapter.expect(toPlainEnums(weekWithEmptyLabel.items)).toEqual(getWeekDataHasKeyEmptyObjectValueNoLabel());
      }
    );

    adapter.test(
      'Should be created with compact config',
      ({
        EnumPlus: { Enum },
        WeekConfig: { WeekCompactConfig, WeekEmptyConfig },
        WeekData: { getWeekDataHasKeyEmptyObjectValueNoLabel },
      }) => {
        const weekEnum = Enum(WeekCompactConfig);
        const weekEnum2 = Enum(WeekEmptyConfig);
        return { weekEnum, weekEnum2, getWeekDataHasKeyEmptyObjectValueNoLabel };
      },
      ({ weekEnum, weekEnum2, getWeekDataHasKeyEmptyObjectValueNoLabel }) => {
        adapter.expect(toPlainEnums(weekEnum.items)).toEqual(getWeekDataHasKeyEmptyObjectValueNoLabel());
        adapter.expect(toPlainEnums(weekEnum2.items)).toEqual(getWeekDataHasKeyEmptyObjectValueNoLabel());
      }
    );

    adapter.test(
      'Should be created with boolean values',
      ({
        EnumPlus: { Enum },
        WeekConfig: { BooleanStandardConfig, locales },
        WeekData: { getStandardBooleanData },
      }) => {
        const weekEnum = Enum(BooleanStandardConfig);
        return { weekEnum, locales, getStandardBooleanData };
      },
      ({ weekEnum, locales, getStandardBooleanData }) => {
        adapter.expect(toPlainEnums(weekEnum.items)).toEqual(getStandardBooleanData(locales));
      }
    );

    adapter.test(
      'Should be created with date values',
      ({ EnumPlus: { Enum }, WeekConfig: { DateStandardConfig, locales }, WeekData: { getStandardDateData } }) => {
        const weekEnum = Enum(DateStandardConfig);
        return { weekEnum, locales, getStandardDateData };
      },
      ({ weekEnum, locales, getStandardDateData }) => {
        console.log('weekEnum', weekEnum);
        adapter.expect(toPlainEnums(weekEnum.items)).toEqual(getStandardDateData(locales));
      }
    );

    adapter.test(
      'Should be created with empty config',
      ({ EnumPlus: { Enum } }) => {
        const weekEnum = Enum({});
        return { weekEnum };
      },
      ({ weekEnum }) => {
        adapter.expect(weekEnum.items.length).toBe(0);
      }
    );

    adapter.test(
      'Should be created with undefined',
      ({ EnumPlus: { Enum } }) => {
        const weekEnum = Enum(undefined as unknown as EnumInit);
        return { weekEnum };
      },
      ({ weekEnum }) => {
        adapter.expect(weekEnum.items.length).toBe(0);
      }
    );

    adapter.test(
      'Should be created with supported but invalid values',
      ({ EnumPlus: { Enum } }) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const regexpEnum = Enum({ foo: /\sregexp\s/ } as Record<string, any>);
        const date = new Date();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const dateEnum = Enum({ foo: date } as Record<string, any>);
        return { regexpEnum, dateEnum, date };
      },
      ({ regexpEnum, dateEnum, date }) => {
        adapter
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .expect(toPlainEnums(regexpEnum.items))
          .toEqual([{ key: 'foo', value: /\sregexp\s/, label: 'foo' }]);
        adapter.expect(toPlainEnums(dateEnum.items)).toEqual([{ key: 'foo', value: date, label: 'foo' }]);
      }
    );

    adapter.test(
      'Should throw error if init data is invalid',
      ({ EnumPlus: { Enum } }) => {
        let error: Error | undefined;
        try {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          Enum({ foo: () => void 0 } as Record<string, any>);
        } catch (e) {
          error = e as Error;
        }
        return { error };
      },
      ({ error }) => {
        adapter.expect(error).toBeDefined();
      }
    );
  });

  adapter.describe('Create Enum with dynamic array', () => {
    adapter.test(
      'Should have a return',
      ({ EnumPlus: { Enum }, WeekConfig: { WeekStandardArray } }) => {
        const weekEnum = Enum(WeekStandardArray);
        return { weekEnum };
      },
      ({ weekEnum }) => {
        adapter.expect(weekEnum).toBeDefined();
        adapter.expect(weekEnum).not.toBeNull();
        adapter.expect(weekEnum?.items?.length).toBe(7);
      }
    );

    adapter.test(
      'Should be created with standard array',
      ({ EnumPlus: { Enum }, WeekConfig: { WeekStandardArray, locales }, WeekData: { getStandardWeekData } }) => {
        const weekWithDefaultFields = Enum(WeekStandardArray);
        const weekEnum = Enum(WeekStandardArray, {
          getValue: 'value',
          getLabel: 'label',
          getKey: 'key',
        });
        const weekWithFieldFunctions = Enum(WeekStandardArray, {
          getValue: (item) => item.value,
          getLabel: (item) => item.label,
          getKey: (item) => item.key as 'key',
        });
        return { weekEnum, weekWithDefaultFields, weekWithFieldFunctions, locales, getStandardWeekData };
      },
      ({ weekEnum, weekWithDefaultFields, weekWithFieldFunctions, locales, getStandardWeekData }) => {
        adapter.expect(toPlainEnums(weekWithDefaultFields.items)).toEqual(getStandardWeekData(locales));
        adapter.expect(toPlainEnums(weekEnum.items)).toEqual(getStandardWeekData(locales));
        adapter.expect(toPlainEnums(weekWithFieldFunctions.items)).toEqual(getStandardWeekData(locales));
      }
    );

    adapter.test(
      'Should be created with standard items array, but without providing getKey',
      ({
        EnumPlus: { Enum },
        WeekConfig: { WeekStandardArray, locales },
        WeekData: { getWeekDataHasValueHasLabelNoKey, getStandardWeekData },
      }) => {
        const weekEnum = Enum(WeekStandardArray, {
          getValue: 'value',
          getLabel: 'label',
          getKey: '' as 'key',
        });
        const weekWithDefaultKey = Enum(WeekStandardArray, {
          getValue: 'value',
          getLabel: 'label',
          getKey: undefined,
        });
        return { weekEnum, weekWithDefaultKey, locales, getWeekDataHasValueHasLabelNoKey, getStandardWeekData };
      },
      ({ weekEnum, weekWithDefaultKey, locales, getWeekDataHasValueHasLabelNoKey, getStandardWeekData }) => {
        adapter.expect(toPlainEnums(weekEnum.items)).toEqual(getWeekDataHasValueHasLabelNoKey(locales));
        adapter.expect(toPlainEnums(weekWithDefaultKey.items)).toEqual(getStandardWeekData(locales));
      }
    );

    adapter.test(
      'Should be created with standard items array, but without providing getLabel',
      ({
        EnumPlus: { Enum },
        WeekConfig: { WeekStandardArray, locales },
        WeekData: { getStandardWeekData, getWeekDataHasKeyHasValueNoLabel },
      }) => {
        const weekEnum = Enum(WeekStandardArray, {
          getValue: 'value',
          getLabel: '' as 'label',
          getKey: 'key',
        });
        const weekWithDefaultLabel = Enum(WeekStandardArray, {
          getValue: 'value',
          getKey: 'key',
        });
        return {
          weekEnum,
          weekWithDefaultLabel,
          locales,
          getStandardWeekData,
          getWeekDataHasKeyHasValueNoLabel,
        };
      },
      ({ weekEnum, weekWithDefaultLabel, locales, getStandardWeekData, getWeekDataHasKeyHasValueNoLabel }) => {
        adapter.expect(toPlainEnums(weekEnum.items)).toEqual(getWeekDataHasKeyHasValueNoLabel());
        adapter.expect(toPlainEnums(weekWithDefaultLabel.items)).toEqual(getStandardWeekData(locales));
      }
    );

    adapter.test(
      'Should be created with standard items array, but without providing getKey and getLabel',
      ({ EnumPlus: { Enum }, WeekConfig: { WeekStandardArray }, WeekData: { getWeekDataHasValueNoKeyNoLabel } }) => {
        const weekEnum = Enum(WeekStandardArray, {
          getValue: 'value',
          getLabel: '' as 'label',
          getKey: '' as 'key',
        });
        const weekWithNoting = Enum(WeekStandardArray, {
          getValue: '' as 'value',
          getLabel: '' as 'label',
          getKey: '' as 'key',
        });
        return { weekEnum, weekWithNoting, getWeekDataHasValueNoKeyNoLabel };
      },
      ({ weekEnum, weekWithNoting, getWeekDataHasValueNoKeyNoLabel }) => {
        adapter.expect(toPlainEnums(weekEnum.items)).toEqual(getWeekDataHasValueNoKeyNoLabel());
        adapter.expect(toPlainEnums(weekWithNoting.items)).toEqual([
          {
            key: 'undefined', // why 'undefined' string? key is always in string form, even it's undefined.
            value:
              'undefined' /* Why string 'undefined' too? the enum value is undefined, then fallback to [key], so its value is equal to the key */,
            label: undefined,
          },
        ]);
      }
    );

    adapter.test(
      'enums.raw should return the raw array used to initialize the enums',
      ({ EnumPlus: { Enum }, WeekConfig: { StandardWeekConfig } }) => {
        const WeekConfig = StandardWeekConfig;
        const weekEnum = Enum(WeekConfig);
        return { weekEnum, WeekConfig };
      },
      ({ weekEnum, WeekConfig }) => {
        adapter.expect(weekEnum.raw()).toStrictEqual(WeekConfig);
        adapter.expect(weekEnum.raw(0)).toStrictEqual(WeekConfig.Sunday);
        adapter.expect(weekEnum.raw('Sunday')).toStrictEqual(WeekConfig.Sunday);
        adapter.expect(weekEnum.raw(6)).toStrictEqual(WeekConfig.Saturday);
        adapter.expect(weekEnum.raw('Saturday')).toStrictEqual(WeekConfig.Saturday);
        adapter.expect(weekEnum.raw(7)).toBeUndefined();
        adapter.expect(weekEnum.raw('Saturday').status).toEqual('error');
        adapter.expect(weekEnum.raw('Monday').status).toEqual('warning');
        adapter.expect(weekEnum.raw('Friday').status).toEqual('success');
      }
    );
  });

  adapter.describe('Create Enum with native enum', () => {
    adapter.test(
      'should be created with native enums, and the key and value should be consistent with the native enum',
      ({ EnumPlus: { Enum } }) => {
        enum firstSeedInit {
          A = 1,
          B,
          C,
        }
        const firstSeedEnum = Enum(firstSeedInit);

        enum noneInitializerInit {
          A,
          B,
          C,
        }
        const noneInitializer = Enum(noneInitializerInit);

        enum withDiffInitializerInit {
          A,
          B,
          C,
          D = 5,
          E,
        }
        const withDiffInitializer = Enum(withDiffInitializerInit);

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
        return {
          firstSeedEnum,
          noneInitializer,
          withDiffInitializer,
          withDiffInitializer2,
        };
      },
      ({ firstSeedEnum, noneInitializer, withDiffInitializer, withDiffInitializer2 }) => {
        adapter.expect(toPlainEnums(firstSeedEnum.items)).toEqual([
          { value: 1, label: 'A', key: 'A' },
          { value: 2, label: 'B', key: 'B' },
          { value: 3, label: 'C', key: 'C' },
        ]);
        adapter.expect(toPlainEnums(noneInitializer.items)).toEqual([
          { value: 0, label: 'A', key: 'A' },
          { value: 1, label: 'B', key: 'B' },
          { value: 2, label: 'C', key: 'C' },
        ]);
        adapter.expect(toPlainEnums(withDiffInitializer.items)).toEqual([
          { value: 0, label: 'A', key: 'A' },
          { value: 1, label: 'B', key: 'B' },
          { value: 2, label: 'C', key: 'C' },
          { value: 5, label: 'D', key: 'D' },
          { value: 6, label: 'E', key: 'E' },
        ]);
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

    adapter.test(
      'Should stop auto-increment starting from "non-number" enum item',
      ({ EnumPlus: { Enum } }) => {
        enum stringIncrementInit {
          A = 'AAA',
          B = 1,
          C,
        }
        const stringIncrement = Enum(stringIncrementInit);

        enum mixedInit {
          A,
          B = 0,
          C,
          D = 'DDD',
        }
        const mixed = Enum(mixedInit);

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
        return {
          stringIncrement,
          mixed,
          mixed2,
        };
      },
      ({ stringIncrement, mixed, mixed2 }) => {
        adapter.expect(toPlainEnums(stringIncrement.items)).toEqual([
          { value: 'AAA', label: 'A', key: 'A' },
          { value: 1, label: 'B', key: 'B' },
          { value: 2, label: 'C', key: 'C' },
        ]);
        adapter.expect(toPlainEnums(mixed.items)).toEqual([
          { value: 0, label: 'A', key: 'A' },
          { value: 0, label: 'B', key: 'B' },
          { value: 1, label: 'C', key: 'C' },
          { value: 'DDD', label: 'D', key: 'D' },
        ]);
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
      }
    );
  });
};

export default testCreatingEnum;
