import { useMemo } from 'react';
import { createInstance, type i18n } from 'i18next';
import { getGlobalValueFromUrl } from '../utils/global';
import enUS from './langs/en-US';
import zhCN from './langs/zh-CN';

export const resources = {
  en: { translation: enUS },
  'en-US': { translation: enUS },
  'zh-CN': { translation: zhCN },
} as const;

export type StorybookLocale = keyof typeof resources;

const storyI18n: i18n = createInstance({});
const globalLocale = getGlobalValueFromUrl('locale');

void storyI18n.init({
  lng: globalLocale === 'zh-CN' ? 'zh-CN' : 'en-US',
  fallbackLng: 'en-US',
  initImmediate: false,
  interpolation: {
    escapeValue: false,
  },
  resources,
});

export const storyT: i18n['t'] = ((...args) => {
  return storyI18n.t(...args);
}) as i18n['t'];

export function useStoryLocale() {
  const globalLocale = getGlobalValueFromUrl('locale');

  return globalLocale === 'zh-CN' ? 'zh-CN' : 'en-US';
}

export function useStoryT() {
  const locale = useStoryLocale();

  return useMemo(
    () =>
      ((...args: Parameters<i18n['t']>) => {
        const [key, options] = args;

        if (options && typeof options === 'object') {
          return storyI18n.t(key, { ...options, lng: locale } as never);
        }

        return storyI18n.t(key, { lng: locale } as never);
      }) as i18n['t'],
    [locale],
  );
}

export default storyI18n;
