import { defaultLocalize } from '@enum-plus';
import { type IEnum } from '@enum-plus/types';
import type TestAdapterBase from 'test/adapter-one/base';
import type { StandardWeekConfig } from '../data/week-config';
import { genSillyLocalizer, localeCN, localeEN, noLocale, setLang } from '../data/week-config';
import { getStandardWeekData } from '../data/week-data';
import { getOptionsData, pickArray } from '../utils';

const testLocalization = (adapter: TestAdapterBase) => {
  adapter.describe('Enum localization', () => {
    adapter.test(
      'should show English by default',
      ({ EnumPlus: { Enum }, WeekConfig: { StandardWeekConfig } }) => {
        const weekEnum = Enum(StandardWeekConfig);
        return { weekEnum };
      },
      ({ weekEnum }) => {
        testEnum(weekEnum, localeEN);
        testBuiltInResources(weekEnum, localeEN);
      }
    );

    adapter.test(
      'should show Chinese after changing lang',
      ({ EnumPlus: { Enum, defaultLocalize }, WeekConfig: { StandardWeekConfig } }) => {
        setLang('zh-CN', Enum, defaultLocalize);
        const weekEnum = Enum(StandardWeekConfig);
        return { weekEnum };
      },
      ({ weekEnum }) => {
        testEnum(weekEnum, localeCN);
        testBuiltInResources(weekEnum, localeCN);
      }
    );

    adapter.test(
      'should show English after changing back',
      ({ EnumPlus: { Enum, defaultLocalize }, WeekConfig: { StandardWeekConfig } }) => {
        setLang('en-US', Enum, defaultLocalize);
        const weekEnum = Enum(StandardWeekConfig);
        return { weekEnum };
      },
      ({ weekEnum }) => {
        testEnum(weekEnum, localeEN);
        testBuiltInResources(weekEnum, localeEN);
      }
    );

    adapter.test(
      'should show original label if no localization found',
      ({ EnumPlus: { Enum, defaultLocalize }, WeekConfig: { StandardWeekConfig } }) => {
        setLang(undefined, Enum, defaultLocalize);
        const weekEnum = Enum(StandardWeekConfig);
        return { weekEnum };
      },
      ({ weekEnum }) => {
        testEnum(weekEnum, noLocale);
        testBuildInResourcesWithDefaultImp(weekEnum);
      }
    );

    adapter.test(
      'should show original label if Enum.localize is explicitly set to undefined ',
      ({ EnumPlus: { Enum, defaultLocalize }, WeekConfig: { StandardWeekConfig } }) => {
        setLang(undefined, Enum, defaultLocalize);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        Enum.localize = undefined as any;
        const weekEnum = Enum(StandardWeekConfig);
        return { weekEnum };
      },
      ({ weekEnum }) => {
        testEnum(weekEnum, noLocale);
        testBuiltInResources(weekEnum, noLocale);
      }
    );

    adapter.test(
      'should respect Enum options over global setting (Chinese over English)',
      ({ EnumPlus: { Enum, defaultLocalize }, WeekConfig: { StandardWeekConfig } }) => {
        setLang('en-US', Enum, defaultLocalize);
        const weekEnum = Enum(StandardWeekConfig, { localize: genSillyLocalizer('zh-CN', defaultLocalize) });
        return { weekEnum };
      },
      ({ weekEnum }) => {
        testEnum(weekEnum, localeCN);
        testBuiltInResources(weekEnum, localeCN);
      }
    );
    adapter.test(
      'should respect Enum options over global setting (undefined over English)',
      ({ EnumPlus: { Enum, defaultLocalize }, WeekConfig: { StandardWeekConfig } }) => {
        setLang('en-US', Enum, defaultLocalize);
        const weekEnum = Enum(StandardWeekConfig, { localize: undefined });
        return { weekEnum };
      },
      ({ weekEnum }) => {
        testEnum(weekEnum, localeEN);
        testBuiltInResources(weekEnum, localeEN);
      }
    );
    adapter.test(
      'should respect Enum options over global setting (undefined over English), support delayed assign',
      ({ EnumPlus: { Enum, defaultLocalize }, WeekConfig: { StandardWeekConfig } }) => {
        setLang(undefined, Enum, defaultLocalize);
        const weekEnum = Enum(StandardWeekConfig, { localize: undefined });
        setLang('en-US', Enum, defaultLocalize);
        return { weekEnum };
      },
      ({ weekEnum }) => {
        testEnum(weekEnum, localeEN);
        testBuiltInResources(weekEnum, localeEN);
      }
    );
    adapter.test(
      'should respect Enum options over global setting (Chinese over undefined)',
      ({ EnumPlus: { Enum, defaultLocalize }, WeekConfig: { StandardWeekConfig } }) => {
        setLang(undefined, Enum, defaultLocalize);
        const weekEnum = Enum(StandardWeekConfig, { localize: genSillyLocalizer('zh-CN', defaultLocalize) });
        return { weekEnum };
      },
      ({ weekEnum }) => {
        testEnum(weekEnum, localeCN);
        testBuiltInResources(weekEnum, localeCN);
      }
    );
    adapter.test(
      'should respect Enum options over global setting (both undefined)',
      ({ EnumPlus: { Enum, defaultLocalize }, WeekConfig: { StandardWeekConfig } }) => {
        setLang(undefined, Enum, defaultLocalize);
        const weekEnum = Enum(StandardWeekConfig, { localize: undefined });
        return { weekEnum };
      },
      ({ weekEnum }) => {
        testEnum(weekEnum, noLocale);
        testBuildInResourcesWithDefaultImp(weekEnum);
      }
    );
    adapter.test(
      'should respect Enum options over global setting (both explicit undefined)',
      ({ EnumPlus: { Enum, defaultLocalize }, WeekConfig: { StandardWeekConfig } }) => {
        setLang(undefined, Enum, defaultLocalize);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        Enum.localize = undefined as any;
        const weekEnum = Enum(StandardWeekConfig, { localize: undefined });
        return { weekEnum };
      },
      ({ weekEnum }) => {
        testEnum(weekEnum, noLocale);
        testBuiltInResources(weekEnum, noLocale);
      }
    );
  });

  function testEnum(
    weekEnum: IEnum<
      typeof StandardWeekConfig,
      keyof typeof StandardWeekConfig,
      (typeof StandardWeekConfig)[keyof typeof StandardWeekConfig]['value']
    >,
    locales: typeof localeEN | typeof localeCN | typeof noLocale
  ) {
    const sunday = weekEnum.items[0];
    adapter.expect(sunday.label).toBe(locales.Sunday);
    adapter.expect(sunday.toString()).toBe(locales.Sunday);
    adapter.expect(sunday.toLocaleString()).toBe(locales.Sunday);
    adapter.expect(getOptionsData(weekEnum.items)).toEqual(pickArray(getStandardWeekData(locales), ['label', 'value']));
    adapter
      .expect(getOptionsData(weekEnum.toSelect()))
      .toEqual(pickArray(getStandardWeekData(locales), ['label', 'value']));
    adapter.expect(weekEnum.toMenu()).toEqual(
      pickArray(getStandardWeekData(locales), ['label', 'value']).map((item) => ({
        key: item.value,
        label: item.label,
      }))
    );
    adapter.expect(weekEnum.toFilter()).toEqual(
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
    >
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
