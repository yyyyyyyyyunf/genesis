import React from 'react';
import { Floor } from '../../types';
import { ServerFloorItem } from './ServerFloorItem';

interface ServerRecursiveRendererProps {
  floors: Floor[];
}

// 这是一个异步 Server Component
export const ServerRecursiveRenderer = async ({ floors }: ServerRecursiveRendererProps) => {
  return (
    <div className="w-full max-w-md mx-auto bg-white min-h-screen shadow-xl overflow-hidden">
      {floors.map((floor) => (
        <React.Fragment key={floor.id}>
          <ServerFloorItem floor={floor} />
        </React.Fragment>
      ))}
    </div>
  );
};
