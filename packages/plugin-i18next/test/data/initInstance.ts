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
        translation: Object.keys(neutral).reduce(
          (acc, key) => {
            acc[key as keyof typeof neutral] = (enUS as Record<string, string>)[key] as never;
            return acc;
          },
          {} as { -readonly [key in keyof typeof enUS]: `${(typeof enUS)[key]} 2` },
        ),
        alternative: Object.keys(neutral).reduce(
          (acc, key) => {
            acc[key as keyof typeof neutral] = `${(enUS as Record<string, string>)[key]} 2` as never;
            return acc;
          },
          {} as { -readonly [key in keyof typeof enUS]: `${(typeof enUS)[key]} 2` },
        ),
      },
      'zh-CN': {
        translation: Object.keys(neutral).reduce(
          (acc, key) => {
            acc[key as keyof typeof neutral] = (zhCN as Record<string, string>)[key] as never;
            return acc;
          },
          {} as { -readonly [key in keyof typeof zhCN]: `${(typeof zhCN)[key]} 2` },
        ),
        alternative: Object.keys(neutral).reduce(
          (acc, key) => {
            acc[key as keyof typeof neutral] = `${(zhCN as Record<string, string>)[key]} 2` as never;
            return acc;
          },
          {} as { -readonly [key in keyof typeof zhCN]: `${(typeof zhCN)[key]} 2` },
        ),
      },
    },
  });
};

export default initInstance;
