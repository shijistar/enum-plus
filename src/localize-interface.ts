import type { EnumLocaleExtends } from 'enum-plus/extension';

export type LocalizeInterface = (
  localeKey: Exclude<EnumLocaleExtends['LocaleKeys'], (...args: any[]) => string | undefined> | undefined
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
) => any;
