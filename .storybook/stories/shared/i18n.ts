import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import { resources } from '../../locales';
import { getGlobalValueFromUrl } from '../../utils/global';

let initialized = false;
const storyI18n = i18next;

export function ensureStoryI18n() {
  if (initialized) {
    return storyI18n;
  }

  storyI18n.use(initReactI18next).init({
    lng: getGlobalValueFromUrl('locale') === 'zh-CN' ? 'zh-CN' : 'en-US',
    fallbackLng: 'en-US',
    initImmediate: false,
    interpolation: {
      escapeValue: false,
    },
    resources,
  });

  initialized = true;
  return storyI18n;
}
