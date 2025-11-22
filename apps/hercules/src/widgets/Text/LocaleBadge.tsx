'use client';

import React from 'react';
import { useLocale } from '@/context/LocaleContext';

export const LocaleBadge = () => {
  const { locale } = useLocale();
  return (
    <span className="inline-block ml-2 px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded-full align-middle">
      {locale}
    </span>
  );
};

