'use client';

import React from 'react';
import { LocaleProvider } from '@/context/LocaleContext';

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    // In a real app, locale might be passed as a prop from the server
    <LocaleProvider locale="zh">
      {children}
    </LocaleProvider>
  );
}

