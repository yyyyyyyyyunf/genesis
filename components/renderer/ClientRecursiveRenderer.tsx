'use client';

import React, { Suspense } from 'react';
import { ClientRegistry } from '../floors/client-registry';
import { ServerRegistry } from '../floors/server-registry';
import { Floor } from '../floors/types';

interface ClientRecursiveRendererProps {
  floors: Floor[];
}

// Combined Registry for Client-Side Rendering
// When rendering on the client (e.g. inside a Tab), we need access to ALL components
const FullRegistry = { ...ServerRegistry, ...ClientRegistry };

export const ClientRecursiveRenderer = ({ floors }: ClientRecursiveRendererProps) => {
  if (!floors || floors.length === 0) return null;

  return (
    <>
      {floors.map((floor) => {
        const Component = FullRegistry[floor.type];

        if (!Component) {
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
      })}
    </>
  );
};

