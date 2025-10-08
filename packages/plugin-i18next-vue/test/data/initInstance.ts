// eslint-disable-next-line import/no-unresolved
import { localeCN, localeEN, noLocale } from '@enum-plus/test/data/week-config';
import i18next from 'i18next';

const initInstance = () => {
  // eslint-disable-next-line import/no-named-as-default-member
  i18next.init({
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
