'use client';

// eslint-disable-next-line import/no-unresolved
import { localeCN, localeEN, noLocale } from '@enum-plus/test/data/week-config';
import { createI18nClient } from 'next-international/client';

let instance: ReturnType<
  typeof createI18nClient<{ en: () => Promise<LocalesType>; 'zh-CN': () => Promise<LocalesType> }>
> = undefined!;

export default instance;

export const initClientInstance = () => {
  instance = createI18nClient({
    en: async () => ({
      ...Object.keys(noLocale).reduce(
        (acc, key) => {
          acc[('default.' + noLocale[key as keyof typeof noLocale]) as `default.${keyof typeof localeEN}`] = (
            localeEN as Record<string, string>
          )[key] as never;
          return acc;
        },
        {} as { -readonly [key in `default.${keyof typeof localeEN}`]: string }
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
          acc[('default.' + noLocale[key as keyof typeof noLocale]) as `default.${keyof typeof localeEN}`] = (
            localeCN as Record<string, string>
          )[key] as never;
          return acc;
        },
        {} as { -readonly [key in `default.${keyof typeof localeEN}`]: string }
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  }) as any;
};

export type LocalesType = { -readonly [key in `default.${keyof typeof localeEN}`]: string } & {
  -readonly [key in `alternative.${keyof typeof localeEN}`]: string;
};
