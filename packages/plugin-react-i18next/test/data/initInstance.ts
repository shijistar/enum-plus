// eslint-disable-next-line import/no-unresolved
import { localeCN, localeEN, noLocale } from '@enum-plus/test/data/week-config';
import type { i18n } from 'i18next';
import { initReactI18next } from 'react-i18next';

const initInstance = (instance: i18n) => {
  instance.use(initReactI18next).init({
    lng: 'en',
    ns: ['translation', 'alternative'],
    defaultNS: 'translation',
    fallbackLng: 'en',
    resources: {
      en: {
        translation: Object.keys(noLocale).reduce(
          (acc, key) => {
            acc[noLocale[key as keyof typeof noLocale] as keyof typeof localeEN] = (localeEN as Record<string, string>)[
              key
            ] as never;
            return acc;
          },
          {} as { -readonly [key in keyof typeof localeEN]: `${(typeof localeEN)[key]} 2` }
        ),
        alternative: Object.keys(noLocale).reduce(
          (acc, key) => {
            acc[noLocale[key as keyof typeof noLocale] as keyof typeof localeEN] =
              `${(localeEN as Record<string, string>)[key]} 2` as never;
            return acc;
          },
          {} as { -readonly [key in keyof typeof localeEN]: `${(typeof localeEN)[key]} 2` }
        ),
      },
      'zh-CN': {
        translation: Object.keys(noLocale).reduce(
          (acc, key) => {
            acc[noLocale[key as keyof typeof noLocale] as keyof typeof localeCN] = (localeCN as Record<string, string>)[
              key
            ] as never;
            return acc;
          },
          {} as { -readonly [key in keyof typeof localeCN]: `${(typeof localeCN)[key]} 2` }
        ),
        alternative: Object.keys(noLocale).reduce(
          (acc, key) => {
            acc[noLocale[key as keyof typeof noLocale] as keyof typeof localeCN] =
              `${(localeCN as Record<string, string>)[key]} 2` as never;
            return acc;
          },
          {} as { -readonly [key in keyof typeof localeCN]: `${(typeof localeCN)[key]} 2` }
        ),
      },
    },
  });
};

export default initInstance;
