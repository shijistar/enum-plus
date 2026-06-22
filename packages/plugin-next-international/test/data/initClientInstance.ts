'use client';

import { createI18nClient } from 'next-international/client';
// eslint-disable-next-line import/no-unresolved
import enUS from '@enum-plus/test/i18n/en-US.json';
// eslint-disable-next-line import/no-unresolved
import neutral from '@enum-plus/test/i18n/neutral.json';
// eslint-disable-next-line import/no-unresolved
import zhCN from '@enum-plus/test/i18n/zh-CN.json';

export const runtime = {} as {
  i18n: ReturnType<typeof createI18nClient<{ en: () => Promise<LocalesType>; 'zh-CN': () => Promise<LocalesType> }>>;
};

export const initClientInstance = () => {
  runtime.i18n = createI18nClient({
    en: async () => ({
      default: {
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
      },
    }),
    'zh-CN': async () => ({
      default: {
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
      },
    }),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  }) as any;
};

export type LocalesType = { -readonly [key in keyof typeof neutral]: string } & {
  -readonly [key in `alternative.${keyof typeof neutral}`]: string;
};
