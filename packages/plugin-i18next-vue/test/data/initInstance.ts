import i18next from 'i18next';
// eslint-disable-next-line import/no-unresolved
import enUS from '@enum-plus/test/i18n/en-US.json';
// eslint-disable-next-line import/no-unresolved
import neutral from '@enum-plus/test/i18n/neutral.json';
// eslint-disable-next-line import/no-unresolved
import zhCN from '@enum-plus/test/i18n/zh-CN.json';

const initInstance = () => {
  // eslint-disable-next-line import/no-named-as-default-member
  i18next.init({
    lng: 'en',
    ns: ['translation', 'alternative'],
    defaultNS: 'translation',
    fallbackLng: 'en',
    resources: {
      en: {
        translation: Object.keys(neutral).reduce(
          (acc, key) => {
            acc[key as keyof typeof neutral] = enUS[key as keyof typeof neutral];
            return acc;
          },
          {} as {
            -readonly [key in keyof typeof neutral]: string;
          },
        ),
        alternative: Object.keys(neutral).reduce(
          (acc, key) => {
            acc[key as keyof typeof neutral] = `${enUS[key as keyof typeof neutral]} 2`;
            acc[('foo.' + key) as `foo.${keyof typeof neutral}`] = `${enUS[key as keyof typeof neutral]} 2`;
            return acc;
          },
          {} as {
            -readonly [key in keyof typeof neutral]: `${string} 2`;
          } & {
            -readonly [key in `foo.${keyof typeof neutral}`]: `${string} 2`;
          },
        ),
      },
      'zh-CN': {
        translation: Object.keys(neutral).reduce(
          (acc, key) => {
            acc[key as keyof typeof neutral] = zhCN[key as keyof typeof neutral];
            return acc;
          },
          {} as {
            -readonly [key in keyof typeof neutral]: string;
          },
        ),
        alternative: Object.keys(neutral).reduce(
          (acc, key) => {
            acc[key as keyof typeof neutral] = `${zhCN[key as keyof typeof neutral]} 2`;
            acc[('foo.' + key) as `foo.${keyof typeof neutral}`] = `${zhCN[key as keyof typeof neutral]} 2`;
            return acc;
          },
          {} as {
            -readonly [key in keyof typeof neutral]: `${string} 2`;
          } & {
            -readonly [key in `foo.${keyof typeof neutral}`]: `${string} 2`;
          },
        ),
      },
    },
  });
};

export default initInstance;
