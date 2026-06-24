import type { I18n } from 'vue-i18n';
import { createI18n } from 'vue-i18n';
// eslint-disable-next-line import/no-unresolved
import enUS from '@enum-plus/test/i18n/en-US.json';
// eslint-disable-next-line import/no-unresolved
import neutral from '@enum-plus/test/i18n/neutral.json';
// eslint-disable-next-line import/no-unresolved
import zhCN from '@enum-plus/test/i18n/zh-CN.json';

const createInstance = <T extends boolean>(
  legacy: T,
): I18n<Record<string, unknown>, Record<string, unknown>, Record<string, unknown>, string, T> => {
  const i18n = createI18n({
    legacy,
    // allowComposition: true,
    locale: 'en',
    fallbackLocale: 'en',
    messages: {
      en: Object.keys(neutral).reduce(
        (acc, key) => {
          acc[key as keyof typeof neutral] = enUS[key as keyof typeof enUS];
          return acc;
        },
        {} as {
          -readonly [key in keyof typeof neutral]: `${(typeof enUS)[key]}`;
        },
      ),
      'zh-CN': Object.keys(neutral).reduce(
        (acc, key) => {
          acc[key as keyof typeof neutral] = zhCN[key as keyof typeof zhCN];
          return acc;
        },
        {} as {
          -readonly [key in keyof typeof neutral]: `${(typeof zhCN)[key]}`;
        },
      ),
    },
  });
  return i18n as I18n<Record<string, unknown>, Record<string, unknown>, Record<string, unknown>, string, T>;
};

export default createInstance;
