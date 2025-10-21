import type { EnumLocaleExtends } from 'enum-plus/extension';

export type LocalizeInterface = (
  // @ts-expect-error: because LocaleKeys is a user-defined type, so ignore the error here
  localeKey: (EnumLocaleExtends['LocaleKeys'] & NonNullable<string>) | undefined
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
) => any;
