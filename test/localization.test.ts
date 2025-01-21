import { Enum, type IEnum } from '../src';
import {
  genSillyLocalizer,
  localeCN,
  localeEN,
  noLocale,
  setLang,
  StandardWeekConfig,
} from './data/week-config';
import { getStandardWeekData } from './data/week-data';
import { getOptionsData, pickArray } from './utils';

describe('should support localization', () => {
  test('should show English by default', () => {
    const weekEnum = Enum(StandardWeekConfig);
    testEnum(weekEnum, localeEN);
  });

  test('should show Chinese after changing lang', () => {
    setLang('zh-CN');
    const weekEnum = Enum(StandardWeekConfig);
    testEnum(weekEnum, localeCN);
  });

  test('should show English after changing back', () => {
    setLang('en-US');
    const weekEnum = Enum(StandardWeekConfig);
    testEnum(weekEnum, localeEN);
  });

  test('should show original label if no localization found', () => {
    setLang(undefined);
    const weekEnum = Enum(StandardWeekConfig);
    testEnum(weekEnum, noLocale);
  });

  test('should respect Enum options over global setting (Chinese over English)', () => {
    setLang('en-US');
    const weekEnum = Enum(StandardWeekConfig, { localize: genSillyLocalizer('zh-CN') });
    testEnum(weekEnum, localeCN);
  });
  test('should respect Enum options over global setting (undefined over English)', () => {
    setLang('en-US');
    const weekEnum = Enum(StandardWeekConfig, { localize: undefined });
    testEnum(weekEnum, localeEN);
  });
  test('should respect Enum options over global setting (Chinese over undefined)', () => {
    setLang(undefined);
    const weekEnum = Enum(StandardWeekConfig, { localize: genSillyLocalizer('zh-CN') });
    testEnum(weekEnum, localeCN);
  });
  test('should respect Enum options over global setting (both undefined)', () => {
    setLang(undefined);
    const weekEnum = Enum(StandardWeekConfig, { localize: undefined });
    testEnum(weekEnum, noLocale);
  });
});

function testEnum(
  weekEnum: IEnum<
    typeof StandardWeekConfig,
    keyof typeof StandardWeekConfig,
    typeof StandardWeekConfig[keyof typeof StandardWeekConfig]['value']
  >,
  locales: typeof localeEN | typeof localeCN | typeof noLocale
) {
  const sunday = weekEnum.values[0];
  expect(sunday.label).toBe(locales.Sunday);
  expect(sunday.toString()).toBe(locales.Sunday);
  expect(sunday.toLocaleString()).toBe(locales.Sunday);
  expect(getOptionsData(weekEnum.values)).toEqual(
    pickArray(getStandardWeekData(locales), ['label', 'value'])
  );
  expect(getOptionsData(weekEnum.options())).toEqual(
    pickArray(getStandardWeekData(locales), ['label', 'value'])
  );
  expect(weekEnum.menus()).toEqual(
    pickArray(getStandardWeekData(locales), ['label', 'value']).map((item) => ({
      key: item.value,
      label: item.label,
    }))
  );
  expect(weekEnum.filters()).toEqual(
    pickArray(getStandardWeekData(locales), ['label', 'value']).map((item) => ({
      value: item.value,
      text: item.label,
    }))
  );
  expect(weekEnum.valuesEnum()).toEqual(
    getStandardWeekData(locales).reduce((acc, item) => {
      acc[item.value] = { text: item.label };
      return acc;
    }, {} as Record<number, { text: string | undefined }>)
  );
}