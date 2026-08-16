import { createContext } from 'react';

const RefreshEnumContext = createContext<{ locale?: string; changeLang: (locale: string) => void }>({
  changeLang: () => {},
});

export default RefreshEnumContext;
