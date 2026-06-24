import type { StandardWeekConfig } from '@enum-plus/test/data/week-config';
import type enUS from '@enum-plus/test/i18n/en-US.json';
// eslint-disable-next-line import/no-unresolved
import neutral from '@enum-plus/test/i18n/neutral.json';
import type zhCN from '@enum-plus/test/i18n/zh-CN.json';

export const getAltData = (options: {
  locales: Readonly<typeof enUS> | Readonly<typeof zhCN> | Readonly<typeof neutral>;
  StandardWeekConfig: typeof StandardWeekConfig;
}) => {
  const { locales, StandardWeekConfig } = options;
  const altStandardWeekConfig = Object.keys(StandardWeekConfig).reduce(
    (acc, key) => {
      acc[key as keyof typeof StandardWeekConfig] = {
        ...StandardWeekConfig[key as keyof typeof StandardWeekConfig],
        label: `alternative:${StandardWeekConfig[key as keyof typeof StandardWeekConfig]['label']}` as never,
      } as never;
      return acc;
    },
    {} as {
      -readonly [key in keyof typeof StandardWeekConfig]: Omit<(typeof StandardWeekConfig)[key], 'label'> & {
        label: `alternative:${(typeof StandardWeekConfig)[keyof typeof StandardWeekConfig]['label']}`;
      };
    },
  );
  const AltLocales = Object.keys(neutral).reduce(
    (acc, key) => {
      acc[`alternative:${neutral[key as keyof typeof neutral]}`] = `${locales[key as keyof typeof neutral]} 2` as never;
      return acc;
    },
    {} as { -readonly [key in `alternative:${(typeof neutral)[keyof typeof neutral]}`]: string },
  );
  return {
    AltStandardWeekConfig: altStandardWeekConfig,
    AltLocales,
  };
};
