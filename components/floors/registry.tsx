import dynamic from 'next/dynamic';
import { SchemaRegistry } from './schemas';
import React from 'react';

// Define a generic props interface for all floor components
export interface FloorComponentProps<T = unknown> {
  data: T;
}

// Helper to create a dynamic component with a default loading state
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const dynamicFloor = (importFunc: () => Promise<React.ComponentType<any>>) => {
  return dynamic(importFunc, {
    loading: () => <div className="w-full h-24 animate-pulse bg-gray-100 rounded-md m-4" />,
  });
};

// The registry maps component names to React components that accept a 'data' prop
// We use 'unknown' for data to avoid 'any', but still allow flexibility
export const ComponentRegistry: Record<string, React.ComponentType<FloorComponentProps>> = {
  Text: dynamicFloor(() => import('./Text').then(mod => mod.Text)),
  Shelf: dynamicFloor(() => import('./Shelf').then(mod => mod.Shelf)),
  Tab: dynamicFloor(() => import('./Tab').then(mod => mod.Tab)),
  Image: dynamicFloor(() => import('./Image').then(mod => mod.Image)),
};

export { SchemaRegistry };
