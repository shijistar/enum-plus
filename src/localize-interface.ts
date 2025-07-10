import type { EnumLocaleExtends } from 'enum-plus/extension';

export type LocalizeInterface = (
  content: EnumLocaleExtends['LocaleKeys'] | NonNullable<string> | undefined
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
) => any;
