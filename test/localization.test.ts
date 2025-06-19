import { defaultLocalize, Enum } from '@enum-plus';
import { type IEnum } from '@enum-plus/types';
import { genSillyLocalizer, localeCN, localeEN, noLocale, setLang, StandardWeekConfig } from './data/week-config';
import { getStandardWeekData } from './data/week-data';
import { getOptionsData, pickArray } from './utils';

describe('should support localization', () => {
  test('should show English by default', () => {
    const weekEnum = Enum(StandardWeekConfig);
    testEnum(weekEnum, localeEN);
    testBuiltInResources(weekEnum, localeEN);
  });

  test('should show Chinese after changing lang', () => {
    setLang('zh-CN');
    const weekEnum = Enum(StandardWeekConfig);
    testEnum(weekEnum, localeCN);
    testBuiltInResources(weekEnum, localeCN);
  });

  test('should show English after changing back', () => {
    setLang('en-US');
    const weekEnum = Enum(StandardWeekConfig);
    testEnum(weekEnum, localeEN);
    testBuiltInResources(weekEnum, localeEN);
  });

  test('should show original label if no localization found', () => {
    setLang(undefined);
    const weekEnum = Enum(StandardWeekConfig);
    testEnum(weekEnum, noLocale);
    testBuildInResourcesWithDefaultImp(weekEnum);
  });

  test('should show original label if Enum.localize is explicitly set to undefined ', () => {
    setLang(undefined);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Enum.localize = undefined as any;
    const weekEnum = Enum(StandardWeekConfig);
    testEnum(weekEnum, noLocale);
    testBuiltInResources(weekEnum, noLocale);
  });

  test('should respect Enum options over global setting (Chinese over English)', () => {
    setLang('en-US');
    const weekEnum = Enum(StandardWeekConfig, { localize: genSillyLocalizer('zh-CN') });
    testEnum(weekEnum, localeCN);
    testBuiltInResources(weekEnum, localeCN);
  });
  test('should respect Enum options over global setting (undefined over English)', () => {
    setLang('en-US');
    const weekEnum = Enum(StandardWeekConfig, { localize: undefined });
    testEnum(weekEnum, localeEN);
    testBuiltInResources(weekEnum, localeEN);
  });
  test('should respect Enum options over global setting (undefined over English), support delayed assign', () => {
    setLang(undefined);
    const weekEnum = Enum(StandardWeekConfig, { localize: undefined });
    setLang('en-US');
    testEnum(weekEnum, localeEN);
    testBuiltInResources(weekEnum, localeEN);
  });
  test('should respect Enum options over global setting (Chinese over undefined)', () => {
    setLang(undefined);
    const weekEnum = Enum(StandardWeekConfig, { localize: genSillyLocalizer('zh-CN') });
    testEnum(weekEnum, localeCN);
    testBuiltInResources(weekEnum, localeCN);
  });
  test('should respect Enum options over global setting (both undefined)', () => {
    setLang(undefined);
    const weekEnum = Enum(StandardWeekConfig, { localize: undefined });
    testEnum(weekEnum, noLocale);
    testBuildInResourcesWithDefaultImp(weekEnum);
  });
  test('should respect Enum options over global setting (both explicit undefined)', () => {
    setLang(undefined);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Enum.localize = undefined as any;
    const weekEnum = Enum(StandardWeekConfig, { localize: undefined });
    testEnum(weekEnum, noLocale);
    testBuiltInResources(weekEnum, noLocale);
  });

  test('Enum name should allow normal text', () => {
    const weekEnumWithoutName = Enum(StandardWeekConfig);
    const weekEnum = Enum(StandardWeekConfig, { name: 'Week Days' });
    expect(weekEnumWithoutName.name).toBe(undefined);
    expect(weekEnum.name).toBe('Week Days');
  });
  test('Enum name should support global localization (English)', () => {
    setLang('en-US');
    const weekEnumWithoutName = Enum(StandardWeekConfig);
    const weekEnum = Enum(StandardWeekConfig, { name: 'weekDay.name' });
    expect(weekEnumWithoutName.name).toBe(undefined);
    expect(weekEnum.name).toBe(localeEN['weekDay.name']);
  });
  test('Enum name should support global localization (Chinese)', () => {
    setLang('zh-CN');
    const weekEnumWithoutName = Enum(StandardWeekConfig);
    const weekEnum = Enum(StandardWeekConfig, { name: 'weekDay.name' });
    expect(weekEnumWithoutName.name).toBe(undefined);
    expect(weekEnum.name).toBe(localeCN['weekDay.name']);
  });
  test('Enum name should support global localization (No Locale)', () => {
    setLang(undefined);
    const weekEnumWithoutName = Enum(StandardWeekConfig);
    const weekEnum = Enum(StandardWeekConfig, { name: 'weekDay.name' });
    expect(weekEnumWithoutName.name).toBe(undefined);
    expect(weekEnum.name).toBe(noLocale['weekDay.name']);
  });
  test('Enum name should support custom localization (English)', () => {
    const weekEnum = Enum(StandardWeekConfig, { localize: genSillyLocalizer('en-US'), name: 'weekDay.name' });
    expect(weekEnum.name).toBe(localeEN['weekDay.name']);
  });
  test('Enum name should support custom localization (Chinese)', () => {
    const weekEnum = Enum(StandardWeekConfig, { localize: genSillyLocalizer('zh-CN'), name: 'weekDay.name' });
    expect(weekEnum.name).toBe(localeCN['weekDay.name']);
  });
  test('Enum name should support custom localization (No Locale)', () => {
    const weekEnum = Enum(StandardWeekConfig, { localize: genSillyLocalizer(undefined), name: 'weekDay.name' });
    expect(weekEnum.name).toBe(noLocale['weekDay.name']);
  });
});

function testEnum(
  weekEnum: IEnum<
    typeof StandardWeekConfig,
    keyof typeof StandardWeekConfig,
    (typeof StandardWeekConfig)[keyof typeof StandardWeekConfig]['value']
  >,
  locales: typeof localeEN | typeof localeCN | typeof noLocale
) {
  const sunday = weekEnum.values[0];
  expect(sunday.label).toBe(locales.Sunday);
  expect(sunday.toString()).toBe(locales.Sunday);
  expect(sunday.toLocaleString()).toBe(locales.Sunday);
  expect(getOptionsData(weekEnum.values)).toEqual(pickArray(getStandardWeekData(locales), ['label', 'value']));
  expect(getOptionsData(weekEnum.toSelect())).toEqual(pickArray(getStandardWeekData(locales), ['label', 'value']));
  expect(Array.from(weekEnum.toMenu())).toEqual(
    pickArray(getStandardWeekData(locales), ['label', 'value']).map((item) => ({
      key: item.value,
      label: item.label,
    }))
  );
  expect(Array.from(weekEnum.toFilter())).toEqual(
    pickArray(getStandardWeekData(locales), ['label', 'value']).map((item) => ({
      value: item.value,
      text: item.label,
    }))
  );
  expect(weekEnum.toValueMap()).toEqual(
    getStandardWeekData(locales).reduce(
      (acc, item) => {
        acc[item.value] = { text: item.label };
        return acc;
      },
      {} as Record<number, { text: string | undefined }>
    )
  );
}

function testBuiltInResources(
  weekEnum: IEnum<
    typeof StandardWeekConfig,
    keyof typeof StandardWeekConfig,
    (typeof StandardWeekConfig)[keyof typeof StandardWeekConfig]['value']
  >,
  locales: typeof localeEN | typeof localeCN | typeof noLocale
) {
  const withDefaultFirstOption = weekEnum.toSelect({ firstOption: true });
  expect(withDefaultFirstOption).toHaveLength(8);
  expect(withDefaultFirstOption[0]).toEqual({
    value: '',
    key: '',
    label: locales['enum-plus.options.all'],
  });
}

function testBuildInResourcesWithDefaultImp(
  weekEnum: IEnum<
    typeof StandardWeekConfig,
    keyof typeof StandardWeekConfig,
    (typeof StandardWeekConfig)[keyof typeof StandardWeekConfig]['value']
  >
) {
  const withDefaultFirstOption = weekEnum.toSelect({ firstOption: true });
  expect(withDefaultFirstOption).toHaveLength(8);
  expect(withDefaultFirstOption[0]).toEqual({
    value: '',
    key: '',
    label: defaultLocalize('enum-plus.options.all'),
  });
}
