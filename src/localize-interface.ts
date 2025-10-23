import type { EnumLocaleExtends } from 'enum-plus/extension';

export type LocalizeInterface = (
  localeKey: EnumLocaleExtends['LocaleKeys'] | undefined
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
) => any;
