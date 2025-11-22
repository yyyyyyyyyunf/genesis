'use client';

import React, { createContext, useContext, ReactNode } from 'react';

type Locale = 'en' | 'zh' | 'ja' | 'ko';

interface LocaleContextType {
  locale: Locale;
}

// Default to 'en' as requested
const LocaleContext = createContext<LocaleContextType>({
  locale: 'en',
});

export const useLocale = () => useContext(LocaleContext);

interface LocaleProviderProps {
  children: ReactNode;
  // In a real app, this might be passed from a Server Component that detected the request locale
  locale?: Locale;
}

export const LocaleProvider = ({ children, locale = 'en' }: LocaleProviderProps) => {
  return (
    <LocaleContext.Provider value={{ locale }}>
      {children}
    </LocaleContext.Provider>
  );
};

