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
            acc[noLocale[key as keyof typeof noLocale] as (typeof noLocale)[keyof typeof noLocale]] = (
              localeEN as Record<string, string>
            )[key];
            return acc;
          },
          {} as {
            -readonly [key in (typeof noLocale)[keyof typeof noLocale]]: string;
          }
        ),
        alternative: Object.keys(noLocale).reduce(
          (acc, key) => {
            acc[noLocale[key as keyof typeof noLocale] as (typeof noLocale)[keyof typeof noLocale]] =
              `${(localeEN as Record<string, string>)[key]} 2`;
            acc[
              ('foo.' + noLocale[key as keyof typeof noLocale]) as `foo.${(typeof noLocale)[keyof typeof noLocale]}`
            ] = `${(localeEN as Record<string, string>)[key]} 2`;
            return acc;
          },
          {} as {
            -readonly [key in (typeof noLocale)[keyof typeof noLocale]]: `${string} 2`;
          } & {
            -readonly [key in `foo.${(typeof noLocale)[keyof typeof noLocale]}`]: `${string} 2`;
          }
        ),
      },
      'zh-CN': {
        translation: Object.keys(noLocale).reduce(
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
        alternative: Object.keys(noLocale).reduce(
          (acc, key) => {
            acc[noLocale[key as keyof typeof noLocale] as (typeof noLocale)[keyof typeof noLocale]] =
              `${(localeCN as Record<string, string>)[key]} 2`;
            acc[
              ('foo.' + noLocale[key as keyof typeof noLocale]) as `foo.${(typeof noLocale)[keyof typeof noLocale]}`
            ] = `${(localeCN as Record<string, string>)[key]} 2`;
            return acc;
          },
          {} as {
            -readonly [key in (typeof noLocale)[keyof typeof noLocale]]: `${string} 2`;
          } & {
            -readonly [key in `foo.${(typeof noLocale)[keyof typeof noLocale]}`]: `${string} 2`;
          }
        ),
      },
    },
  });
};

export default initInstance;
