import type { EnumInterface, IEnum } from '@enum-plus';
import type { localeCN, localeEN, noLocale, StandardWeekConfig } from '@enum-plus/test/data/week-config';
import type TestEngineBase from '@enum-plus/test/engines/base';
import { render } from '@testing-library/vue';
import { changeLanguage } from 'i18next';
import rootPlugin from '../../src/index';
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
    const { AltLocales, AltStandardWeekConfig } = getAltData({ locales, StandardWeekConfig });
    const altWeekEnum = Enum(AltStandardWeekConfig, { name: 'alternative:weekDay.name' });
    const Locales = Object.keys(noLocale).reduce(
      (acc, key) => {
        acc[noLocale[key as keyof typeof noLocale]] = (locales as Record<string, string>)[key] as never;
        return acc;
      },
      {} as { -readonly [key in (typeof noLocale)[keyof typeof noLocale]]: string }
    );
    // await act(async () => {
    //   changeLanguage('zh-CN');
    // });
    const weekName = render(TextRender, {
      props: {
        text: () => weekEnum.name,
      },
    }).container.textContent;
    const weekLabels = render(TextRender, {
      props: {
        text: () => weekEnum.labels.join(','),
      },
    }).container.textContent.split(',');
    const sundayLabel = render(TextRender, {
      props: {
        text: () => weekEnum.items[0].label,
      },
    }).container.textContent;
    const sundayToString = render(TextRender, {
      props: {
        text: () => weekEnum.items[0].toString(),
      },
    }).container.textContent;
    const sundayToLocaleString = render(TextRender, {
      props: {
        text: () => weekEnum.items[0].toLocaleString(),
      },
    }).container.textContent;
    const altWeekName = render(TextRender, {
      props: {
        text: () => altWeekEnum.name,
      },
    }).container.textContent;
    const altWeekLabels = render(TextRender, {
      props: {
        text: () => altWeekEnum.labels.join(','),
      },
    }).container.textContent.split(',');
    const altSundayLabel = render(TextRender, {
      props: {
        text: () => altWeekEnum.items[0].label,
      },
    }).container.textContent;
    const altSundayToString = render(TextRender, {
      props: {
        text: () => altWeekEnum.items[0].toString(),
      },
    }).container.textContent;
    const altSundayToLocaleString = render(TextRender, {
      props: {
        text: () => altWeekEnum.items[0].toLocaleString(),
      },
    }).container.textContent;

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

    engine.expect(sundayLabel).toBe(Locales['weekday.sunday']);
    engine.expect(sundayToString).toBe(Locales['weekday.sunday']);
    engine.expect(sundayToLocaleString).toBe(Locales['weekday.sunday']);

    engine.expect(altWeekName).toEqual(AltLocales['alternative:weekDay.name']);
    engine
      .expect(altWeekLabels)
      .toEqual(Array.from(altWeekEnum.items).map((item) => AltLocales[item.raw.label as keyof typeof AltLocales]));

    engine.expect(altSundayLabel).toBe(AltLocales['alternative:weekday.sunday']);
    engine.expect(altSundayToString).toBe(AltLocales['alternative:weekday.sunday']);
    engine.expect(altSundayToLocaleString).toBe(AltLocales['alternative:weekday.sunday']);
  }
};

export default testLocalization;
