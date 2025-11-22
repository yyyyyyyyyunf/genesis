'use client';

import React from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { LocaleProvider } from '@/context/LocaleContext';
import { queryClient } from '@/query/react-query-client';

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    // 在真实应用中，locale 可能会作为 prop 从服务器传递
    <QueryClientProvider client={queryClient}>
      <LocaleProvider locale="zh">
        {children}
      </LocaleProvider>
    </QueryClientProvider>
  );
}

