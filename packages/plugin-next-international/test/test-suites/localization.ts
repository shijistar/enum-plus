import type { EnumInterface, IEnum } from '@enum-plus';
import type { localeCN, localeEN, noLocale, StandardWeekConfig } from '@enum-plus/test/data/week-config';
import type TestEngineBase from '@enum-plus/test/engines/base';
import { serverI18nPlugin } from '../../src/index';
import { getAltData } from '../data/altLocale';
import { i18n } from '../data/initServerInstance';

const testLocalization = (engine: TestEngineBase<'jest'>) => {
  engine.describe('Enum localization', () => {
    engine.test(
      'Should show English by default',
      ({ EnumPlus: { Enum }, WeekConfig: { StandardWeekConfig, localeEN, noLocale } }) => {
        Enum.install(serverI18nPlugin, {
          localize: i18n,
        });
        return {
          ...getAssertData({
            Enum,
            StandardWeekConfig,
            locales: localeEN,
            noLocale,
          }),
        };
      },
      (args) => assertEnum(args)
    );

    // engine.test(
    //   'Should show Chinese after changing lang',
    //   ({ EnumPlus: { Enum }, WeekConfig: { StandardWeekConfig, localeCN, noLocale } }) => {
    //     Enum.install(serverI18nPlugin);
    //     i18n.getI18n('zh-CN');
    //     return {
    //       ...getAssertData({
    //         Enum,
    //         StandardWeekConfig,
    //         locales: localeCN,
    //         noLocale,
    //       }),
    //     };
    //   },
    //   (args) => assertEnum(args)
    // );

    // engine.test(
    //   'Should show English after changing back',
    //   ({ EnumPlus: { Enum }, WeekConfig: { StandardWeekConfig, localeEN, noLocale } }) => {
    //     Enum.install(serverI18nPlugin);
    //     changeLanguage('en');
    //     return {
    //       ...getAssertData({
    //         Enum,
    //         StandardWeekConfig,
    //         locales: localeEN,
    //         noLocale,
    //       }),
    //     };
    //   },
    //   (args) => assertEnum(args)
    // );
  });

  function getAssertData(options: {
    Enum: EnumInterface;
    StandardWeekConfig: typeof StandardWeekConfig;
    locales: typeof localeEN | typeof localeCN | typeof noLocale;
    noLocale: typeof noLocale;
  }) {
    const { Enum, StandardWeekConfig, locales, noLocale } = options;
    const weekEnum = Enum(StandardWeekConfig, { name: 'weekDay.name' });
    const altData = getAltData({ locales, StandardWeekConfig });
    const altWeekEnum = Enum(altData.AltStandardWeekConfig, { name: 'alternative:weekDay.name' });
    const Locales = Object.keys(noLocale).reduce(
      (acc, key) => {
        acc[noLocale[key as keyof typeof noLocale]] = (locales as Record<string, string>)[key] as never;
        return acc;
      },
      {} as { -readonly [key in (typeof noLocale)[keyof typeof noLocale]]: string }
    );
    return {
      weekEnum,
      altWeekEnum,
      Locales,
      ...altData,
    };
  }

  type WeekValue = (typeof StandardWeekConfig)[keyof typeof StandardWeekConfig]['value'];
  function assertEnum(
    options: {
      weekEnum: IEnum<typeof StandardWeekConfig, keyof typeof StandardWeekConfig, WeekValue>;
      altWeekEnum: IEnum<
        ReturnType<typeof getAltData>['AltStandardWeekConfig'],
        keyof typeof StandardWeekConfig,
        WeekValue
      >;
      Locales: { -readonly [key in (typeof noLocale)[keyof typeof noLocale]]: string };
    } & ReturnType<typeof getAltData>
  ) {
    const { weekEnum, altWeekEnum, Locales, AltLocales } = options;
    engine.expect(weekEnum.name).toEqual(Locales['weekDay.name']);
    engine.expect(weekEnum.labels).toEqual(Array.from(weekEnum.items).map((item) => Locales[item.raw.label]));

    const sunday = weekEnum.items[0];
    engine.expect(sunday.label).toBe(Locales['weekday.Sunday']);
    engine.expect(sunday.toString()).toBe(Locales['weekday.Sunday']);
    engine.expect(sunday.toLocaleString()).toBe(Locales['weekday.Sunday']);

    engine.expect(altWeekEnum.name).toEqual(AltLocales['alternative:weekDay.name']);
    engine
      .expect(Array.from(altWeekEnum.labels))
      .toEqual(Array.from(altWeekEnum.items).map((item) => AltLocales[item.raw.label as keyof typeof AltLocales]));

    const altSunday = altWeekEnum.items[0];
    engine.expect(altSunday.label).toBe(AltLocales['alternative:weekday.Sunday']);
    engine.expect(altSunday.toString()).toBe(AltLocales['alternative:weekday.Sunday']);
    engine.expect(altSunday.toLocaleString()).toBe(AltLocales['alternative:weekday.Sunday']);
  }
};

export default testLocalization;
