'use client';

import React, { createContext, useContext } from 'react';
import { FloorComponentProps } from '@/lib/engine/types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type RegistryType = Record<string, React.ComponentType<FloorComponentProps<any>>>;

const RegistryContext = createContext<RegistryType | null>(null);

export const useRegistry = () => {
  const registry = useContext(RegistryContext);
  if (!registry) {
    throw new Error('useRegistry must be used within a RegistryProvider');
  }
  return registry;
};

export const RegistryProvider = ({ 
  registry, 
  children 
}: { 
  registry: RegistryType; 
  children: React.ReactNode 
}) => {
  return (
    <RegistryContext.Provider value={registry}>
      {children}
    </RegistryContext.Provider>
  );
};
