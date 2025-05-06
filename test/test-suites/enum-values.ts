import { defaultLocalize, type Enum as EnumType } from '@enum-plus';
import type { IEnumValues } from '@enum-plus/types';
import type TestAdapterBase from 'test/adapter-one/base';
import { getLocales, locales, localizeConfigData, StandardWeekConfig } from '../data/week-config';
import { getStandardWeekData } from '../data/week-data';
import { getOptionsData, pickArray } from '../utils';

const testEnumValues = (adapter: TestAdapterBase, Enum: typeof EnumType) => {
  adapter.describe('The EnumValuesArray api', () => {
    addEnumValuesTestSuite(adapter, Enum(StandardWeekConfig).items);
  });
};

export function addEnumValuesTestSuite(
  adapter: TestAdapterBase,
  weekEnum: IEnumValues<
    typeof StandardWeekConfig,
    keyof typeof StandardWeekConfig,
    (typeof StandardWeekConfig)[keyof typeof StandardWeekConfig]['value']
  >
) {
  adapter.test('enums.label should be able to get enum label by key or value', () => {
    adapter.expect(weekEnum.label(0)).toBe(locales.Sunday);
    adapter.expect(weekEnum.label('Sunday')).toBe(locales.Sunday);
    adapter.expect(weekEnum.label(6)).toBe(locales.Saturday);
    adapter.expect(weekEnum.label('Saturday')).toBe(locales.Saturday);
    adapter.expect(weekEnum.label(7)).toBeUndefined();
  });

  adapter.test('enums.key should be able to get enum key by value', () => {
    adapter.expect(weekEnum.key(0)).toBe('Sunday');
    adapter.expect(weekEnum.key(6)).toBe('Saturday');
    adapter.expect(weekEnum.key(7)).toBeUndefined();
  });

  adapter.test('enums.has should be able to check enum item exist or not', () => {
    adapter.expect(weekEnum.has(0)).toBe(true);
    adapter.expect(weekEnum.has('Sunday')).toBe(true);
    adapter.expect(weekEnum.has(6)).toBe(true);
    adapter.expect(weekEnum.has('Saturday')).toBe(true);
    adapter.expect(weekEnum.has(7)).toBe(false);
  });

  adapter.test('enums.toSelect should generate an object array for AntDesign Select', () => {
    adapter
      .expect(getOptionsData(weekEnum.toSelect()))
      .toEqual(pickArray(getStandardWeekData(locales), ['label', 'value']));
    adapter
      .expect(getOptionsData(weekEnum.toSelect({})))
      .toEqual(pickArray(getStandardWeekData(locales), ['label', 'value']));

    // Add first-option by boolean flag
    const withDefaultFirstOption = weekEnum.toSelect({ firstOption: true });
    adapter.expect(withDefaultFirstOption).toHaveLength(8);
    adapter.expect(withDefaultFirstOption[0]).toEqual({
      value: '',
      key: '',
      label: 'All',
    });

    // Add first-option by boolean flag with custom value
    const customDefaultOption = weekEnum.toSelect({
      firstOption: true,
      firstOptionValue: 99 as 1,
      firstOptionLabel: 'Select All',
    });
    adapter.expect(customDefaultOption).toHaveLength(8);
    adapter.expect(customDefaultOption[0]).toEqual({ value: 99, key: '', label: 'Select All' });

    // Add custom first-option
    const customOption = { value: 99, key: '99', label: 'WeekdayX' };
    const withCustomFirstOption = weekEnum.toSelect({
      firstOption: customOption,
    });
    adapter.expect(withCustomFirstOption[0]).toEqual(customOption);

    // Add custom first-option using value as key
    const customOptionWithoutKey = { value: 99, label: 'WeekdayX' };
    const withCustomFirstOptionUsingValueAsKey = weekEnum.toSelect({
      firstOption: customOptionWithoutKey,
    });
    adapter.expect(withCustomFirstOptionUsingValueAsKey[0]).toEqual({
      ...customOptionWithoutKey,
      key: customOptionWithoutKey.value,
    });
  });

  adapter.test('enums.toValueMap should generate an object array for AntDesignPro', () => {
    adapter.expect(weekEnum.toValueMap()).toEqual(
      Object.values(localizeConfigData(StandardWeekConfig, getLocales, defaultLocalize)).reduce(
        (acc, { value, label }) => {
          acc[value] = { text: label };
          return acc;
        },
        {} as Record<number, { text: string }>
      )
    );
  });

  adapter.test('enums.toMenu should generate an object array for AntDesign Menu', () => {
    adapter.expect(weekEnum.toMenu()).toEqual(
      Object.values(localizeConfigData(StandardWeekConfig, getLocales, defaultLocalize)).map(({ value, label }) => ({
        key: value,
        label: label,
      }))
    );
  });

  adapter.test('enums.toFilter should generate an object array for AntDesign Table', () => {
    adapter.expect(weekEnum.toFilter()).toEqual(
      Object.values(localizeConfigData(StandardWeekConfig, getLocales, defaultLocalize)).map(({ value, label }) => ({
        text: label,
        value,
      }))
    );
  });

  adapter.test('enums.raw should return the raw object used to initialize the Enum', () => {
    const WeekConfig = StandardWeekConfig;
    adapter.expect(weekEnum.raw()).toEqual(WeekConfig);
    adapter.expect(weekEnum.raw(0)).toEqual(WeekConfig.Sunday);
    adapter.expect(weekEnum.raw('Sunday')).toEqual(WeekConfig.Sunday);
    adapter.expect(weekEnum.raw(6)).toEqual(WeekConfig.Saturday);
    adapter.expect(weekEnum.raw('Saturday')).toEqual(WeekConfig.Saturday);
    adapter.expect(weekEnum.raw('Saturday').status).toEqual('error');
    adapter.expect(weekEnum.raw('Monday').status).toEqual('warning');
    adapter.expect(weekEnum.raw('Friday').status).toEqual('success');
    adapter.expect(weekEnum.raw(7)).toBeUndefined();
  });

  adapter.test('enums.valueType should throw error when called at runtime', () => {
    adapter.expect(() => weekEnum.valueType).toThrow();
  });

  adapter.test('enums.keyType should throw error when called at runtime', () => {
    adapter.expect(() => weekEnum.keyType).toThrow();
  });

  adapter.test('enums.rawType should throw error when called at runtime', () => {
    adapter.expect(() => weekEnum.rawType).toThrow();
  });
}

export default testEnumValues;
