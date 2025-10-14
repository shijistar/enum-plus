// import { nextTick } from 'vue';
import { nextTick } from 'vue';
import type { EnumInterface, IEnum } from '@enum-plus';
import type { localeCN, localeEN, noLocale, StandardWeekConfig } from '@enum-plus/test/data/week-config';
import type TestEngineBase from '@enum-plus/test/engines/base';
import { mount } from '@vue/test-utils';
import type { Composer, I18n, VueI18n } from 'vue-i18n';
import rootPlugin from '../../src/index';
// @ts-expect-error: because need install vue.volar plugin
import LegacyTextRender from '../components/LegacyTextRender.vue';
// @ts-expect-error: because need install vue.volar plugin
import TextRender from '../components/TextRender.vue';

const testLocalization = <L extends boolean>(
  engine: TestEngineBase<'vitest-browser'>,
  i18n: I18n<Record<string, unknown>, Record<string, unknown>, Record<string, unknown>, string, L>
) => {
  engine.describe(`Enum localization ${i18n.mode === 'composition' ? '(composition mode)' : '(legacy mode)'}`, () => {
    engine.test(
      'Should show English by default',
      async ({ EnumPlus: { Enum }, WeekConfig: { StandardWeekConfig, localeEN, noLocale } }) => {
        Enum.install(rootPlugin);
        return {
          ...(await getAssertData({
            Enum,
            StandardWeekConfig,
            locales: localeEN,
            noLocale,
          })),
        };
      },
      (args) => assertEnum(args)
    );

    engine.test(
      'Should show Chinese after changing lang',
      async ({ EnumPlus: { Enum }, WeekConfig: { StandardWeekConfig, localeCN, noLocale } }) => {
        Enum.install(rootPlugin);
        changeLanguage(i18n, 'zh-CN');
        return {
          ...(await getAssertData({
            Enum,
            StandardWeekConfig,
            locales: localeCN,
            noLocale,
          })),
        };
      },
      (args) => assertEnum(args)
    );

    engine.test(
      'Should show English after changing back',
      ({ EnumPlus: { Enum }, WeekConfig: { StandardWeekConfig, localeEN, noLocale } }) => {
        Enum.install(rootPlugin);
        changeLanguage(i18n, 'en');
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
      async ({ EnumPlus: { Enum }, WeekConfig: { StandardWeekConfig, localeCN, noLocale } }) => {
        Enum.install(rootPlugin, {
          localize: {
            tOptions: { default: '-' },
          },
        });
        changeLanguage(i18n, 'zh-CN');
        const { Locales } = await getAssertData({
          Enum,
          StandardWeekConfig,
          locales: localeCN,
          noLocale,
        });
        const newWeekEnum = Enum(
          { ...StandardWeekConfig, WrongDay: { value: 8, label: 'weekday.wrong' } },
          { name: 'weekDay.name' }
        );
        return {
          newWeekEnum,
          Locales,
        };
      },
      async ({ newWeekEnum, Locales }) => {
        const weekName = await text(() => newWeekEnum.name);
        engine.expect(weekName).toBe(Locales['weekDay.name']);
        const weekLabels = (await text(() => newWeekEnum.labels.join(','))).split(',');
        engine
          .expect(weekLabels)
          .toEqual(Array.from(newWeekEnum.items.map((item) => Locales[item.raw.label as keyof typeof Locales] || '-')));
        const sunday = newWeekEnum.items[0];
        engine.expect(await text(() => sunday.label)).toBe(Locales['weekday.sunday']);
        engine.expect(await text(() => sunday.toString())).toBe(Locales['weekday.sunday']);
        engine.expect(await text(() => sunday.toLocaleString())).toBe(Locales['weekday.sunday']);
        engine.expect(await text(() => newWeekEnum.named.WrongDay.label)).toBe('-');
      }
    );

    engine.test(
      'Should accept plugin options with tOptions function',
      async ({ EnumPlus: { Enum }, WeekConfig: { StandardWeekConfig, localeEN, noLocale } }) => {
        Enum.install(rootPlugin, {
          localize: {
            tOptions: () => {
              return { default: '-' };
            },
          },
        });
        changeLanguage(i18n, 'en');
        const { Locales } = await getAssertData({
          Enum,
          StandardWeekConfig,
          locales: localeEN,
          noLocale,
        });
        const newWeekEnum = Enum(
          { ...StandardWeekConfig, WrongDay: { value: 8, label: 'weekday.wrong' } },
          { name: 'weekDay.name' }
        );
        return {
          newWeekEnum,
          Locales,
        };
      },
      async ({ newWeekEnum, Locales }) => {
        const weekName = await text(() => newWeekEnum.name);
        engine.expect(weekName).toBe(Locales['weekDay.name']);
        const weekLabels = (await text(() => newWeekEnum.labels.join(','))).split(',');
        engine
          .expect(weekLabels)
          .toEqual(Array.from(newWeekEnum.items.map((item) => Locales[item.raw.label as keyof typeof Locales] || '-')));
        const sunday = newWeekEnum.items[0];
        engine.expect(await text(() => sunday.label)).toBe(Locales['weekday.sunday']);
        engine.expect(await text(() => sunday.toString())).toBe(Locales['weekday.sunday']);
        engine.expect(await text(() => sunday.toLocaleString())).toBe(Locales['weekday.sunday']);
        engine.expect(await text(() => newWeekEnum.named.WrongDay.label)).toBe('-');
      }
    );

    engine.test(
      'Should allow plugin option overriding the t function',
      async ({ EnumPlus: { Enum }, WeekConfig: { StandardWeekConfig, localeEN, noLocale } }) => {
        Enum.install(rootPlugin, {
          localize: {
            tOptions: (key) => key + '(overridden)',
          },
        });
        changeLanguage(i18n, 'en');
        const { weekEnum } = await getAssertData({
          Enum,
          StandardWeekConfig,
          locales: localeEN,
          noLocale,
        });
        return {
          weekEnum,
        };
      },
      async ({ weekEnum }) => {
        engine.expect(await text(() => weekEnum.name)).toBe('weekDay.name(overridden)');
        engine
          .expect((await text(() => weekEnum.labels.join(','))).split(','))
          .toEqual(Array.from(weekEnum.items).map((item) => `${item.raw.label}(overridden)`));
        const sunday = weekEnum.items[0];
        engine.expect(await text(() => sunday.label)).toBe(`weekday.sunday(overridden)`);
        engine.expect(await text(() => sunday.toString())).toBe(`weekday.sunday(overridden)`);
        engine.expect(await text(() => sunday.toLocaleString())).toBe(`weekday.sunday(overridden)`);
      }
    );

    engine.test(
      'Should allow to be used out of component environment',
      async ({ EnumPlus: { Enum }, WeekConfig: { StandardWeekConfig, localeEN, noLocale } }) => {
        Enum.install(rootPlugin, {
          localize: {
            instance: i18n,
          },
        });
        changeLanguage(i18n, 'en');
        const { weekEnum, Locales } = await getAssertData({
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
      async ({ weekEnum, Locales }) => {
        engine.expect(weekEnum.name).toBe(Locales['weekDay.name']);
        engine.expect(weekEnum.labels).toEqual(Array.from(weekEnum.items).map((item) => Locales[item.raw.label]));
        const sunday = weekEnum.items[0];
        engine.expect(sunday.label).toBe(Locales['weekday.sunday']);
        engine.expect(sunday.toString()).toBe(Locales['weekday.sunday']);
        engine.expect(sunday.toLocaleString()).toBe(Locales['weekday.sunday']);
      }
    );

    engine.test(
      'Should work with instance and tOptions out of component environment',
      async ({ EnumPlus: { Enum }, WeekConfig: { StandardWeekConfig, localeCN, noLocale } }) => {
        Enum.install(rootPlugin, {
          localize: {
            instance: i18n,
            tOptions: { default: '-' },
          },
        });
        changeLanguage(i18n, 'zh-CN');
        const { Locales } = await getAssertData({
          Enum,
          StandardWeekConfig,
          locales: localeCN,
          noLocale,
        });
        const newWeekEnum = Enum(
          { ...StandardWeekConfig, WrongDay: { value: 8, label: 'weekday.wrong' } },
          { name: 'weekDay.name' }
        );
        return {
          newWeekEnum,
          Locales,
        };
      },
      async ({ newWeekEnum, Locales }) => {
        const weekName = await text(() => newWeekEnum.name);
        engine.expect(weekName).toBe(Locales['weekDay.name']);
        const weekLabels = (await text(() => newWeekEnum.labels.join(','))).split(',');
        engine
          .expect(weekLabels)
          .toEqual(Array.from(newWeekEnum.items.map((item) => Locales[item.raw.label as keyof typeof Locales] || '-')));
        const sunday = newWeekEnum.items[0];
        engine.expect(await text(() => sunday.label)).toBe(Locales['weekday.sunday']);
        engine.expect(await text(() => sunday.toString())).toBe(Locales['weekday.sunday']);
        engine.expect(await text(() => sunday.toLocaleString())).toBe(Locales['weekday.sunday']);
        engine.expect(await text(() => newWeekEnum.named.WrongDay.label)).toBe('-');
      }
    );

    engine.test(
      'Should return the origin key without instance out of component environment',
      async ({ EnumPlus: { Enum }, WeekConfig: { StandardWeekConfig, localeCN, noLocale } }) => {
        Enum.install(rootPlugin);
        changeLanguage(i18n, 'zh-CN');
        const { Locales } = await getAssertData({
          Enum,
          StandardWeekConfig,
          locales: localeCN,
          noLocale,
        });
        const weekEnum = Enum(StandardWeekConfig, { name: 'weekDay.name' });
        return {
          weekEnum,
          Locales,
        };
      },
      async ({ weekEnum }) => {
        engine.expect(weekEnum.name).toBe('weekDay.name');
        engine.expect(weekEnum.labels).toEqual(Array.from(weekEnum.items.map((item) => item.raw.label)));
        const sunday = weekEnum.items[0];
        engine.expect(sunday.label).toBe('weekday.sunday');
        engine.expect(sunday.toString()).toBe('weekday.sunday');
        engine.expect(sunday.toLocaleString()).toBe('weekday.sunday');
      }
    );
  });

  async function getAssertData(options: {
    Enum: EnumInterface;
    StandardWeekConfig: typeof StandardWeekConfig;
    locales: typeof localeEN | typeof localeCN | typeof noLocale;
    noLocale: typeof noLocale;
  }) {
    const { Enum, StandardWeekConfig, locales, noLocale } = options;
    const weekEnum = Enum(StandardWeekConfig, { name: 'weekDay.name' });
    const Locales = Object.keys(noLocale).reduce(
      (acc, key) => {
        acc[noLocale[key as keyof typeof noLocale]] = (locales as Record<string, string>)[key] as never;
        return acc;
      },
      {} as { -readonly [key in (typeof noLocale)[keyof typeof noLocale]]: string }
    );
    const weekName = await text(() => weekEnum.name);
    const weekLabels = (await text(() => weekEnum.labels.join(','))).split(',');
    const sundayLabel = await text(() => weekEnum.items[0].label);
    const sundayToString = await text(() => weekEnum.items[0].toString());
    const sundayToLocaleString = await text(() => weekEnum.items[0].toLocaleString());

    return {
      weekEnum,
      Locales,
      StandardWeekConfig,
      weekName,
      weekLabels,
      sundayLabel,
      sundayToString,
      sundayToLocaleString,
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
    } & {
      weekEnum: IEnum<typeof StandardWeekConfig, keyof typeof StandardWeekConfig, WeekValue>;
      Locales: { -readonly [key in (typeof noLocale)[keyof typeof noLocale]]: string };
    }
  ) {
    const { weekName, weekLabels, sundayLabel, sundayToString, sundayToLocaleString, weekEnum, Locales } = options;
    engine.expect(weekName).toEqual(Locales['weekDay.name']);
    engine.expect(weekLabels).toEqual(Array.from(weekEnum.items).map((item) => Locales[item.raw.label]));

    engine.expect(sundayLabel).toBe(Locales['weekday.sunday']);
    engine.expect(sundayToString).toBe(Locales['weekday.sunday']);
    engine.expect(sundayToLocaleString).toBe(Locales['weekday.sunday']);
  }
  async function text(func: () => string | undefined) {
    if (i18n.mode === 'legacy') {
      await nextTick();
      const comp = mount(i18n.mode === 'legacy' ? LegacyTextRender : TextRender, {
        props: {
          text: async () => {
            let value;
            nextTick(() => {
              value = func();
              console.log('value1', value);
            });
            await nextTick();
            console.log('value2', value);
            return value;
          },
        },
      });
      return comp.text();
    } else {
      const comp = mount(TextRender, { props: { text: func } });
      return comp.text();
    }
  }
};

function changeLanguage<L extends boolean>(
  i18n: I18n<Record<string, unknown>, Record<string, unknown>, Record<string, unknown>, string, L>,
  lang: 'en' | 'zh-CN'
) {
  if (i18n.mode === 'legacy') {
    // console.log(
    //   'legacy before ' + (i18n.global as unknown as VueI18n).locale,
    //   (i18n.global as unknown as VueI18n).t('weekDay.name')
    // );
    (i18n.global as unknown as VueI18n).locale = lang;
    // console.log(
    //   'legacy after ' + (i18n.global as unknown as VueI18n).locale,
    //   (i18n.global as unknown as VueI18n).t('weekDay.name')
    // );
    // await nextTick();
  } else {
    (i18n.global as unknown as Composer).locale.value = lang;
  }
}

export default testLocalization;
