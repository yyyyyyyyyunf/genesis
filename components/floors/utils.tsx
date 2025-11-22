import React from 'react';
import dynamic from 'next/dynamic';

// Client Registry Helper - For components that MUST run on the client
// Typically those with complex state (Tabs) or hooks
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const dynamicClientFloor = (importFunc: () => Promise<React.ComponentType<any>>) => {
  return dynamic(importFunc, {
    loading: () => <div className="w-full h-24 animate-pulse bg-gray-100 rounded-md m-4" />,
    ssr: true // We want SSR for client components too
  });
};

