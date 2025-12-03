import { type FC, useEffect } from 'react';
import type { ImportedLocales } from 'international-types';
import type { createI18nClient } from 'next-international/client';
import { runtime } from './internal';

export type PatchedI18nProviderClientProps = Parameters<
  ReturnType<typeof createI18nClient<ImportedLocales>>['I18nProviderClient']
>[0] & {
  /**
   * - **EN:** The `I18n` instance created by `createI18nClient`.
   * - **CN:** 通过 `createI18nClient` 创建的 `I18n` 实例。
   */
  I18n: ReturnType<typeof createI18nClient<ImportedLocales>>;
};

const PatchedI18nProviderClient: FC<PatchedI18nProviderClientProps> = (props) => {
  const { I18n, children, ...rest } = props;
  const { useI18n, I18nProviderClient } = I18n;
  const t = useI18n();

  useEffect(() => {
    runtime.t = t;
  }, [t]);

  return <I18nProviderClient {...rest}>{children}</I18nProviderClient>;
};

export default PatchedI18nProviderClient;
