import { useEffect } from 'react';
import { runtime } from '../data/initClientInstance';

const AutoChangeLangPage = (props: { locale: 'en' | 'zh-CN'; children?: React.ReactNode }) => {
  const { locale, children } = props;
  const { useChangeLocale } = runtime.i18n;

  const change = useChangeLocale();

  useEffect(() => {
    change(locale);
  }, []);

  return children;
};

export default AutoChangeLangPage;
