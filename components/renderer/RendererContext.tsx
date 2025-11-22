import { createContext, useContext, ReactNode } from 'react';

export type RenderFloorFunction = (floor: any) => ReactNode;

const RendererContext = createContext<RenderFloorFunction | null>(null);

export const useRenderer = () => {
  const renderer = useContext(RendererContext);
  if (!renderer) {
    throw new Error('useRenderer must be used within a RendererProvider');
  }
  return renderer;
};

export const RendererProvider = RendererContext.Provider;

