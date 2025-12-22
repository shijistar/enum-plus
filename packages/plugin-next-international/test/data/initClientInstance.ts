'use client';

// eslint-disable-next-line import/no-unresolved
import { localeCN, localeEN, noLocale } from '@enum-plus/test/data/week-config';
import { createI18nClient } from 'next-international/client';

export const runtime = {} as {
  i18n: ReturnType<typeof createI18nClient<{ en: () => Promise<LocalesType>; 'zh-CN': () => Promise<LocalesType> }>>;
};

export const initClientInstance = () => {
  runtime.i18n = createI18nClient({
    en: async () => ({
      default: {
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
      },
    }),
    'zh-CN': async () => ({
      default: {
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
      },
    }),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  }) as any;
};

export type LocalesType = { -readonly [key in keyof typeof localeEN]: string } & {
  -readonly [key in `alternative.${keyof typeof localeEN}`]: string;
};
