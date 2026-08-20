import { createContext } from 'react';

const RefreshEnumContext = createContext<{ locale?: string; changeLang: (locale: string) => void }>({
  changeLang: () => {
    // stub method
  },
});

export default RefreshEnumContext;
