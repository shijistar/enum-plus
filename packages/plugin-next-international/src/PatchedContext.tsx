'use client';

import { createContext } from 'react';
import type { ImportedLocales } from 'international-types';
import type { createI18nClient } from 'next-international/client';

export interface PatchedContextType {
  /**
   * - **EN:** The `I18n` instance created by `createI18nClient`.
   * - **CN:** 通过 `createI18nClient` 创建的 `I18n` 实例。
   */
  I18n: ReturnType<typeof createI18nClient<ImportedLocales>>;
}

const PatchedContext = createContext<PatchedContextType>({
  I18n: undefined!,
});

export default PatchedContext;
