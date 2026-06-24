import type { i18n } from 'i18next';
// eslint-disable-next-line import/no-unresolved
import enUS from '@enum-plus/test/i18n/en-US.json';
// eslint-disable-next-line import/no-unresolved
import neutral from '@enum-plus/test/i18n/neutral.json';
// eslint-disable-next-line import/no-unresolved
import zhCN from '@enum-plus/test/i18n/zh-CN.json';

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
          ...Object.keys(neutral).reduce(
            (acc, key) => {
              acc[key as keyof typeof neutral] = enUS[key as keyof typeof neutral] as never;
              return acc;
            },
            {} as { -readonly [key in keyof typeof neutral]: `${(typeof neutral)[key]} 2` },
          ),
        },
        alternative: {
          greeting: 'Hi',
          ...Object.keys(neutral).reduce(
            (acc, key) => {
              acc[key as keyof typeof neutral] = `${enUS[key as keyof typeof neutral]} 2` as never;
              return acc;
            },
            {} as { -readonly [key in keyof typeof neutral]: `${(typeof neutral)[key]} 2` },
          ),
        },
        override: {
          greeting: 'Hey',
        },
      },
      'zh-CN': {
        translation: {
          greeting: '你好',
          ...Object.keys(neutral).reduce(
            (acc, key) => {
              acc[key as keyof typeof neutral] = zhCN[key as keyof typeof zhCN] as never;
              return acc;
            },
            {} as { -readonly [key in keyof typeof neutral]: `${(typeof neutral)[key]} 2` },
          ),
        },
        alternative: {
          greeting: '嗨',
          ...Object.keys(neutral).reduce(
            (acc, key) => {
              acc[key as keyof typeof neutral] = `${zhCN[key as keyof typeof zhCN]} 2` as never;
              return acc;
            },
            {} as { -readonly [key in keyof typeof neutral]: `${(typeof neutral)[key]} 2` },
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
