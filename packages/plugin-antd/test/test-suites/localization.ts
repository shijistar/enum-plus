import type { IEnum } from '@enum-plus';
import type { localeCN, localeEN, noLocale, StandardWeekConfig } from '../../../../test/data/week-config';
import type { getStandardWeekData as getStandardWeekDataInterface } from '../../../../test/data/week-data';
import type TestEngineBase from '../../../../test/engines/base';
import { pickArray } from '../../../../test/utils/index';
import type { ColumnFilterItem } from '../../src/toFilter';
import type { MenuItemOption } from '../../src/toMenu';
import type { SelectItem } from '../../src/toSelect';
import type { ValueMap } from '../../src/toValueMap';

const testLocalization = (engine: TestEngineBase) => {
  engine.describe('Enum localization', () => {
    engine.test(
      'Should show English by default',
      ({
        EnumPlus: { Enum, defaultLocalize },
        WeekConfig: { StandardWeekConfig, setLang, localeEN, getLocales },
        WeekData: { getStandardWeekData },
      }) => {
        setLang('en-US', Enum, getLocales, defaultLocalize);
        const weekEnum = Enum(StandardWeekConfig);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return { ...getEnumTestData(weekEnum as any), locales: localeEN, getStandardWeekData };
      },
      (args) => assertEnum(args)
    );

    engine.test(
      'Should show Chinese after changing lang',
      ({
        EnumPlus: { Enum, defaultLocalize },
        WeekConfig: { StandardWeekConfig, setLang, localeCN, getLocales },
        WeekData: { getStandardWeekData },
      }) => {
        setLang('zh-CN', Enum, getLocales, defaultLocalize);
        const weekEnum = Enum(StandardWeekConfig);
        return { ...getEnumTestData(weekEnum), locales: localeCN, getStandardWeekData };
      },
      (args) => assertEnum(args)
    );

    engine.test(
      'Should show English after changing back',
      ({
        EnumPlus: { Enum, defaultLocalize },
        WeekConfig: { StandardWeekConfig, setLang, localeEN, getLocales },
        WeekData: { getStandardWeekData },
      }) => {
        setLang('en-US', Enum, getLocales, defaultLocalize);
        const weekEnum = Enum(StandardWeekConfig);
        return { ...getEnumTestData(weekEnum), locales: localeEN, getStandardWeekData };
      },
      (args) => assertEnum(args)
    );

    engine.test(
      'Should show original label if no localization found',
      ({
        EnumPlus: { Enum, defaultLocalize },
        WeekConfig: { StandardWeekConfig, setLang, noLocale, getLocales },
        WeekData: { getStandardWeekData },
      }) => {
        setLang(undefined, Enum, getLocales, defaultLocalize);
        const weekEnum = Enum(StandardWeekConfig);
        return { ...getEnumTestData(weekEnum), getStandardWeekData, locales: noLocale };
      },
      (args) => assertEnum(args)
    );

    engine.test(
      'Should show original label if Enum.localize is explicitly set to undefined ',
      ({
        EnumPlus: { Enum, defaultLocalize },
        WeekConfig: { StandardWeekConfig, setLang, noLocale, getLocales },
        WeekData: { getStandardWeekData },
      }) => {
        setLang(undefined, Enum, getLocales, defaultLocalize);
        Enum.localize = undefined!;
        const weekEnum = Enum(StandardWeekConfig);
        return { ...getEnumTestData(weekEnum), getStandardWeekData, locales: noLocale };
      },
      (args) => assertEnum(args)
    );

    engine.test(
      'Should respect Enum options over global setting (Chinese over English)',
      ({
        EnumPlus: { Enum, defaultLocalize },
        WeekConfig: { StandardWeekConfig, setLang, localeCN, getLocales, genSillyLocalizer },
        WeekData: { getStandardWeekData },
      }) => {
        setLang('en-US', Enum, getLocales, defaultLocalize);
        const weekEnum = Enum(StandardWeekConfig, {
          localize: genSillyLocalizer('zh-CN', getLocales, defaultLocalize),
        });
        return { ...getEnumTestData(weekEnum), locales: localeCN, getStandardWeekData };
      },
      (args) => assertEnum(args)
    );
    engine.test(
      'Should respect Enum options over global setting (undefined over English)',
      ({
        EnumPlus: { Enum, defaultLocalize },
        WeekConfig: { StandardWeekConfig, setLang, localeEN, getLocales },
        WeekData: { getStandardWeekData },
      }) => {
        setLang('en-US', Enum, getLocales, defaultLocalize);
        const weekEnum = Enum(StandardWeekConfig, { localize: undefined });
        return { ...getEnumTestData(weekEnum), locales: localeEN, getStandardWeekData };
      },
      (args) => assertEnum(args)
    );
    engine.test(
      'Should respect Enum options over global setting (undefined over English), support delayed assign',
      ({
        EnumPlus: { Enum, defaultLocalize },
        WeekConfig: { StandardWeekConfig, setLang, localeEN, getLocales },
        WeekData: { getStandardWeekData },
      }) => {
        setLang(undefined, Enum, getLocales, defaultLocalize);
        const weekEnum = Enum(StandardWeekConfig, { localize: undefined });
        setLang('en-US', Enum, getLocales, defaultLocalize);
        return { ...getEnumTestData(weekEnum), locales: localeEN, getStandardWeekData };
      },
      (args) => assertEnum(args)
    );
    engine.test(
      'Should respect Enum options over global setting (Chinese over undefined)',
      ({
        EnumPlus: { Enum, defaultLocalize },
        WeekConfig: { StandardWeekConfig, setLang, localeCN, getLocales, genSillyLocalizer },
        WeekData: { getStandardWeekData },
      }) => {
        setLang(undefined, Enum, getLocales, defaultLocalize);
        const weekEnum = Enum(StandardWeekConfig, {
          localize: genSillyLocalizer('zh-CN', getLocales, defaultLocalize),
        });
        return { ...getEnumTestData(weekEnum), locales: localeCN, getStandardWeekData };
      },
      (args) => assertEnum(args)
    );
    engine.test(
      'Should respect Enum options over global setting (both undefined)',
      ({
        EnumPlus: { Enum, defaultLocalize },
        WeekConfig: { StandardWeekConfig, setLang, noLocale, getLocales },
        WeekData: { getStandardWeekData },
      }) => {
        setLang(undefined, Enum, getLocales, defaultLocalize);
        const weekEnum = Enum(StandardWeekConfig, { localize: undefined });
        return { ...getEnumTestData(weekEnum), locales: noLocale, getStandardWeekData };
      },
      (args) => assertEnum(args)
    );
    engine.test(
      'Should respect Enum options over global setting (both explicit undefined)',
      ({
        EnumPlus: { Enum, defaultLocalize },
        WeekConfig: { StandardWeekConfig, setLang, noLocale, getLocales },
        WeekData: { getStandardWeekData },
      }) => {
        setLang(undefined, Enum, getLocales, defaultLocalize);
        Enum.localize = undefined!;
        const weekEnum = Enum(StandardWeekConfig, { localize: undefined });
        return { ...getEnumTestData(weekEnum), locales: noLocale, getStandardWeekData };
      },
      (args) => {
        assertEnum(args);
      }
    );
  });

  function getEnumTestData(
    weekEnum: IEnum<
      typeof StandardWeekConfig,
      keyof typeof StandardWeekConfig,
      (typeof StandardWeekConfig)[keyof typeof StandardWeekConfig]['value']
    >
  ) {
    const selectItems = weekEnum.toSelect({ valueField: 'value', labelField: 'label' });
    const selectItemsWithFirst = weekEnum.toSelect({
      firstOption: { value: undefined, label: 'weekDay.name' },
      valueField: 'value',
      labelField: 'label',
    });
    const menuItems = weekEnum.toMenu();
    const filterItems = weekEnum.toFilter();
    const valueMap = weekEnum.toValueMap();
    return { selectItems, selectItemsWithFirst, menuItems, filterItems, valueMap };
  }

  type WeekValue = (typeof StandardWeekConfig)[keyof typeof StandardWeekConfig]['value'];
  function assertEnum(options: {
    selectItems: SelectItem<WeekValue, 'value', 'label'>[];
    selectItemsWithFirst: SelectItem<WeekValue, 'value', 'label'>[];
    menuItems: MenuItemOption<WeekValue>[];
    filterItems: ColumnFilterItem<WeekValue>[];
    valueMap: ValueMap;
    locales: typeof localeEN | typeof localeCN | typeof noLocale;
    getStandardWeekData: typeof getStandardWeekDataInterface;
  }) {
    const { selectItems, selectItemsWithFirst, menuItems, filterItems, valueMap, locales, getStandardWeekData } =
      options;
    engine.expect(selectItems).toEqual(pickArray(getStandardWeekData(locales), ['label', 'value']));
    engine.expect(selectItemsWithFirst).toEqual([
      {
        label: locales['weekDay.name'],
        value: undefined,
      },
      ...pickArray(getStandardWeekData(locales), ['label', 'value']),
    ]);
    engine.expect(menuItems).toEqual(
      pickArray(getStandardWeekData(locales), ['label', 'value']).map((item) => ({
        key: item.value,
        label: item.label,
      }))
    );
    engine.expect(filterItems).toEqual(
      pickArray(getStandardWeekData(locales), ['label', 'value']).map((item) => ({
        value: item.value,
        text: item.label,
      }))
    );
    engine.expect(valueMap).toEqual(
      getStandardWeekData(locales).reduce(
        (acc, item) => {
          acc[item.value] = { text: item.label };
          return acc;
        },
        {} as Record<number, { text: string | undefined }>
      )
    );
  }
};

export default testLocalization;
