import React from 'react';
import dynamic from 'next/dynamic';
import { FloorComponentProps } from './types';

// Client Registry - For components that MUST run on the client
// Typically those with complex state (Tabs) or hooks
const dynamicClientFloor = (importFunc: () => Promise<React.ComponentType<any>>) => {
  return dynamic(importFunc, {
    loading: () => <div className="w-full h-24 animate-pulse bg-gray-100 rounded-md m-4" />,
    ssr: true // We want SSR for client components too
  });
};

export const ClientRegistry: Record<string, React.ComponentType<FloorComponentProps>> = {
  // Tab is inherently interactive (useState), so it lives here
  Tab: dynamicClientFloor(() => import('./Tab').then(mod => mod.Tab)),
  
  // Shelf might have infinite scroll or add-to-cart in future, so keeping it client for now
  // But strictly speaking, a static grid COULD be RSC. Let's keep it client to demonstrate mixing.
  Shelf: dynamicClientFloor(() => import('./Shelf').then(mod => mod.Shelf)),
};

