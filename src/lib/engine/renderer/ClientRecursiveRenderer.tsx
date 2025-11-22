'use client';

import React, { Suspense } from 'react';
import { FullRegistry } from '@/widgets/full-registry';
import { Floor } from '../types';
import { getComponentKey } from '../component-map';

interface ClientRecursiveRendererProps {
  floors: Floor[];
}

export const ClientRecursiveRenderer = ({ floors }: ClientRecursiveRendererProps) => {
  if (!floors || floors.length === 0) return null;

  return (
    <>
      {floors.map((floor) => {
        const componentKey = getComponentKey(floor.type);
        const Component = componentKey ? FullRegistry[componentKey] : undefined;

        if (!Component) {
          return (
            <div key={floor.id} className="p-4 border border-red-200 bg-red-50 text-red-600">
              未知组件: {floor.type} {componentKey ? `(${componentKey})` : ''}
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
