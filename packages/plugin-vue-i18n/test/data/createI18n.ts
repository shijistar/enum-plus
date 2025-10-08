// eslint-disable-next-line import/no-unresolved
import { localeCN, localeEN, noLocale } from '@enum-plus/test/data/week-config';
import type { I18n } from 'vue-i18n';
import { createI18n } from 'vue-i18n';

const createInstance = <T extends boolean>(
  legacy: T
): I18n<Record<string, unknown>, Record<string, unknown>, Record<string, unknown>, string, T> => {
  const i18n = createI18n({
    legacy,
    // allowComposition: true,
    locale: 'en',
    fallbackLocale: 'en',
    messages: {
      en: Object.keys(noLocale).reduce(
        (acc, key) => {
          acc[noLocale[key as keyof typeof noLocale] as (typeof noLocale)[keyof typeof noLocale]] = (
            localeEN as Record<string, string>
          )[key];
          return acc;
        },
        {} as {
          -readonly [key in (typeof noLocale)[keyof typeof noLocale]]: string;
        }
      ),
      'zh-CN': Object.keys(noLocale).reduce(
        (acc, key) => {
          acc[noLocale[key as keyof typeof noLocale] as (typeof noLocale)[keyof typeof noLocale]] = (
            localeCN as Record<string, string>
          )[key];
          return acc;
        },
        {} as {
          -readonly [key in (typeof noLocale)[keyof typeof noLocale]]: string;
        }
      ),
    },
  });
  return i18n as I18n<Record<string, unknown>, Record<string, unknown>, Record<string, unknown>, string, T>;
};

export default createInstance;
