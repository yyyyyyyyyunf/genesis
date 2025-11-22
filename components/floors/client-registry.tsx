import React from 'react';
import { FloorComponentProps } from './types';
import { dynamicClientFloor } from './utils';

export const ClientRegistry: Record<string, React.ComponentType<FloorComponentProps>> = {
  // Tab is inherently interactive (useState), so it lives here
  Tab: dynamicClientFloor(() => import('./Tab').then(mod => mod.Tab)),
  
  // Shelf might have infinite scroll or add-to-cart in future, so keeping it client for now
  // But strictly speaking, a static grid COULD be RSC. Let's keep it client to demonstrate mixing.
  Shelf: dynamicClientFloor(() => import('./Shelf').then(mod => mod.Shelf)),
};
