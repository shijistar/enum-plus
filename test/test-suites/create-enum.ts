import type { EnumInit } from '@enum-plus';
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
import type TestEngineBase from '../engines/base';
import { toPlainEnums } from '../utils';

const testCreatingEnum = (engine: TestEngineBase) => {
  engine.describe('Create Enum using static init data', () => {
    engine.test(
      'Should be created with standard init data',
      ({ EnumPlus: { Enum }, WeekConfig: { StandardWeekConfig, locales } }) => {
        const weekEnum = Enum(StandardWeekConfig);
        return { weekEnum, locales };
      },
      ({ weekEnum, locales }) => {
        engine.expect(weekEnum).toBeDefined();
        engine.expect(weekEnum).not.toBeNull();
        engine.expect(weekEnum?.items?.length).toBe(7);
        engine.expect(toPlainEnums(weekEnum.items)).toEqual(getStandardWeekData(locales));
      }
    );

    engine.test(
      'Should be created with number values',
      ({ EnumPlus: { Enum }, WeekConfig: { WeekNumberConfig } }) => {
        const weekEnum = Enum(WeekNumberConfig);
        return { weekEnum };
      },
      ({ weekEnum }) => {
        engine.expect(toPlainEnums(weekEnum.items)).toEqual(getWeekDataHasKeyHasValueNoLabel());
      }
    );

    engine.test(
      'Should be created with string values',
      ({ EnumPlus: { Enum }, WeekConfig: { WeekStringConfig } }) => {
        const weekEnum = Enum(WeekStringConfig);
        return { weekEnum };
      },
      ({ weekEnum }) => {
        engine.expect(toPlainEnums(weekEnum.items)).toEqual(getWeekDataHasKeyEmptyObjectValueNoLabel());
      }
    );

    engine.test(
      'Should be created with value-only config',
      ({ EnumPlus: { Enum }, WeekConfig: { WeekValueOnlyConfig } }) => {
        const weekEnum = Enum(WeekValueOnlyConfig);
        return { weekEnum };
      },
      ({ weekEnum }) => {
        engine.expect(toPlainEnums(weekEnum.items)).toEqual(getWeekDataHasKeyHasValueNoLabel());
      }
    );

    engine.test(
      'Should be created with label-only config',
      ({ EnumPlus: { Enum }, WeekConfig: { locales, WeekLabelOnlyConfig } }) => {
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
        };
      },
      ({ weekEnum, weekWithEmptyLabel, locales }) => {
        engine.expect(toPlainEnums(weekEnum.items)).toEqual(getWeekDataHasKeyNoValueHasLabel(locales));
        engine.expect(toPlainEnums(weekWithEmptyLabel.items)).toEqual(getWeekDataHasKeyEmptyObjectValueNoLabel());
      }
    );

    engine.test(
      'Should be created with compact config',
      ({ EnumPlus: { Enum }, WeekConfig: { WeekCompactConfig, WeekEmptyConfig } }) => {
        const weekEnum = Enum(WeekCompactConfig);
        const weekEnum2 = Enum(WeekEmptyConfig);
        return { weekEnum, weekEnum2 };
      },
      ({ weekEnum, weekEnum2 }) => {
        engine.expect(toPlainEnums(weekEnum.items)).toEqual(getWeekDataHasKeyEmptyObjectValueNoLabel());
        engine.expect(toPlainEnums(weekEnum2.items)).toEqual(getWeekDataHasKeyEmptyObjectValueNoLabel());
      }
    );

    engine.test(
      'Should be created with boolean values',
      ({ EnumPlus: { Enum }, WeekConfig: { locales, BooleanStandardConfig } }) => {
        const weekEnum = Enum(BooleanStandardConfig);
        return { weekEnum, locales };
      },
      ({ weekEnum, locales }) => {
        engine.expect(toPlainEnums(weekEnum.items)).toEqual(getStandardBooleanData(locales));
      }
    );

    engine.test(
      'Should be created with date values',
      ({ EnumPlus: { Enum }, WeekConfig: { locales, DateStandardConfig } }) => {
        const weekEnum = Enum(DateStandardConfig);
        return { weekEnum, locales };
      },
      ({ weekEnum, locales }) => {
        engine.expect(toPlainEnums(weekEnum.items)).toEqual(getStandardDateData(locales));
      }
    );

    engine.test(
      'Should be created with empty config',
      ({ EnumPlus: { Enum } }) => {
        const weekEnum = Enum({});
        return { weekEnum };
      },
      ({ weekEnum }) => {
        engine.expect(weekEnum.items.length).toBe(0);
      }
    );

    engine.test(
      'Should be created with undefined',
      ({ EnumPlus: { Enum } }) => {
        const weekEnum = Enum(undefined as unknown as EnumInit);
        return { weekEnum };
      },
      ({ weekEnum }) => {
        engine.expect(weekEnum.items.length).toBe(0);
      }
    );

    engine.test(
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
        engine
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .expect(toPlainEnums(regexpEnum.items))
          .toEqual([{ key: 'foo', value: /\sregexp\s/, label: 'foo' }]);
        engine.expect(toPlainEnums(dateEnum.items)).toEqual([{ key: 'foo', value: date, label: 'foo' }]);
      }
    );

    engine.test(
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
        engine.expect(error).toBeDefined();
      }
    );
  });

  engine.describe('Create Enum with dynamic array', () => {
    engine.test(
      'Should have a return',
      ({ EnumPlus: { Enum }, WeekConfig: { WeekStandardArray } }) => {
        const weekEnum = Enum(WeekStandardArray);
        return { weekEnum };
      },
      ({ weekEnum }) => {
        engine.expect(weekEnum).toBeDefined();
        engine.expect(weekEnum).not.toBeNull();
        engine.expect(weekEnum?.items?.length).toBe(7);
      }
    );

    engine.test(
      'Should be created with standard array',
      ({ EnumPlus: { Enum }, WeekConfig: { locales, WeekStandardArray } }) => {
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
        return { weekEnum, weekWithDefaultFields, weekWithFieldFunctions, locales };
      },
      ({ weekEnum, weekWithDefaultFields, weekWithFieldFunctions, locales }) => {
        engine.expect(toPlainEnums(weekWithDefaultFields.items)).toEqual(getStandardWeekData(locales));
        engine.expect(toPlainEnums(weekEnum.items)).toEqual(getStandardWeekData(locales));
        engine.expect(toPlainEnums(weekWithFieldFunctions.items)).toEqual(getStandardWeekData(locales));
      }
    );

    engine.test(
      'Should be created with standard items array, but without providing getKey',
      ({ EnumPlus: { Enum }, WeekConfig: { locales, WeekStandardArray } }) => {
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
        return { weekEnum, weekWithDefaultKey, locales };
      },
      ({ weekEnum, weekWithDefaultKey, locales }) => {
        engine.expect(toPlainEnums(weekEnum.items)).toEqual(getWeekDataHasValueHasLabelNoKey(locales));
        engine.expect(toPlainEnums(weekWithDefaultKey.items)).toEqual(getStandardWeekData(locales));
      }
    );

    engine.test(
      'Should be created with standard items array, but without providing getLabel',
      ({ EnumPlus: { Enum }, WeekConfig: { locales, WeekStandardArray } }) => {
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
        };
      },
      ({ weekEnum, weekWithDefaultLabel, locales }) => {
        engine.expect(toPlainEnums(weekEnum.items)).toEqual(getWeekDataHasKeyHasValueNoLabel());
        engine.expect(toPlainEnums(weekWithDefaultLabel.items)).toEqual(getStandardWeekData(locales));
      }
    );

    engine.test(
      'Should be created with standard items array, but without providing getKey and getLabel',
      ({ EnumPlus: { Enum }, WeekConfig: { WeekStandardArray } }) => {
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
        return { weekEnum, weekWithNoting };
      },
      ({ weekEnum, weekWithNoting }) => {
        engine.expect(toPlainEnums(weekEnum.items)).toEqual(getWeekDataHasValueNoKeyNoLabel());
        engine.expect(toPlainEnums(weekWithNoting.items)).toEqual([
          {
            key: 'undefined', // why 'undefined' string? key is always in string form, even it's undefined.
            value:
              'undefined' /* Why string 'undefined' too? the enum value is undefined, then fallback to [key], so its value is equal to the key */,
            label: undefined,
          },
        ]);
      }
    );

    engine.test(
      'enums.raw should return the raw array used to initialize the enums',
      ({ EnumPlus: { Enum }, WeekConfig: { StandardWeekConfig } }) => {
        const WeekConfig = StandardWeekConfig;
        const weekEnum = Enum(WeekConfig);
        return { weekEnum, WeekConfig };
      },
      ({ weekEnum, WeekConfig }) => {
        engine.expect(weekEnum.raw()).toStrictEqual(WeekConfig);
        engine.expect(weekEnum.raw(0)).toStrictEqual(WeekConfig.Sunday);
        engine.expect(weekEnum.raw('Sunday')).toStrictEqual(WeekConfig.Sunday);
        engine.expect(weekEnum.raw(6)).toStrictEqual(WeekConfig.Saturday);
        engine.expect(weekEnum.raw('Saturday')).toStrictEqual(WeekConfig.Saturday);
        engine.expect(weekEnum.raw(7)).toBeUndefined();
        engine.expect(weekEnum.raw('Saturday').status).toEqual('error');
        engine.expect(weekEnum.raw('Monday').status).toEqual('warning');
        engine.expect(weekEnum.raw('Friday').status).toEqual('success');
      }
    );
  });

  engine.describe('Create Enum with native enum', () => {
    engine.test(
      'Should be created with native enums, and the key and value should be consistent with the native enum',
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
        engine.expect(toPlainEnums(firstSeedEnum.items)).toEqual([
          { value: 1, label: 'A', key: 'A' },
          { value: 2, label: 'B', key: 'B' },
          { value: 3, label: 'C', key: 'C' },
        ]);
        engine.expect(toPlainEnums(noneInitializer.items)).toEqual([
          { value: 0, label: 'A', key: 'A' },
          { value: 1, label: 'B', key: 'B' },
          { value: 2, label: 'C', key: 'C' },
        ]);
        engine.expect(toPlainEnums(withDiffInitializer.items)).toEqual([
          { value: 0, label: 'A', key: 'A' },
          { value: 1, label: 'B', key: 'B' },
          { value: 2, label: 'C', key: 'C' },
          { value: 5, label: 'D', key: 'D' },
          { value: 6, label: 'E', key: 'E' },
        ]);
        engine.expect(toPlainEnums(withDiffInitializer2.items)).toEqual([
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

    engine.test(
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
        engine.expect(toPlainEnums(stringIncrement.items)).toEqual([
          { value: 'AAA', label: 'A', key: 'A' },
          { value: 1, label: 'B', key: 'B' },
          { value: 2, label: 'C', key: 'C' },
        ]);
        engine.expect(toPlainEnums(mixed.items)).toEqual([
          { value: 0, label: 'A', key: 'A' },
          { value: 0, label: 'B', key: 'B' },
          { value: 1, label: 'C', key: 'C' },
          { value: 'DDD', label: 'D', key: 'D' },
        ]);
        engine.expect(toPlainEnums(mixed2.items)).toEqual([
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
