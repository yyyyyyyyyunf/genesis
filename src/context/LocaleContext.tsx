'use client';

import React, { createContext, useContext, ReactNode } from 'react';

type Locale = 'en' | 'zh' | 'ja' | 'ko';

interface LocaleContextType {
  locale: Locale;
}

// 默认为 'en'，如请求所示
const LocaleContext = createContext<LocaleContextType>({
  locale: 'en',
});

export const useLocale = () => useContext(LocaleContext);

interface LocaleProviderProps {
  children: ReactNode;
  // 在真实应用中，这可能由检测到请求语言环境的 Server Component 传递
  locale?: Locale;
}

export const LocaleProvider = ({ children, locale = 'en' }: LocaleProviderProps) => {
  return (
    <LocaleContext.Provider value={{ locale }}>
      {children}
    </LocaleContext.Provider>
  );
};

