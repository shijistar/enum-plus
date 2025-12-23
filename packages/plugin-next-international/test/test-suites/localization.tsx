import type { EnumInterface, IEnum } from '@enum-plus';
import type { localeCN, localeEN, noLocale, StandardWeekConfig } from '@enum-plus/test/data/week-config';
import type TestEngineBase from '@enum-plus/test/engines/base';
import '@testing-library/jest-dom';
import { act, render, waitFor } from '@testing-library/react';
import { clientI18nPlugin } from '../../src/index';
import AutoChangeLangPage from '../components/AutoChangeLang';
import Page from '../components/Page';
import { getAltData } from '../data/altLocale';
// import { i18n } from '../data/initServerInstance';
import testIsMatch from './isMatch';

const testLocalization = (engine: TestEngineBase<'jest'>) => {
  engine.describe('Enum localization', () => {
    engine.test(
      'Should raise error when not initialized',
      async ({ EnumPlus: { Enum }, WeekConfig: { StandardWeekConfig, localeEN, noLocale } }) => {
        Enum.install(clientI18nPlugin);
        return {
          ...getAssertData({
            Enum,
            StandardWeekConfig,
            locales: localeEN,
            noLocale,
          }),
        };
      },
      ({ weekEnum }) => {
        expect(() => weekEnum.name).toThrow();
        expect(() => weekEnum.items.filter((item) => weekEnum.isMatch('Mon', item))).toThrow();
      }
    );
    engine.test(
      'Should show English by default without mode specified',
      async ({ EnumPlus: { Enum }, WeekConfig: { StandardWeekConfig, localeEN, noLocale } }) => {
        Enum.install(clientI18nPlugin, {
          localize: {
            mode: 'text',
          },
        });
        await act(async () => {
          render(<Page />);
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
      async (args) => assertEnum(args)
    );
    // engine.test(
    //   'Should show English by default in server side',
    //   async ({ EnumPlus: { Enum }, WeekConfig: { StandardWeekConfig, localeEN, noLocale } }) => {
    //     Enum.install(clientI18nPlugin, {
    //       localize: {
    //         getI18n: i18n.getI18n,
    //       },
    //     });
    //     return {
    //       ...getAssertData({
    //         Enum,
    //         StandardWeekConfig,
    //         locales: localeEN,
    //         noLocale,
    //       }),
    //     };
    //   },
    //   async (args) => assertEnum(args)
    // );
    engine.test(
      'Should show English by default with text mode',
      async ({ EnumPlus: { Enum }, WeekConfig: { StandardWeekConfig, localeEN, noLocale } }) => {
        Enum.install(clientI18nPlugin, {
          localize: {
            mode: 'text',
          },
        });
        await act(async () => {
          render(<Page />);
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
      async (args) => assertEnum(args)
    );
    engine.test(
      'Should show English by default with component mode',
      async ({ EnumPlus: { Enum }, WeekConfig: { StandardWeekConfig, localeEN, noLocale } }) => {
        Enum.install(clientI18nPlugin, {
          localize: {
            mode: 'component',
          },
        });
        await act(async () => {
          render(<Page />);
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
      async (args) => assertEnum({ ...args, getText: getComponentText })
    );

    engine.test(
      'Should show Chinese after changing lang',
      async ({ EnumPlus: { Enum }, WeekConfig: { StandardWeekConfig, localeCN, noLocale } }) => {
        Enum.install(clientI18nPlugin, {
          localize: { mode: 'text' },
        });
        await act(async () => {
          render(<Page locale="zh-CN" />);
        });
        return {
          ...getAssertData({
            Enum,
            StandardWeekConfig,
            locales: localeCN,
            noLocale,
          }),
        };
      },
      async (args) => assertEnum(args)
    );

    engine.test(
      'Should show English after changing back',
      async ({ EnumPlus: { Enum }, WeekConfig: { StandardWeekConfig, localeEN, noLocale } }) => {
        Enum.install(clientI18nPlugin, {
          localize: { mode: 'text' },
        });
        await act(async () => {
          render(
            <Page locale="zh-CN">
              <AutoChangeLangPage locale="en" />
            </Page>
          );
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
      async (args) => assertEnum(args)
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
    const altWeekEnum = Enum(altData.AltStandardWeekConfig, { name: 'alternative.weekDay.name' });
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
  async function assertEnum(
    options: {
      weekEnum: IEnum<typeof StandardWeekConfig, keyof typeof StandardWeekConfig, WeekValue>;
      altWeekEnum: IEnum<
        ReturnType<typeof getAltData>['AltStandardWeekConfig'],
        keyof typeof StandardWeekConfig,
        WeekValue
      >;
      Locales: { -readonly [key in (typeof noLocale)[keyof typeof noLocale]]: string };
      getText?:
        | ((value: string | undefined) => string | undefined)
        | ((value: string | undefined) => Promise<string | undefined>);
    } & ReturnType<typeof getAltData>
  ) {
    try {
      const { weekEnum, altWeekEnum, Locales, AltLocales, getText = getRawText } = options;

      await waitFor(async () => {
        engine.expect(await getText(weekEnum.name)).toEqual(Locales['weekDay.name']);

        engine
          .expect(await Promise.all(weekEnum.labels.map(async (s) => await getText(s))))
          .toEqual(Array.from(weekEnum.items).map((item) => Locales[item.raw.label]));

        const sunday = weekEnum.items[0];
        engine.expect(await getText(sunday.label)).toBe(Locales['weekday.Sunday']);
        engine.expect(await getText(sunday.toString())).toBe(Locales['weekday.Sunday']);
        engine.expect(await getText(sunday.toLocaleString())).toBe(Locales['weekday.Sunday']);

        engine.expect(await getText(altWeekEnum.name)).toEqual(AltLocales['alternative.weekDay.name']);
        engine
          .expect(await Promise.all(Array.from(altWeekEnum.labels).map(async (s) => await getText(s))))
          .toEqual(Array.from(altWeekEnum.items).map((item) => AltLocales[item.raw.label as keyof typeof AltLocales]));

        const altSunday = altWeekEnum.items[0];
        engine.expect(await getText(altSunday.label)).toBe(AltLocales['alternative.weekday.Sunday']);
        engine.expect(await getText(altSunday.toString())).toBe(AltLocales['alternative.weekday.Sunday']);
        engine.expect(await getText(altSunday.toLocaleString())).toBe(AltLocales['alternative.weekday.Sunday']);
      });
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
  testIsMatch(engine, { plugin: clientI18nPlugin });
};

function getRawText(value: string | undefined) {
  return value;
}
async function getComponentText(value: string | undefined) {
  let result: ReturnType<typeof render> = undefined!;
  await act(async () => {
    result = render(<Page>{value}</Page>);
  });
  return result.container.innerText;
}

export default testLocalization;
