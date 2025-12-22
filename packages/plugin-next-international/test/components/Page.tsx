import { AppRouterContext } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { PathnameContext, PathParamsContext } from 'next/dist/shared/lib/hooks-client-context.shared-runtime';
import { PatchedI18nProviderClient } from '../../src/index';
import { runtime } from '../data/initClientInstance';

const Page = (props: { locale?: string; children?: React.ReactNode }) => {
  const { locale = 'en', children } = props;
  return (
    <AppRouterContext
      value={{
        push: () => Promise.resolve(),
        replace: () => Promise.resolve(),
        prefetch: () => Promise.resolve(),
        back: () => undefined,
        forward: () => undefined,
        refresh: () => undefined,
      }}
    >
      <PathParamsContext value={{ locale }}>
        <PathnameContext value="/">
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          <PatchedI18nProviderClient locale={locale} I18n={runtime.i18n as any}>
            {children}
          </PatchedI18nProviderClient>
        </PathnameContext>
      </PathParamsContext>
    </AppRouterContext>
  );
};

export default Page;
