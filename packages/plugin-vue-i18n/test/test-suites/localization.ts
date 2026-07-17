// import { nextTick } from 'vue';
import type { EnumInterface, IEnum } from '@enum-plus';
import type { StandardWeekConfig } from '@enum-plus/test/data/week-config';
import type TestEngineBase from '@enum-plus/test/engines/base';
import { mount } from '@vue/test-utils';
import type { Composer, I18n, VueI18n } from 'vue-i18n';
import rootPlugin from '../../src/index';
// @ts-expect-error: because need install vue.volar plugin
import TextRender from '../components/TextRender.vue';
// eslint-disable-next-line import/no-unresolved
import type enUS from '@enum-plus/test/i18n/en-US.json';
// eslint-disable-next-line import/no-unresolved
import type neutral from '@enum-plus/test/i18n/neutral.json';
// eslint-disable-next-line import/no-unresolved
import type zhCN from '@enum-plus/test/i18n/zh-CN.json';

const testLocalization = <L extends boolean>(
  engine: TestEngineBase<'vitest-browser'>,
  i18n: I18n<Record<string, unknown>, Record<string, unknown>, Record<string, unknown>, string, L>,
) => {
  engine.describe(`Enum localization ${i18n.mode === 'composition' ? '(composition mode)' : '(legacy mode)'}`, () => {
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
        changeLanguage(i18n, 'zh-CN');
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
        changeLanguage(i18n, 'en');
        return getAssertData({
          Enum,
          StandardWeekConfig,
          locales: enUS,
          neutral,
        });
      },
      (args) => assertEnum(args),
    );

    engine.test(
      'should accept plugin options',
      ({ EnumPlus: { Enum }, WeekConfig: { StandardWeekConfig }, i18n: { zhCN, neutral } }) => {
        Enum.install(rootPlugin, {
          localize: {
            tOptions: { default: '-' },
          },
        });
        changeLanguage(i18n, 'zh-CN');
        const { Locales } = getAssertData({
          Enum,
          StandardWeekConfig,
          locales: zhCN,
          neutral,
        });
        const newWeekEnum = Enum(
          { ...StandardWeekConfig, WrongDay: { value: 8, label: 'weekday.wrong' } },
          { name: 'weekDay.name' },
        );
        return {
          newWeekEnum,
          Locales,
        };
      },
      ({ newWeekEnum, Locales }) => {
        const weekName = text(() => newWeekEnum.name);
        engine.expect(weekName).toBe(Locales['weekDay.name']);
        const weekLabels = text(() => newWeekEnum.labels.join(',')).split(',');
        engine
          .expect(weekLabels)
          .toEqual(Array.from(newWeekEnum.items.map((item) => Locales[item.raw.label as keyof typeof Locales] || '-')));
        const sunday = newWeekEnum.items[0];
        engine.expect(text(() => sunday.label)).toBe(Locales['weekday.Sunday']);
        engine.expect(text(() => sunday.toString())).toBe(Locales['weekday.Sunday']);
        engine.expect(text(() => sunday.toLocaleString())).toBe(Locales['weekday.Sunday']);
        engine.expect(text(() => newWeekEnum.named.WrongDay.label)).toBe('-');
      },
    );

    engine.test(
      'should accept a tOptions function in plugin options',
      ({ EnumPlus: { Enum }, WeekConfig: { StandardWeekConfig }, i18n: { enUS, neutral } }) => {
        Enum.install(rootPlugin, {
          localize: {
            tOptions: () => {
              return { default: '-' };
            },
          },
        });
        changeLanguage(i18n, 'en');
        const { Locales } = getAssertData({
          Enum,
          StandardWeekConfig,
          locales: enUS,
          neutral,
        });
        const newWeekEnum = Enum(
          { ...StandardWeekConfig, WrongDay: { value: 8, label: 'weekday.wrong' } },
          { name: 'weekDay.name' },
        );
        return {
          newWeekEnum,
          Locales,
        };
      },
      ({ newWeekEnum, Locales }) => {
        const weekName = text(() => newWeekEnum.name);
        engine.expect(weekName).toBe(Locales['weekDay.name']);
        const weekLabels = text(() => newWeekEnum.labels.join(',')).split(',');
        engine
          .expect(weekLabels)
          .toEqual(Array.from(newWeekEnum.items.map((item) => Locales[item.raw.label as keyof typeof Locales] || '-')));
        const sunday = newWeekEnum.items[0];
        engine.expect(text(() => sunday.label)).toBe(Locales['weekday.Sunday']);
        engine.expect(text(() => sunday.toString())).toBe(Locales['weekday.Sunday']);
        engine.expect(text(() => sunday.toLocaleString())).toBe(Locales['weekday.Sunday']);
        engine.expect(text(() => newWeekEnum.named.WrongDay.label)).toBe('-');
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
        changeLanguage(i18n, 'en');
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
        engine.expect(text(() => weekEnum.name)).toBe('weekDay.name(overridden)');
        engine
          .expect(text(() => weekEnum.labels.join(',')).split(','))
          .toEqual(Array.from(weekEnum.items).map((item) => `${item.raw.label}(overridden)`));
        const sunday = weekEnum.items[0];
        engine.expect(text(() => sunday.label)).toBe(`weekday.Sunday(overridden)`);
        engine.expect(text(() => sunday.toString())).toBe(`weekday.Sunday(overridden)`);
        engine.expect(text(() => sunday.toLocaleString())).toBe(`weekday.Sunday(overridden)`);
      },
    );

    engine.test(
      'should work outside a component context',
      ({ EnumPlus: { Enum }, WeekConfig: { StandardWeekConfig }, i18n: { enUS, neutral } }) => {
        Enum.install(rootPlugin, {
          localize: {
            instance: i18n,
            suppressWarnings: true,
          },
        });
        changeLanguage(i18n, 'en');
        const { weekEnum, Locales } = getAssertData({
          Enum,
          StandardWeekConfig,
          locales: enUS,
          neutral,
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
      },
    );

    engine.test(
      'should work with an instance and tOptions outside a component context',
      ({ EnumPlus: { Enum }, WeekConfig: { StandardWeekConfig }, i18n: { zhCN, neutral } }) => {
        Enum.install(rootPlugin, {
          localize: {
            instance: i18n,
            tOptions: { default: '-' },
          },
        });
        changeLanguage(i18n, 'zh-CN');
        const { Locales } = getAssertData({
          Enum,
          StandardWeekConfig,
          locales: zhCN,
          neutral,
        });
        const newWeekEnum = Enum(
          { ...StandardWeekConfig, WrongDay: { value: 8, label: 'weekday.wrong' } },
          { name: 'weekDay.name' },
        );
        return {
          newWeekEnum,
          Locales,
        };
      },
      ({ newWeekEnum, Locales }) => {
        const weekName = text(() => newWeekEnum.name);
        engine.expect(weekName).toBe(Locales['weekDay.name']);
        const weekLabels = text(() => newWeekEnum.labels.join(',')).split(',');
        engine
          .expect(weekLabels)
          .toEqual(Array.from(newWeekEnum.items.map((item) => Locales[item.raw.label as keyof typeof Locales] || '-')));
        const sunday = newWeekEnum.items[0];
        engine.expect(text(() => sunday.label)).toBe(Locales['weekday.Sunday']);
        engine.expect(text(() => sunday.toString())).toBe(Locales['weekday.Sunday']);
        engine.expect(text(() => sunday.toLocaleString())).toBe(Locales['weekday.Sunday']);
        engine.expect(text(() => newWeekEnum.named.WrongDay.label)).toBe('-');
      },
    );

    engine.test(
      'should return the original key without an instance outside a component context',
      ({ EnumPlus: { Enum }, WeekConfig: { StandardWeekConfig }, i18n: { zhCN, neutral } }) => {
        Enum.install(rootPlugin);
        changeLanguage(i18n, 'zh-CN');
        const { Locales } = getAssertData({
          Enum,
          StandardWeekConfig,
          locales: zhCN,
          neutral,
        });
        const weekEnum = Enum(StandardWeekConfig, { name: 'weekDay.name' });
        return {
          weekEnum,
          Locales,
        };
      },
      ({ weekEnum }) => {
        engine.expect(weekEnum.name).toBe('weekDay.name');
        engine.expect(weekEnum.labels).toEqual(Array.from(weekEnum.items.map((item) => item.raw.label)));
        const sunday = weekEnum.items[0];
        engine.expect(sunday.label).toBe('weekday.Sunday');
        engine.expect(sunday.toString()).toBe('weekday.Sunday');
        engine.expect(sunday.toLocaleString()).toBe('weekday.Sunday');
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
    const Locales = Object.keys(neutral).reduce(
      (acc, key) => {
        acc[key as keyof typeof neutral] = locales[key as keyof typeof locales];
        return acc;
      },
      {} as { -readonly [key in keyof typeof neutral]: string },
    );
    const weekName = text(() => weekEnum.name);
    const weekLabels = text(() => weekEnum.labels.join(',')).split(',');
    const sundayLabel = text(() => weekEnum.items[0].label);
    const sundayToString = text(() => weekEnum.items[0].toString());
    const sundayToLocaleString = text(() => weekEnum.items[0].toLocaleString());

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
      Locales: { -readonly [key in keyof typeof neutral]: string };
    },
  ) {
    const { weekName, weekLabels, sundayLabel, sundayToString, sundayToLocaleString, weekEnum, Locales } = options;
    engine.expect(weekName).toEqual(Locales['weekDay.name']);
    engine.expect(weekLabels).toEqual(Array.from(weekEnum.items).map((item) => Locales[item.raw.label]));

    engine.expect(sundayLabel).toBe(Locales['weekday.Sunday']);
    engine.expect(sundayToString).toBe(Locales['weekday.Sunday']);
    engine.expect(sundayToLocaleString).toBe(Locales['weekday.Sunday']);
  }
};

function changeLanguage<L extends boolean>(
  i18n: I18n<Record<string, unknown>, Record<string, unknown>, Record<string, unknown>, string, L>,
  lang: 'en' | 'zh-CN',
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
function text(func: () => string | undefined) {
  return mount(TextRender, { props: { text: func } }).text();
}

export default testLocalization;
