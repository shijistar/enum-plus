import { useEffect } from 'react';
import { runtime } from '../data/initClientInstance';

const AutoChangeLangPage = (props: { children?: React.ReactNode }) => {
  const { children } = props;
  const { useCurrentLocale, useChangeLocale } = runtime.i18n;

  const locale = useCurrentLocale();
  const change = useChangeLocale();

  useEffect(() => {
    // Simulate language change after 1 second
    const timer = setTimeout(() => {
      const newLocale = locale === 'zh-CN' ? 'en' : 'zh-CN';
      change(newLocale);
    }, 100);

    return () => clearTimeout(timer);
  }, [locale]);

  return children;
};

export default AutoChangeLangPage;
