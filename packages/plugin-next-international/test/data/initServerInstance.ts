'use client';

// eslint-disable-next-line import/no-unresolved
import { localeCN, localeEN, noLocale } from '@enum-plus/test/data/week-config';
import { createI18nServer, setStaticParamsLocale } from 'next-international/server';
import type { LocalesType } from './initClientInstance';

export const i18n = {} as ReturnType<
  typeof createI18nServer<{ en: () => Promise<LocalesType>; 'zh-CN': () => Promise<LocalesType> }>
>;

export const initServerInstance = () => {
  setStaticParamsLocale('en');
  const instance = createI18nServer({
    en: async () => ({
      ...Object.keys(noLocale).reduce(
        (acc, key) => {
          acc[noLocale[key as keyof typeof noLocale] as keyof typeof localeEN] = (localeEN as Record<string, string>)[
            key
          ] as never;
          return acc;
        },
        {} as { -readonly [key in keyof typeof localeEN]: string }
      ),
      ...Object.keys(noLocale).reduce(
        (acc, key) => {
          acc[('alternative.' + noLocale[key as keyof typeof noLocale]) as `alternative.${keyof typeof localeEN}`] =
            `${(localeEN as Record<string, string>)[key]} 2` as never;
          return acc;
        },
        {} as { -readonly [key in `alternative.${keyof typeof localeEN}`]: string }
      ),
    }),
    'zh-CN': async () => ({
      ...Object.keys(noLocale).reduce(
        (acc, key) => {
          acc[noLocale[key as keyof typeof noLocale] as keyof typeof localeEN] = (localeCN as Record<string, string>)[
            key
          ] as never;
          return acc;
        },
        {} as { -readonly [key in keyof typeof localeEN]: string }
      ),
      ...Object.keys(noLocale).reduce(
        (acc, key) => {
          acc[('alternative.' + noLocale[key as keyof typeof noLocale]) as `alternative.${keyof typeof localeEN}`] =
            `${(localeCN as Record<string, string>)[key]} 2` as never;
          return acc;
        },
        {} as { -readonly [key in `alternative.${keyof typeof localeEN}`]: string }
      ),
    }),
  });

  i18n.getI18n = instance.getI18n;
  i18n.getScopedI18n = instance.getScopedI18n;
  i18n.getStaticParams = instance.getStaticParams;
};
