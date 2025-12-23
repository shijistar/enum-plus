'use client';

import { type FC, type ReactNode, useEffect } from 'react';
import type { ImportedLocales } from 'international-types';
import type { createI18nClient } from 'next-international/client';
import { runtime } from './internal';
import type { PatchedContextType } from './PatchedContext';
import PatchedContext from './PatchedContext';

export type PatchedI18nProviderClientProps = Parameters<
  ReturnType<typeof createI18nClient<ImportedLocales>>['I18nProviderClient']
>[0] &
  PatchedContextType;

const PatchedI18nProviderClient: FC<PatchedI18nProviderClientProps> = (props) => {
  const { I18n, children, ...rest } = props;
  const { I18nProviderClient } = I18n;

  return (
    <I18nProviderClient {...rest}>
      <PatchedContext.Provider value={{ I18n }}>
        <Inner I18n={I18n}>{children}</Inner>
      </PatchedContext.Provider>{' '}
    </I18nProviderClient>
  );
};

function Inner(props: { I18n: ReturnType<typeof createI18nClient<ImportedLocales>>; children: ReactNode }) {
  const { I18n, children } = props;
  const { useI18n } = I18n;
  const t = useI18n();

  useEffect(() => {
    runtime.t = t;
  }, [t]);

  return children;
}

export default PatchedI18nProviderClient;
