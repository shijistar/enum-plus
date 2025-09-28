// eslint-disable-next-line import/no-unresolved
import { localeCN, localeEN, noLocale } from '@enum-plus/test/data/week-config';
import type { i18n } from 'i18next';

const initInstance = (instance: i18n) => {
  instance.init({
    lng: 'en',
    ns: ['translation', 'alternative'],
    defaultNS: 'translation',
    fallbackLng: 'en',
    resources: {
      en: {
        translation: {
          greeting: 'Hello',
          ...Object.keys(noLocale).reduce(
            (acc, key) => {
              acc[noLocale[key as keyof typeof noLocale] as keyof typeof localeEN] = (
                localeEN as Record<string, string>
              )[key] as never;
              return acc;
            },
            {} as { -readonly [key in keyof typeof localeEN]: `${(typeof localeEN)[key]} 2` }
          ),
        },
        alternative: {
          greeting: 'Hi',
          ...Object.keys(noLocale).reduce(
            (acc, key) => {
              acc[noLocale[key as keyof typeof noLocale] as keyof typeof localeEN] =
                `${(localeEN as Record<string, string>)[key]} 2` as never;
              return acc;
            },
            {} as { -readonly [key in keyof typeof localeEN]: `${(typeof localeEN)[key]} 2` }
          ),
        },
        override: {
          greeting: 'Hey',
        },
      },
      'zh-CN': {
        translation: {
          greeting: '你好',
          ...Object.keys(noLocale).reduce(
            (acc, key) => {
              acc[noLocale[key as keyof typeof noLocale] as keyof typeof localeCN] = (
                localeCN as Record<string, string>
              )[key] as never;
              return acc;
            },
            {} as { -readonly [key in keyof typeof localeCN]: `${(typeof localeCN)[key]} 2` }
          ),
        },
        alternative: {
          greeting: '嗨',
          ...Object.keys(noLocale).reduce(
            (acc, key) => {
              acc[noLocale[key as keyof typeof noLocale] as keyof typeof localeCN] =
                `${(localeCN as Record<string, string>)[key]} 2` as never;
              return acc;
            },
            {} as { -readonly [key in keyof typeof localeCN]: `${(typeof localeCN)[key]} 2` }
          ),
        },
        override: {
          greeting: '嘿',
        },
      },
    },
  });
};

export default initInstance;
