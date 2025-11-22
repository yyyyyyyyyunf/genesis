'use client';

import React, { Suspense } from 'react';
import { ComponentRegistry } from '../floors/registry';
import { RendererProvider } from './RendererContext';

export interface Floor {
  id: string;
  type: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;
}

interface RecursiveRendererProps {
  floors: Floor[];
}

// Extracted render function - pure and stable
const renderFloor = (floor: Floor) => {
  const Component = ComponentRegistry[floor.type];
  
  if (!Component) {
    console.warn(`Unknown component type: ${floor.type}`);
    return (
      <div key={floor.id} className="p-4 border border-red-200 bg-red-50 text-red-600">
        Unknown Component: {floor.type}
      </div>
    );
  }

  return (
    <Suspense key={floor.id} fallback={<div className="w-full h-20 bg-gray-50 animate-pulse" />}>
      <Component data={floor.data} />
    </Suspense>
  );
};

export const RecursiveRenderer = ({ floors }: RecursiveRendererProps) => {
  return (
    <RendererProvider value={renderFloor}>
      <div className="w-full max-w-md mx-auto bg-white min-h-screen shadow-xl overflow-hidden">
        {floors.map((floor) => (
          <React.Fragment key={floor.id}>
            {renderFloor(floor)}
          </React.Fragment>
        ))}
      </div>
    </RendererProvider>
  );
};
