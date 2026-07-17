import type { EnumInterface, IEnum } from '@enum-plus';
import type { StandardWeekConfig } from '@enum-plus/test/data/week-config';
import type TestEngineBase from '@enum-plus/test/engines/base';
import { changeLanguage } from 'i18next';
import rootPlugin from '../../src/index';
import { getAltData } from '../data/altLocale';
// eslint-disable-next-line import/no-unresolved
import type enUS from '@enum-plus/test/i18n/en-US.json';
// eslint-disable-next-line import/no-unresolved
import type neutral from '@enum-plus/test/i18n/neutral.json';
// eslint-disable-next-line import/no-unresolved
import type zhCN from '@enum-plus/test/i18n/zh-CN.json';

const testLocalization = (engine: TestEngineBase<'jest'>) => {
  engine.describe('Enum localization', () => {
    engine.test(
      'should show English by default',
      ({ EnumPlus: { Enum }, WeekConfig: { StandardWeekConfig }, i18n: { enUS, neutral } }) => {
        Enum.install(rootPlugin);
        return {
          ...getAssertData({
            Enum,
            StandardWeekConfig,
            locales: enUS,
            neutral,
          }),
        };
      },
      (args) => assertEnum(args),
    );

    engine.test(
      'should show Chinese after changing the language',
      ({ EnumPlus: { Enum }, WeekConfig: { StandardWeekConfig }, i18n: { zhCN, neutral } }) => {
        Enum.install(rootPlugin);
        changeLanguage('zh-CN');
        return {
          ...getAssertData({
            Enum,
            StandardWeekConfig,
            locales: zhCN,
            neutral,
          }),
        };
      },
      (args) => assertEnum(args),
    );

    engine.test(
      'should show English after switching back',
      ({ EnumPlus: { Enum }, WeekConfig: { StandardWeekConfig }, i18n: { enUS, neutral } }) => {
        Enum.install(rootPlugin);
        changeLanguage('en');
        return {
          ...getAssertData({
            Enum,
            StandardWeekConfig,
            locales: enUS,
            neutral,
          }),
        };
      },
      (args) => assertEnum(args),
    );

    engine.test(
      'should accept plugin options',
      ({ EnumPlus: { Enum }, WeekConfig: { StandardWeekConfig }, i18n: { enUS, neutral } }) => {
        Enum.install(rootPlugin, {
          localize: {
            tOptions: { ns: 'alternative' },
          },
        });
        changeLanguage('en');
        const { weekEnum, AltLocales } = getAssertData({
          Enum,
          StandardWeekConfig,
          locales: enUS,
          neutral,
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
        engine.expect(sunday.label).toBe(AltLocales['alternative:weekday.Sunday']);
        engine.expect(sunday.toString()).toBe(AltLocales['alternative:weekday.Sunday']);
        engine.expect(sunday.toLocaleString()).toBe(AltLocales['alternative:weekday.Sunday']);
      },
    );
    engine.test(
      'should apply plugin options configured on the root plugin',
      ({ EnumPlus: { Enum }, WeekConfig: { StandardWeekConfig }, i18n: { enUS, neutral } }) => {
        Enum.install(rootPlugin, {
          localize: { tOptions: { ns: 'alternative' } },
        });
        changeLanguage('en');
        const { weekEnum, AltLocales } = getAssertData({
          Enum,
          StandardWeekConfig,
          locales: enUS,
          neutral,
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
        engine.expect(sunday.label).toBe(AltLocales['alternative:weekday.Sunday']);
        engine.expect(sunday.toString()).toBe(AltLocales['alternative:weekday.Sunday']);
        engine.expect(sunday.toLocaleString()).toBe(AltLocales['alternative:weekday.Sunday']);
      },
    );

    engine.test(
      'should accept a tOptions function in plugin options',
      ({ EnumPlus: { Enum }, WeekConfig: { StandardWeekConfig }, i18n: { enUS, neutral } }) => {
        Enum.install(rootPlugin, {
          localize: {
            tOptions: (key) => {
              return { ns: key === 'weekDay.name' ? 'translation' : 'alternative' };
            },
          },
        });
        changeLanguage('en');
        const { weekEnum, AltLocales } = getAssertData({
          Enum,
          StandardWeekConfig,
          locales: enUS,
          neutral,
        });
        return {
          weekEnum,
          AltLocales,
          Locales: enUS,
        };
      },
      ({ weekEnum, AltLocales, Locales }) => {
        engine.expect(weekEnum.name).toBe(Locales['weekDay.name']);
        engine
          .expect(Array.from(weekEnum.labels))
          .toEqual(Array.from(weekEnum.items).map((item) => AltLocales[`alternative:${item.raw.label}`]));
        const sunday = weekEnum.items[0];
        engine.expect(sunday.label).toBe(AltLocales['alternative:weekday.Sunday']);
        engine.expect(sunday.toString()).toBe(AltLocales['alternative:weekday.Sunday']);
        engine.expect(sunday.toLocaleString()).toBe(AltLocales['alternative:weekday.Sunday']);
      },
    );

    engine.test(
      'should allow plugin options to override the t function',
      ({ EnumPlus: { Enum }, WeekConfig: { StandardWeekConfig }, i18n: { enUS, neutral } }) => {
        Enum.install(rootPlugin, {
          localize: {
            tOptions: (key) => key + '(overridden)',
          },
        });
        changeLanguage('en');
        const { weekEnum } = getAssertData({
          Enum,
          StandardWeekConfig,
          locales: enUS,
          neutral,
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
        engine.expect(sunday.label).toBe(`weekday.Sunday(overridden)`);
        engine.expect(sunday.toString()).toBe(`weekday.Sunday(overridden)`);
        engine.expect(sunday.toLocaleString()).toBe(`weekday.Sunday(overridden)`);
      },
    );
  });

  function getAssertData(options: {
    Enum: EnumInterface;
    StandardWeekConfig: typeof StandardWeekConfig;
    locales: Readonly<typeof enUS> | Readonly<typeof zhCN> | Readonly<typeof neutral>;
    neutral: Readonly<typeof neutral>;
  }) {
    const { Enum, StandardWeekConfig, locales, neutral } = options;
    const weekEnum = Enum(StandardWeekConfig, { name: 'weekDay.name' });
    const altData = getAltData({ locales, StandardWeekConfig });
    const altWeekEnum = Enum(altData.AltStandardWeekConfig, { name: 'alternative:weekDay.name' });
    const Locales = Object.keys(neutral).reduce(
      (acc, key) => {
        acc[key as keyof typeof neutral] = locales[key as keyof typeof locales];
        return acc;
      },
      {} as { -readonly [key in keyof typeof neutral]: string },
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
      Locales: { -readonly [key in (typeof neutral)[keyof typeof neutral]]: string };
    } & ReturnType<typeof getAltData>,
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
