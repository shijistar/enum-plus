import type { defaultLocalize as defaultLocalizeInterface } from '@enum-plus';
import type { IEnum } from '@enum-plus/types';
import type TestAdapterBase from 'test/adapter-one/base';
import type { localeCN, localeEN, noLocale, StandardWeekConfig } from '../data/week-config';
import type { getStandardWeekData as getStandardWeekDataInterface } from '../data/week-data';
import { getOptionsData, pickArray } from '../utils';

const testLocalization = (adapter: TestAdapterBase) => {
  adapter.describe('Enum localization', () => {
    adapter.test(
      'should show English by default',
      ({
        EnumPlus: { Enum, defaultLocalize },
        WeekConfig: { StandardWeekConfig, setLang, localeEN, getLocales },
        WeekData: { getStandardWeekData },
      }) => {
        setLang('en-US', Enum, getLocales, defaultLocalize);
        const weekEnum = Enum(StandardWeekConfig);
        return { weekEnum, localeEN, getStandardWeekData };
      },
      ({ weekEnum, localeEN, getStandardWeekData }) => {
        assertEnum(weekEnum, localeEN, getStandardWeekData);
        testBuiltInResources(weekEnum, localeEN);
      }
    );

    adapter.test(
      'should show Chinese after changing lang',
      ({
        EnumPlus: { Enum, defaultLocalize },
        WeekConfig: { StandardWeekConfig, setLang, localeCN, getLocales },
        WeekData: { getStandardWeekData },
      }) => {
        setLang('zh-CN', Enum, getLocales, defaultLocalize);
        const weekEnum = Enum(StandardWeekConfig);
        return { weekEnum, localeCN, getStandardWeekData };
      },
      ({ weekEnum, localeCN, getStandardWeekData }) => {
        assertEnum(weekEnum, localeCN, getStandardWeekData);
        testBuiltInResources(weekEnum, localeCN);
      }
    );

    adapter.test(
      'should show English after changing back',
      ({
        EnumPlus: { Enum, defaultLocalize },
        WeekConfig: { StandardWeekConfig, setLang, localeEN, getLocales },
        WeekData: { getStandardWeekData },
      }) => {
        setLang('en-US', Enum, getLocales, defaultLocalize);
        const weekEnum = Enum(StandardWeekConfig);
        return { weekEnum, localeEN, getStandardWeekData };
      },
      ({ weekEnum, localeEN, getStandardWeekData }) => {
        assertEnum(weekEnum, localeEN, getStandardWeekData);
        testBuiltInResources(weekEnum, localeEN);
      }
    );

    adapter.test(
      'should show original label if no localization found',
      ({
        EnumPlus: { Enum, defaultLocalize },
        WeekConfig: { StandardWeekConfig, setLang, noLocale, getLocales },
        WeekData: { getStandardWeekData },
      }) => {
        setLang(undefined, Enum, getLocales, defaultLocalize);
        const weekEnum = Enum(StandardWeekConfig);
        return { weekEnum, defaultLocalize, noLocale, getStandardWeekData };
      },
      ({ weekEnum, defaultLocalize, noLocale, getStandardWeekData }) => {
        assertEnum(weekEnum, noLocale, getStandardWeekData);
        testBuildInResourcesWithDefaultImp(weekEnum, { defaultLocalize });
      }
    );

    adapter.test(
      'should show original label if Enum.localize is explicitly set to undefined ',
      ({
        EnumPlus: { Enum, defaultLocalize },
        WeekConfig: { StandardWeekConfig, setLang, noLocale, getLocales },
        WeekData: { getStandardWeekData },
      }) => {
        setLang(undefined, Enum, getLocales, defaultLocalize);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        Enum.localize = undefined as any;
        const weekEnum = Enum(StandardWeekConfig);
        return { weekEnum, noLocale, getStandardWeekData };
      },
      ({ weekEnum, noLocale, getStandardWeekData }) => {
        assertEnum(weekEnum, noLocale, getStandardWeekData);
        testBuiltInResources(weekEnum, noLocale);
      }
    );

    adapter.test(
      'should respect Enum options over global setting (Chinese over English)',
      ({
        EnumPlus: { Enum, defaultLocalize },
        WeekConfig: { StandardWeekConfig, setLang, localeCN, genSillyLocalizer, getLocales },
        WeekData: { getStandardWeekData },
      }) => {
        setLang('en-US', Enum, getLocales, defaultLocalize);
        const weekEnum = Enum(StandardWeekConfig, {
          localize: genSillyLocalizer('zh-CN', getLocales, defaultLocalize),
        });
        return { weekEnum, localeCN, getStandardWeekData };
      },
      ({ weekEnum, localeCN, getStandardWeekData }) => {
        assertEnum(weekEnum, localeCN, getStandardWeekData);
        testBuiltInResources(weekEnum, localeCN);
      }
    );
    adapter.test(
      'should respect Enum options over global setting (undefined over English)',
      ({
        EnumPlus: { Enum, defaultLocalize },
        WeekConfig: { StandardWeekConfig, setLang, localeEN, getLocales },
        WeekData: { getStandardWeekData },
      }) => {
        setLang('en-US', Enum, getLocales, defaultLocalize);
        const weekEnum = Enum(StandardWeekConfig, { localize: undefined });
        return { weekEnum, localeEN, getStandardWeekData };
      },
      ({ weekEnum, localeEN, getStandardWeekData }) => {
        assertEnum(weekEnum, localeEN, getStandardWeekData);
        testBuiltInResources(weekEnum, localeEN);
      }
    );
    adapter.test(
      'should respect Enum options over global setting (undefined over English), support delayed assign',
      ({
        EnumPlus: { Enum, defaultLocalize },
        WeekConfig: { StandardWeekConfig, setLang, localeEN, getLocales },
        WeekData: { getStandardWeekData },
      }) => {
        setLang(undefined, Enum, getLocales, defaultLocalize);
        const weekEnum = Enum(StandardWeekConfig, { localize: undefined });
        setLang('en-US', Enum, getLocales, defaultLocalize);
        return { weekEnum, localeEN, getStandardWeekData };
      },
      ({ weekEnum, localeEN, getStandardWeekData }) => {
        assertEnum(weekEnum, localeEN, getStandardWeekData);
        testBuiltInResources(weekEnum, localeEN);
      }
    );
    adapter.test(
      'should respect Enum options over global setting (Chinese over undefined)',
      ({
        EnumPlus: { Enum, defaultLocalize },
        WeekConfig: { StandardWeekConfig, setLang, localeCN, genSillyLocalizer, getLocales },
        WeekData: { getStandardWeekData },
      }) => {
        setLang(undefined, Enum, getLocales, defaultLocalize);
        const weekEnum = Enum(StandardWeekConfig, {
          localize: genSillyLocalizer('zh-CN', getLocales, defaultLocalize),
        });
        return { weekEnum, localeCN, getStandardWeekData };
      },
      ({ weekEnum, localeCN, getStandardWeekData }) => {
        assertEnum(weekEnum, localeCN, getStandardWeekData);
        testBuiltInResources(weekEnum, localeCN);
      }
    );
    adapter.test(
      'should respect Enum options over global setting (both undefined)',
      ({
        EnumPlus: { Enum, defaultLocalize },
        WeekConfig: { StandardWeekConfig, setLang, noLocale, getLocales },
        WeekData: { getStandardWeekData },
      }) => {
        setLang(undefined, Enum, getLocales, defaultLocalize);
        const weekEnum = Enum(StandardWeekConfig, { localize: undefined });
        return { weekEnum, defaultLocalize, noLocale, getStandardWeekData };
      },
      ({ weekEnum, defaultLocalize, noLocale, getStandardWeekData }) => {
        assertEnum(weekEnum, noLocale, getStandardWeekData);
        testBuildInResourcesWithDefaultImp(weekEnum, { defaultLocalize });
      }
    );
    adapter.test(
      'should respect Enum options over global setting (both explicit undefined)',
      ({
        EnumPlus: { Enum, defaultLocalize },
        WeekConfig: { StandardWeekConfig, setLang, noLocale, getLocales },
        WeekData: { getStandardWeekData },
      }) => {
        setLang(undefined, Enum, getLocales, defaultLocalize);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        Enum.localize = undefined as any;
        const weekEnum = Enum(StandardWeekConfig, { localize: undefined });
        return { weekEnum, noLocale, getStandardWeekData };
      },
      ({ weekEnum, noLocale, getStandardWeekData }) => {
        assertEnum(weekEnum, noLocale, getStandardWeekData);
        testBuiltInResources(weekEnum, noLocale);
      }
    );
  });

  function assertEnum(
    weekEnum: IEnum<
      typeof StandardWeekConfig,
      keyof typeof StandardWeekConfig,
      (typeof StandardWeekConfig)[keyof typeof StandardWeekConfig]['value']
    >,
    locales: typeof localeEN | typeof localeCN | typeof noLocale,
    getStandardWeekData: typeof getStandardWeekDataInterface
  ) {
    const sunday = weekEnum.items[0];
    adapter.expect(sunday.label).toBe(locales.Sunday);
    adapter.expect(sunday.toString()).toBe(locales.Sunday);
    adapter.expect(sunday.toLocaleString()).toBe(locales.Sunday);
    adapter.expect(getOptionsData(weekEnum.items)).toEqual(pickArray(getStandardWeekData(locales), ['label', 'value']));
    adapter
      .expect(getOptionsData(weekEnum.toSelect()))
      .toEqual(pickArray(getStandardWeekData(locales), ['label', 'value']));
    adapter.expect(Array.from(weekEnum.toMenu())).toEqual(
      pickArray(getStandardWeekData(locales), ['label', 'value']).map((item) => ({
        key: item.value,
        label: item.label,
      }))
    );
    adapter.expect(Array.from(weekEnum.toFilter())).toEqual(
      pickArray(getStandardWeekData(locales), ['label', 'value']).map((item) => ({
        value: item.value,
        text: item.label,
      }))
    );
    adapter.expect(weekEnum.toValueMap()).toEqual(
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
    adapter.expect(withDefaultFirstOption).toHaveLength(8);
    adapter.expect(withDefaultFirstOption[0]).toEqual({
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
    >,
    { defaultLocalize }: { defaultLocalize: typeof defaultLocalizeInterface }
  ) {
    const withDefaultFirstOption = weekEnum.toSelect({ firstOption: true });
    adapter.expect(withDefaultFirstOption).toHaveLength(8);
    adapter.expect(withDefaultFirstOption[0]).toEqual({
      value: '',
      key: '',
      label: defaultLocalize('enum-plus.options.all'),
    });
  }
};

export default testLocalization;
