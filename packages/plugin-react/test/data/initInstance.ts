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
        },
        alternative: {
          greeting: 'Hi',
        },
        override: {
          greeting: 'Hey',
        },
      },
      'zh-CN': {
        translation: {
          greeting: '你好',
        },
        alternative: {
          greeting: '嗨',
        },
        override: {
          greeting: '嘿',
        },
      },
    },
  });
};

export default initInstance;
