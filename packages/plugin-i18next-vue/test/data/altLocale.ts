import type { localeCN, localeEN, StandardWeekConfig } from '@enum-plus/test/data/week-config';
// eslint-disable-next-line import/no-unresolved
import { noLocale } from '@enum-plus/test/data/week-config';

export const getAltData = (options: {
  locales: typeof localeEN | typeof localeCN | typeof noLocale;
  StandardWeekConfig: typeof StandardWeekConfig;
}) => {
  const { locales, StandardWeekConfig } = options;
  const altStandardWeekConfig = Object.keys(StandardWeekConfig).reduce(
    (acc, key) => {
      acc[key as keyof typeof StandardWeekConfig] = {
        ...StandardWeekConfig[key as keyof typeof StandardWeekConfig],
        label: `alternative:${noLocale[key as keyof typeof noLocale]}` as never,
      } as never;
      return acc;
    },
    {} as {
      -readonly [key in keyof typeof StandardWeekConfig]: Omit<(typeof StandardWeekConfig)[key], 'label'> & {
        label: `alternative:${(typeof noLocale)[key]}`;
      };
    }
  );
  const AltLocales = Object.keys(noLocale).reduce(
    (acc, key) => {
      acc[`alternative:${noLocale[key as keyof typeof noLocale]}`] =
        `${(locales as Record<string, string>)[key]} 2` as never;
      acc[`alternative:foo.${noLocale[key as keyof typeof noLocale]}`] =
        `${(locales as Record<string, string>)[key]} 2` as never;
      return acc;
    },
    {} as {
      -readonly [key in `alternative:${(typeof noLocale)[keyof typeof noLocale]}`]: string;
    } & {
      -readonly [key in `alternative:foo.${(typeof noLocale)[keyof typeof noLocale]}`]: string;
    }
  );
  return {
    AltStandardWeekConfig: altStandardWeekConfig,
    AltLocales,
  };
};
