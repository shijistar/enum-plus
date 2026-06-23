import type { i18n } from 'i18next';
import { initReactI18next } from 'react-i18next';
// eslint-disable-next-line import/no-unresolved
import enUS from '@enum-plus/test/i18n/en-US.json';
// eslint-disable-next-line import/no-unresolved
import neutral from '@enum-plus/test/i18n/neutral.json';
// eslint-disable-next-line import/no-unresolved
import zhCN from '@enum-plus/test/i18n/zh-CN.json';

const initInstance = (instance: i18n) => {
  instance.use(initReactI18next).init({
    lng: 'en',
    ns: ['translation', 'alternative'],
    defaultNS: 'translation',
    fallbackLng: 'en',
    resources: {
      en: {
        translation: Object.keys(neutral).reduce(
          (acc, key) => {
            acc[key as keyof typeof neutral] = enUS[key as keyof typeof enUS];
            return acc;
          },
          {} as { -readonly [key in keyof typeof neutral]: `${(typeof enUS)[key]}` },
        ),
        alternative: Object.keys(neutral).reduce(
          (acc, key) => {
            acc[key as keyof typeof neutral] = `${enUS[key as keyof typeof enUS]} 2`;
            return acc;
          },
          {} as { -readonly [key in keyof typeof neutral]: `${(typeof enUS)[key]} 2` },
        ),
      },
      'zh-CN': {
        translation: Object.keys(neutral).reduce(
          (acc, key) => {
            acc[key as keyof typeof neutral] = zhCN[key as keyof typeof zhCN];
            return acc;
          },
          {} as { -readonly [key in keyof typeof zhCN]: `${(typeof zhCN)[key]}` },
        ),
        alternative: Object.keys(neutral).reduce(
          (acc, key) => {
            acc[key as keyof typeof neutral] = `${zhCN[key as keyof typeof zhCN]} 2`;
            return acc;
          },
          {} as { -readonly [key in keyof typeof neutral]: `${(typeof zhCN)[key]} 2` },
        ),
      },
    },
  });
};

export default initInstance;
