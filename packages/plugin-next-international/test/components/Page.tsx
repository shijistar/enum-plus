import { useState } from 'react';
import { AppRouterContext } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { PathnameContext, PathParamsContext } from 'next/dist/shared/lib/hooks-client-context.shared-runtime';
import { PatchedI18nProviderClient } from '../../src/index';
import { runtime } from '../data/initClientInstance';

const Page = (props: { locale?: string; children?: React.ReactNode }) => {
  const { locale = 'en', children } = props;

  const [lang, setLang] = useState(locale);

  return (
    <AppRouterContext
      value={{
        push: async (url) => {
          const urlObj = new URL(url.toString(), 'http://example.com');
          const newLang = urlObj.pathname.startsWith('/zh-CN') ? 'zh-CN' : 'en';
          if (newLang !== lang) {
            setLang(newLang);
          }
        },
        replace: () => Promise.resolve(),
        prefetch: () => Promise.resolve(),
        back: () => undefined,
        forward: () => undefined,
        refresh: () => undefined,
      }}
    >
      <PathParamsContext value={{ locale: lang }}>
        <PathnameContext value="/">
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          <PatchedI18nProviderClient locale={lang} I18n={runtime.i18n as any}>
            {children}
          </PatchedI18nProviderClient>
        </PathnameContext>
      </PathParamsContext>
    </AppRouterContext>
  );
};

export default Page;
