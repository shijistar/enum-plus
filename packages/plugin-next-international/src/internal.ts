import type { ImportedLocales } from 'international-types';
import type { createI18nClient } from 'next-international/client';

export interface RuntimeType {
  t?: ReturnType<ReturnType<typeof createI18nClient<ImportedLocales>>['useI18n']>;
}

/** @deprecated Internal use only. Do not use this in your application. */
export const runtime: RuntimeType = {};
