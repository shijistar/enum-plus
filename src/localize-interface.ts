import type { EnumLocaleExtends } from 'enum-plus-extend';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type LocalizeInterface = (content: EnumLocaleExtends['LocaleKeys'] | NonNullable<string> | undefined) => any;
