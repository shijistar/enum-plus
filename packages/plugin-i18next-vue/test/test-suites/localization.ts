import type { EnumInterface, IEnum } from '@enum-plus';
import type { localeCN, localeEN, noLocale, StandardWeekConfig } from '@enum-plus/test/data/week-config';
import type TestEngineBase from '@enum-plus/test/engines/base';
import { mount } from '@vue/test-utils';
import { changeLanguage } from 'i18next';
import rootPlugin from '../../src/index';
// @ts-expect-error: because need install vue.volar plugin
import TextRender from '../components/TextRender.vue';
import { getAltData } from '../data/altLocale';

const testLocalization = (engine: TestEngineBase<'vitest-browser'>) => {
  engine.describe('Enum localization', () => {
    engine.test(
      'Should show English by default',
      ({ EnumPlus: { Enum }, WeekConfig: { StandardWeekConfig, localeEN, noLocale } }) => {
        Enum.install(rootPlugin);
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
        Enum.install(rootPlugin);
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
        Enum.install(rootPlugin);
        changeLanguage('en');
        return getAssertData({
          Enum,
          StandardWeekConfig,
          locales: localeEN,
          noLocale,
        });
      },
      (args) => assertEnum(args)
    );

    engine.test(
      'Should accept plugin options',
      ({ EnumPlus: { Enum }, WeekConfig: { StandardWeekConfig, localeEN, noLocale } }) => {
        Enum.install(rootPlugin, {
          localize: {
            tOptions: { ns: 'alternative' },
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
        };
      },
      ({ weekEnum, AltLocales }) => {
        const weekName = text(() => weekEnum.name);
        engine.expect(weekName).toBe(AltLocales['alternative:weekDay.name']);
        const weekLabels = text(() => weekEnum.labels.join(',')).split(',');
        engine
          .expect(weekLabels)
          .toEqual(Array.from(weekEnum.items.map((item) => AltLocales[`alternative:${item.raw.label}`])));
        const sunday = weekEnum.items[0];
        engine.expect(text(() => sunday.label)).toBe(AltLocales['alternative:weekday.Sunday']);
        engine.expect(text(() => sunday.toString())).toBe(AltLocales['alternative:weekday.Sunday']);
        engine.expect(text(() => sunday.toLocaleString())).toBe(AltLocales['alternative:weekday.Sunday']);
      }
    );
    engine.test(
      'Should be able to set plugin option by root plugin',
      ({ EnumPlus: { Enum }, WeekConfig: { StandardWeekConfig, localeEN, noLocale } }) => {
        Enum.install(rootPlugin, {
          localize: {
            useTranslationOptions: { keyPrefix: 'foo' },
            tOptions: { ns: 'alternative' },
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
        };
      },
      ({ weekEnum, AltLocales }) => {
        engine.expect(text(() => weekEnum.name)).toBe(AltLocales['alternative:foo.weekDay.name']);
        engine
          .expect(text(() => weekEnum.labels.join(',')).split(','))
          .toEqual(Array.from(weekEnum.items).map((item) => AltLocales[`alternative:foo.${item.raw.label}`]));
        const sunday = weekEnum.items[0];
        engine.expect(text(() => sunday.label)).toBe(AltLocales['alternative:foo.weekday.Sunday']);
        engine.expect(text(() => sunday.toString())).toBe(AltLocales['alternative:foo.weekday.Sunday']);
        engine.expect(text(() => sunday.toLocaleString())).toBe(AltLocales['alternative:foo.weekday.Sunday']);
      }
    );

    engine.test(
      'Should accept plugin options with tOptions function',
      ({ EnumPlus: { Enum }, WeekConfig: { StandardWeekConfig, localeEN, noLocale } }) => {
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
        engine.expect(text(() => weekEnum.name)).toBe(Locales['weekDay.name']);
        engine
          .expect(text(() => weekEnum.labels.join(',')).split(','))
          .toEqual(Array.from(weekEnum.items).map((item) => AltLocales[`alternative:${item.raw.label}`]));
        const sunday = weekEnum.items[0];
        engine.expect(text(() => sunday.label)).toBe(AltLocales['alternative:weekday.Sunday']);
        engine.expect(text(() => sunday.toString())).toBe(AltLocales['alternative:weekday.Sunday']);
        engine.expect(text(() => sunday.toLocaleString())).toBe(AltLocales['alternative:weekday.Sunday']);
      }
    );

    engine.test(
      'Should allow plugin option overriding the t function',
      ({ EnumPlus: { Enum }, WeekConfig: { StandardWeekConfig, localeEN, noLocale } }) => {
        Enum.install(rootPlugin, {
          localize: {
            tOptions: (key) => key + '(overridden)',
          },
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
        engine.expect(text(() => weekEnum.name)).toBe('weekDay.name(overridden)');
        engine
          .expect(text(() => weekEnum.labels.join(',')).split(','))
          .toEqual(Array.from(weekEnum.items).map((item) => `${item.raw.label}(overridden)`));
        const sunday = weekEnum.items[0];
        engine.expect(text(() => sunday.label)).toBe(`weekday.Sunday(overridden)`);
        engine.expect(text(() => sunday.toString())).toBe(`weekday.Sunday(overridden)`);
        engine.expect(text(() => sunday.toLocaleString())).toBe(`weekday.Sunday(overridden)`);
      }
    );

    engine.test(
      'Should allow to be used out of component environment',
      ({ EnumPlus: { Enum }, WeekConfig: { StandardWeekConfig, localeEN, noLocale } }) => {
        Enum.install(rootPlugin);
        changeLanguage('en');
        const { weekEnum, Locales } = getAssertData({
          Enum,
          StandardWeekConfig,
          locales: localeEN,
          noLocale,
        });
        return {
          weekEnum,
          Locales,
        };
      },
      ({ weekEnum, Locales }) => {
        engine.expect(weekEnum.name).toBe(Locales['weekDay.name']);
        engine.expect(weekEnum.labels).toEqual(Array.from(weekEnum.items).map((item) => Locales[item.raw.label]));
        const sunday = weekEnum.items[0];
        engine.expect(sunday.label).toBe(Locales['weekday.Sunday']);
        engine.expect(sunday.toString()).toBe(Locales['weekday.Sunday']);
        engine.expect(sunday.toLocaleString()).toBe(Locales['weekday.Sunday']);
      }
    );

    engine.test(
      'Should allow to be used with useTranslationOptions out of component environment',
      ({ EnumPlus: { Enum }, WeekConfig: { StandardWeekConfig, localeCN, noLocale } }) => {
        Enum.install(rootPlugin, {
          localize: {
            useTranslationOptions: {
              keyPrefix: 'foo',
              // useTranslationOptions.lng has a higher priority.
              lng: 'zh-CN',
            },
            tOptions: { ns: 'alternative' },
          },
        });
        // Should be ignored because useTranslationOptions.lng has a higher priority.
        changeLanguage('en');
        const { weekEnum, AltLocales } = getAssertData({
          Enum,
          StandardWeekConfig,
          locales: localeCN,
          noLocale,
        });
        return {
          weekEnum,
          AltLocales,
        };
      },
      ({ weekEnum, AltLocales }) => {
        engine.expect(weekEnum.name).toBe(AltLocales['alternative:foo.weekDay.name']);
        engine
          .expect(weekEnum.labels)
          .toEqual(Array.from(weekEnum.items).map((item) => AltLocales[`alternative:foo.${item.raw.label}`]));
        const sunday = weekEnum.items[0];
        engine.expect(sunday.label).toBe(AltLocales['alternative:foo.weekday.Sunday']);
        engine.expect(sunday.toString()).toBe(AltLocales['alternative:foo.weekday.Sunday']);
        engine.expect(sunday.toLocaleString()).toBe(AltLocales['alternative:foo.weekday.Sunday']);
      }
    );

    engine.test(
      'Should work along with useTranslationOptions.lng in array format',
      ({ EnumPlus: { Enum }, WeekConfig: { StandardWeekConfig, localeCN, noLocale } }) => {
        Enum.install(rootPlugin, {
          localize: {
            useTranslationOptions: {
              keyPrefix: 'foo',
              // useTranslationOptions.lng has a higher priority.
              lng: ['zh-CN', 'en'],
            },
            tOptions: { ns: 'alternative' },
          },
        });
        // Should be ignored because useTranslationOptions.lng has a higher priority.
        changeLanguage('en');
        const { weekEnum, AltLocales } = getAssertData({
          Enum,
          StandardWeekConfig,
          locales: localeCN,
          noLocale,
        });
        return {
          weekEnum,
          AltLocales,
        };
      },
      ({ weekEnum, AltLocales }) => {
        engine.expect(weekEnum.name).toBe(AltLocales['alternative:foo.weekDay.name']);
        engine
          .expect(weekEnum.labels)
          .toEqual(Array.from(weekEnum.items).map((item) => AltLocales[`alternative:foo.${item.raw.label}`]));
        const sunday = weekEnum.items[0];
        engine.expect(sunday.label).toBe(AltLocales['alternative:foo.weekday.Sunday']);
        engine.expect(sunday.toString()).toBe(AltLocales['alternative:foo.weekday.Sunday']);
        engine.expect(sunday.toLocaleString()).toBe(AltLocales['alternative:foo.weekday.Sunday']);
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
    const { AltLocales, AltStandardWeekConfig } = getAltData({ locales, StandardWeekConfig });
    const altWeekEnum = Enum(AltStandardWeekConfig, { name: 'alternative:weekDay.name' });
    const Locales = Object.keys(noLocale).reduce(
      (acc, key) => {
        acc[noLocale[key as keyof typeof noLocale]] = (locales as Record<string, string>)[key] as never;
        return acc;
      },
      {} as { -readonly [key in (typeof noLocale)[keyof typeof noLocale]]: string }
    );
    const weekName = text(() => weekEnum.name);
    const weekLabels = text(() => weekEnum.labels.join(',')).split(',');
    const sundayLabel = text(() => weekEnum.items[0].label);
    const sundayToString = text(() => weekEnum.items[0].toString());
    const sundayToLocaleString = text(() => weekEnum.items[0].toLocaleString());
    const altWeekName = text(() => altWeekEnum.name);
    const altWeekLabels = text(() => altWeekEnum.labels.join(',')).split(',');
    const altSundayLabel = text(() => altWeekEnum.items[0].label);
    const altSundayToString = text(() => altWeekEnum.items[0].toString());
    const altSundayToLocaleString = text(() => altWeekEnum.items[0].toLocaleString());

    return {
      weekEnum,
      altWeekEnum,
      Locales,
      AltLocales,
      StandardWeekConfig,
      AltStandardWeekConfig,
      weekName,
      weekLabels,
      sundayLabel,
      sundayToString,
      sundayToLocaleString,
      altWeekName,
      altWeekLabels,
      altSundayLabel,
      altSundayToString,
      altSundayToLocaleString,
    };
  }

  type WeekValue = (typeof StandardWeekConfig)[keyof typeof StandardWeekConfig]['value'];

  function assertEnum(
    options: {
      weekName: string;
      weekLabels: string[];
      sundayLabel: string;
      sundayToString: string;
      sundayToLocaleString: string;
      altWeekName: string;
      altWeekLabels: string[];
      altSundayLabel: string;
      altSundayToString: string;
      altSundayToLocaleString: string;
    } & {
      weekEnum: IEnum<typeof StandardWeekConfig, keyof typeof StandardWeekConfig, WeekValue>;
      altWeekEnum: IEnum<
        ReturnType<typeof getAltData>['AltStandardWeekConfig'],
        keyof typeof StandardWeekConfig,
        WeekValue
      >;
      Locales: { -readonly [key in (typeof noLocale)[keyof typeof noLocale]]: string };
    } & ReturnType<typeof getAltData>
  ) {
    const {
      weekName,
      weekLabels,
      sundayLabel,
      sundayToString,
      sundayToLocaleString,
      altWeekName,
      altWeekLabels,
      altSundayLabel,
      altSundayToString,
      altSundayToLocaleString,
      weekEnum,
      altWeekEnum,
      Locales,
      AltLocales,
    } = options;
    engine.expect(weekName).toEqual(Locales['weekDay.name']);
    engine.expect(weekLabels).toEqual(Array.from(weekEnum.items).map((item) => Locales[item.raw.label]));

    engine.expect(sundayLabel).toBe(Locales['weekday.Sunday']);
    engine.expect(sundayToString).toBe(Locales['weekday.Sunday']);
    engine.expect(sundayToLocaleString).toBe(Locales['weekday.Sunday']);

    engine.expect(altWeekName).toEqual(AltLocales['alternative:weekDay.name']);
    engine
      .expect(altWeekLabels)
      .toEqual(Array.from(altWeekEnum.items).map((item) => AltLocales[item.raw.label as keyof typeof AltLocales]));

    engine.expect(altSundayLabel).toBe(AltLocales['alternative:weekday.Sunday']);
    engine.expect(altSundayToString).toBe(AltLocales['alternative:weekday.Sunday']);
    engine.expect(altSundayToLocaleString).toBe(AltLocales['alternative:weekday.Sunday']);
  }
};

function text(func: () => string | undefined) {
  return mount(TextRender, { props: { text: func } }).text();
}

export default testLocalization;
