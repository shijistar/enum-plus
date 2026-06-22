'use client';

import { createI18nServer, setStaticParamsLocale } from 'next-international/server';
import type { LocalesType } from './initClientInstance';
// eslint-disable-next-line import/no-unresolved
import enUS from '@enum-plus/test/i18n/en-US.json';
// eslint-disable-next-line import/no-unresolved
import neutral from '@enum-plus/test/i18n/neutral.json';
// eslint-disable-next-line import/no-unresolved
import zhCN from '@enum-plus/test/i18n/zh-CN.json';

export const i18n = {} as ReturnType<
  typeof createI18nServer<{ en: () => Promise<LocalesType>; 'zh-CN': () => Promise<LocalesType> }>
>;

export const initServerInstance = () => {
  setStaticParamsLocale('en');
  const instance = createI18nServer({
    en: async () => ({
      ...Object.keys(neutral).reduce(
        (acc, key) => {
          acc[key as keyof typeof neutral] = enUS[key as keyof typeof neutral];
          return acc;
        },
        {} as { -readonly [key in keyof typeof neutral]: string },
      ),
      ...Object.keys(neutral).reduce(
        (acc, key) => {
          acc[('alternative.' + key) as `alternative.${keyof typeof neutral}`] =
            `${enUS[key as keyof typeof neutral]} 2`;
          return acc;
        },
        {} as { -readonly [key in `alternative.${keyof typeof neutral}`]: string },
      ),
    }),
    'zh-CN': async () => ({
      ...Object.keys(neutral).reduce(
        (acc, key) => {
          acc[key as keyof typeof neutral] = zhCN[key as keyof typeof neutral];
          return acc;
        },
        {} as { -readonly [key in keyof typeof neutral]: string },
      ),
      ...Object.keys(neutral).reduce(
        (acc, key) => {
          acc[('alternative.' + key) as `alternative.${keyof typeof neutral}`] =
            `${zhCN[key as keyof typeof neutral]} 2`;
          return acc;
        },
        {} as { -readonly [key in `alternative.${keyof typeof neutral}`]: string },
      ),
    }),
  });

  i18n.getI18n = instance.getI18n;
  i18n.getScopedI18n = instance.getScopedI18n;
  i18n.getStaticParams = instance.getStaticParams;
};
