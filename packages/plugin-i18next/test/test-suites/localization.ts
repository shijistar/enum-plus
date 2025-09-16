import type { EnumInterface, IEnum } from '@enum-plus';
import type { localeCN, localeEN, noLocale, StandardWeekConfig } from '@enum-plus/test/data/week-config';
import type TestEngineBase from '@enum-plus/test/engines/base';
import { changeLanguage, createInstance } from 'i18next';
import rootPlugin from '../../src/index';
import localizePlugin from '../../src/localize';
import { getAltData } from '../data/altLocale';
import initInstance from '../data/initInstance';

const testLocalization = (engine: TestEngineBase) => {
  engine.describe('Enum localization', () => {
    engine.test(
      'Should show English by default',
      ({ EnumPlus: { Enum }, WeekConfig: { StandardWeekConfig, localeEN, noLocale } }) => {
        Enum.install(localizePlugin);
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

    engine.test(
      'Should show Chinese after changing lang',
      ({ EnumPlus: { Enum }, WeekConfig: { StandardWeekConfig, localeCN, noLocale } }) => {
        Enum.install(localizePlugin);
        changeLanguage('zh-CN');
        return {
          ...getAssertData({
            Enum,
            StandardWeekConfig,
            locales: localeCN,
            noLocale,
          }),
        };
      },
      (args) => assertEnum(args)
    );

    engine.test(
      'Should show English after changing back',
      ({ EnumPlus: { Enum }, WeekConfig: { StandardWeekConfig, localeEN, noLocale } }) => {
        Enum.install(localizePlugin);
        changeLanguage('en');
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

    engine.test(
      'Should accept plugin options',
      ({ EnumPlus: { Enum }, WeekConfig: { StandardWeekConfig, localeEN, noLocale } }) => {
        Enum.install(localizePlugin, {
          tOptions: { ns: 'alternative' },
        });
        changeLanguage('en');
        const { weekEnum, AltLocales } = getAssertData({
          Enum,
          StandardWeekConfig,
          locales: localeEN,
          noLocale,
        });
        return {
          weekEnum,
          AltLocales,
        };
      },
      ({ weekEnum, AltLocales }) => {
        engine.expect(weekEnum.name).toBe(AltLocales['alternative:weekDay.name']);
        engine
          .expect(Array.from(weekEnum.labels))
          .toEqual(Array.from(weekEnum.items).map((item) => AltLocales[`alternative:${item.raw.label}`]));
        const sunday = weekEnum.items[0];
        engine.expect(sunday.label).toBe(AltLocales['alternative:weekday.sunday']);
        engine.expect(sunday.toString()).toBe(AltLocales['alternative:weekday.sunday']);
        engine.expect(sunday.toLocaleString()).toBe(AltLocales['alternative:weekday.sunday']);
      }
    );
    engine.test(
      'Should accept i18n instance by plugin option',
      ({ EnumPlus: { Enum }, WeekConfig: { StandardWeekConfig, localeCN, noLocale } }) => {
        const instance = createInstance();
        initInstance(instance);
        Enum.install(rootPlugin, {
          localize: { instance },
        });
        instance.changeLanguage('zh-CN');
        return {
          ...getAssertData({
            Enum,
            StandardWeekConfig,
            locales: localeCN,
            noLocale,
          }),
        };
      },
      (args) => assertEnum(args)
    );
    engine.test(
      'Should be able to set plugin option by root plugin',
      ({ EnumPlus: { Enum }, WeekConfig: { StandardWeekConfig, localeEN, noLocale } }) => {
        Enum.install(rootPlugin, {
          localize: { tOptions: { ns: 'alternative' } },
        });
        changeLanguage('en');
        const { weekEnum, AltLocales } = getAssertData({
          Enum,
          StandardWeekConfig,
          locales: localeEN,
          noLocale,
        });
        return {
          weekEnum,
          AltLocales,
        };
      },
      ({ weekEnum, AltLocales }) => {
        engine.expect(weekEnum.name).toBe(AltLocales['alternative:weekDay.name']);
        engine
          .expect(Array.from(weekEnum.labels))
          .toEqual(Array.from(weekEnum.items).map((item) => AltLocales[`alternative:${item.raw.label}`]));
        const sunday = weekEnum.items[0];
        engine.expect(sunday.label).toBe(AltLocales['alternative:weekday.sunday']);
        engine.expect(sunday.toString()).toBe(AltLocales['alternative:weekday.sunday']);
        engine.expect(sunday.toLocaleString()).toBe(AltLocales['alternative:weekday.sunday']);
      }
    );

    engine.test(
      'Should accept plugin options with tOptions function',
      ({ EnumPlus: { Enum }, WeekConfig: { StandardWeekConfig, localeEN, noLocale } }) => {
        Enum.install(localizePlugin, {
          tOptions: (key) => {
            return { ns: key === 'weekDay.name' ? 'translation' : 'alternative' };
          },
        });
        changeLanguage('en');
        const { weekEnum, AltLocales } = getAssertData({
          Enum,
          StandardWeekConfig,
          locales: localeEN,
          noLocale,
        });
        return {
          weekEnum,
          AltLocales,
          Locales: localeEN,
        };
      },
      ({ weekEnum, AltLocales, Locales }) => {
        engine.expect(weekEnum.name).toBe(Locales['weekDay.name']);
        engine
          .expect(Array.from(weekEnum.labels))
          .toEqual(Array.from(weekEnum.items).map((item) => AltLocales[`alternative:${item.raw.label}`]));
        const sunday = weekEnum.items[0];
        engine.expect(sunday.label).toBe(AltLocales['alternative:weekday.sunday']);
        engine.expect(sunday.toString()).toBe(AltLocales['alternative:weekday.sunday']);
        engine.expect(sunday.toLocaleString()).toBe(AltLocales['alternative:weekday.sunday']);
      }
    );

    engine.test(
      'Should allow plugin option overriding the t function',
      ({ EnumPlus: { Enum }, WeekConfig: { StandardWeekConfig, localeEN, noLocale } }) => {
        Enum.install(localizePlugin, {
          tOptions: (key) => key + '(overridden)',
        });
        changeLanguage('en');
        const { weekEnum } = getAssertData({
          Enum,
          StandardWeekConfig,
          locales: localeEN,
          noLocale,
        });
        return {
          weekEnum,
        };
      },
      ({ weekEnum }) => {
        engine.expect(weekEnum.name).toBe('weekDay.name(overridden)');
        engine
          .expect(Array.from(weekEnum.labels))
          .toEqual(Array.from(weekEnum.items).map((item) => `${item.raw.label}(overridden)`));
        const sunday = weekEnum.items[0];
        engine.expect(sunday.label).toBe(`weekday.sunday(overridden)`);
        engine.expect(sunday.toString()).toBe(`weekday.sunday(overridden)`);
        engine.expect(sunday.toLocaleString()).toBe(`weekday.sunday(overridden)`);
      }
    );
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
    engine.expect(sunday.label).toBe(Locales['weekday.sunday']);
    engine.expect(sunday.toString()).toBe(Locales['weekday.sunday']);
    engine.expect(sunday.toLocaleString()).toBe(Locales['weekday.sunday']);

    engine.expect(altWeekEnum.name).toEqual(AltLocales['alternative:weekDay.name']);
    engine
      .expect(Array.from(altWeekEnum.labels))
      .toEqual(Array.from(altWeekEnum.items).map((item) => AltLocales[item.raw.label as keyof typeof AltLocales]));

    const altSunday = altWeekEnum.items[0];
    engine.expect(altSunday.label).toBe(AltLocales['alternative:weekday.sunday']);
    engine.expect(altSunday.toString()).toBe(AltLocales['alternative:weekday.sunday']);
    engine.expect(altSunday.toLocaleString()).toBe(AltLocales['alternative:weekday.sunday']);
  }
};

export default testLocalization;
