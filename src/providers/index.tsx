'use client';

import React from 'react';
import { LocaleProvider } from '@/context/LocaleContext';

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    // 在真实应用中，locale 可能会作为 prop 从服务器传递
    <LocaleProvider locale="zh">
      {children}
    </LocaleProvider>
  );
}

