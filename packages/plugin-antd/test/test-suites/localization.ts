import type { IEnum } from '@enum-plus';
import type { StandardWeekConfig } from '@enum-plus/test/data/week-config';
import type { getStandardWeekData as getStandardWeekDataInterface } from '@enum-plus/test/data/week-data';
import type TestEngineBase from '@enum-plus/test/engines/base';
// eslint-disable-next-line import/no-unresolved
import { pickArray } from '@enum-plus/test/utils/index';
import antdPlugins from '../../src/index';
import type { ColumnFilterItem } from '../../src/toFilter';
import type { MenuItemOption } from '../../src/toMenu';
import type { SelectItem } from '../../src/toSelect';
import type { ValueMap } from '../../src/toValueMap';
import type enUS from '@enum-plus/test/i18n/en-US.json';
import type neutral from '@enum-plus/test/i18n/neutral.json';
import type zhCN from '@enum-plus/test/i18n/zh-CN.json';

const testLocalization = (engine: TestEngineBase<'jest'>) => {
  engine.describe('Enum localization', () => {
    engine.test(
      'should show English after setting the language to en-US',
      ({
        EnumPlus: { Enum, defaultLocalize },
        WeekConfig: { StandardWeekConfig, setLang, getLocales },
        WeekData: { getStandardWeekData },
        i18n: { enUS },
      }) => {
        Enum.install(antdPlugins);
        setLang('en-US', Enum, getLocales, defaultLocalize);
        const weekEnum = Enum(StandardWeekConfig);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return { ...getEnumTestData(weekEnum as any), locales: enUS, getStandardWeekData };
      },
      (args) => assertEnum(args),
    );

    engine.test(
      'should show Chinese after changing the language',
      ({
        EnumPlus: { Enum, defaultLocalize },
        WeekConfig: { StandardWeekConfig, setLang, getLocales },
        WeekData: { getStandardWeekData },
        i18n: { zhCN },
      }) => {
        Enum.install(antdPlugins);
        setLang('zh-CN', Enum, getLocales, defaultLocalize);
        const weekEnum = Enum(StandardWeekConfig);
        return { ...getEnumTestData(weekEnum), locales: zhCN, getStandardWeekData };
      },
      (args) => assertEnum(args),
    );

    engine.test(
      'should show English after switching back',
      ({
        EnumPlus: { Enum, defaultLocalize },
        WeekConfig: { StandardWeekConfig, setLang, getLocales },
        WeekData: { getStandardWeekData },
        i18n: { enUS },
      }) => {
        Enum.install(antdPlugins);
        setLang('en-US', Enum, getLocales, defaultLocalize);
        const weekEnum = Enum(StandardWeekConfig);
        return { ...getEnumTestData(weekEnum), locales: enUS, getStandardWeekData };
      },
      (args) => assertEnum(args),
    );

    engine.test(
      'should fall back to the original label when no localization is found',
      ({
        EnumPlus: { Enum, defaultLocalize },
        WeekConfig: { StandardWeekConfig, setLang, getLocales },
        WeekData: { getStandardWeekData },
        i18n: { neutral },
      }) => {
        Enum.install(antdPlugins);
        setLang(undefined, Enum, getLocales, defaultLocalize);
        const weekEnum = Enum(StandardWeekConfig);
        return { ...getEnumTestData(weekEnum), getStandardWeekData, locales: neutral };
      },
      (args) => assertEnum(args),
    );

    engine.test(
      'should fall back to the original label when Enum.localize is explicitly undefined',
      ({
        EnumPlus: { Enum, defaultLocalize },
        WeekConfig: { StandardWeekConfig, setLang, getLocales },
        WeekData: { getStandardWeekData },
        i18n: { neutral },
      }) => {
        Enum.install(antdPlugins);
        setLang(undefined, Enum, getLocales, defaultLocalize);
        Enum.localize = undefined!;
        const weekEnum = Enum(StandardWeekConfig);
        return { ...getEnumTestData(weekEnum), getStandardWeekData, locales: neutral };
      },
      (args) => assertEnum(args),
    );

    engine.test(
      'should prefer Enum options over the global setting (Chinese over English)',
      ({
        EnumPlus: { Enum, defaultLocalize },
        WeekConfig: { StandardWeekConfig, setLang, getLocales, genSillyLocalizer },
        WeekData: { getStandardWeekData },
        i18n: { zhCN },
      }) => {
        Enum.install(antdPlugins);
        setLang('en-US', Enum, getLocales, defaultLocalize);
        const weekEnum = Enum(StandardWeekConfig, {
          localize: genSillyLocalizer('zh-CN', getLocales),
        });
        return { ...getEnumTestData(weekEnum), locales: zhCN, getStandardWeekData };
      },
      (args) => assertEnum(args),
    );
    engine.test(
      'should fall back to the global localizer when Enum localize is undefined',
      ({
        EnumPlus: { Enum, defaultLocalize },
        WeekConfig: { StandardWeekConfig, setLang, getLocales },
        WeekData: { getStandardWeekData },
        i18n: { enUS },
      }) => {
        Enum.install(antdPlugins);
        setLang('en-US', Enum, getLocales, defaultLocalize);
        const weekEnum = Enum(StandardWeekConfig, { localize: undefined });
        return { ...getEnumTestData(weekEnum), locales: enUS, getStandardWeekData };
      },
      (args) => assertEnum(args),
    );
    engine.test(
      'should use a global localizer assigned after Enum creation',
      ({
        EnumPlus: { Enum, defaultLocalize },
        WeekConfig: { StandardWeekConfig, setLang, getLocales },
        WeekData: { getStandardWeekData },
        i18n: { enUS },
      }) => {
        Enum.install(antdPlugins);
        setLang(undefined, Enum, getLocales, defaultLocalize);
        const weekEnum = Enum(StandardWeekConfig, { localize: undefined });
        setLang('en-US', Enum, getLocales, defaultLocalize);
        return { ...getEnumTestData(weekEnum), locales: enUS, getStandardWeekData };
      },
      (args) => assertEnum(args),
    );
    engine.test(
      'should prefer Enum options over the global setting (Chinese over undefined)',
      ({
        EnumPlus: { Enum, defaultLocalize },
        WeekConfig: { StandardWeekConfig, setLang, getLocales, genSillyLocalizer },
        WeekData: { getStandardWeekData },
        i18n: { zhCN },
      }) => {
        Enum.install(antdPlugins);
        setLang(undefined, Enum, getLocales, defaultLocalize);
        const weekEnum = Enum(StandardWeekConfig, {
          localize: genSillyLocalizer('zh-CN', getLocales),
        });
        return { ...getEnumTestData(weekEnum), locales: zhCN, getStandardWeekData };
      },
      (args) => assertEnum(args),
    );
    engine.test(
      'should handle undefined Enum and global localization options',
      ({
        EnumPlus: { Enum, defaultLocalize },
        WeekConfig: { StandardWeekConfig, setLang, getLocales },
        WeekData: { getStandardWeekData },
        i18n: { neutral },
      }) => {
        Enum.install(antdPlugins);
        setLang(undefined, Enum, getLocales, defaultLocalize);
        const weekEnum = Enum(StandardWeekConfig, { localize: undefined });
        return { ...getEnumTestData(weekEnum), locales: neutral, getStandardWeekData };
      },
      (args) => assertEnum(args),
    );
    engine.test(
      'should handle explicitly undefined Enum and global localization options',
      ({
        EnumPlus: { Enum, defaultLocalize },
        WeekConfig: { StandardWeekConfig, setLang, getLocales },
        WeekData: { getStandardWeekData },
        i18n: { neutral },
      }) => {
        Enum.install(antdPlugins);
        setLang(undefined, Enum, getLocales, defaultLocalize);
        Enum.localize = undefined!;
        const weekEnum = Enum(StandardWeekConfig, { localize: undefined });
        return { ...getEnumTestData(weekEnum), locales: neutral, getStandardWeekData };
      },
      (args) => {
        assertEnum(args);
      },
    );
  });

  function getEnumTestData(
    weekEnum: IEnum<
      typeof StandardWeekConfig,
      keyof typeof StandardWeekConfig,
      (typeof StandardWeekConfig)[keyof typeof StandardWeekConfig]['value']
    >,
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
    locales: Readonly<typeof enUS> | Readonly<typeof zhCN> | Readonly<typeof neutral>;
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
      })),
    );
    engine.expect(filterItems).toEqual(
      pickArray(getStandardWeekData(locales), ['label', 'value']).map((item) => ({
        value: item.value,
        text: item.label,
      })),
    );
    engine.expect(valueMap).toEqual(
      getStandardWeekData(locales).reduce(
        (acc, item) => {
          acc[item.value] = { text: item.label };
          return acc;
        },
        {} as Record<number, { text: string | undefined }>,
      ),
    );
  }
};

export default testLocalization;
