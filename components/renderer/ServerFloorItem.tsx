import React, { Suspense } from 'react';
import { ServerRegistry } from '../floors/server-registry';
import { ClientRegistry } from '../floors/client-registry';
import { Floor } from '../floors/types';

export const ServerFloorItem = ({ floor }: { floor: Floor }) => {
  // 1. Try Server Registry first (RSC Preference)
  const ServerComponent = ServerRegistry[floor.type];
  if (ServerComponent) {
    return <ServerComponent data={floor.data} />;
  }

  // 2. Try Client Registry
  const ClientComponent = ClientRegistry[floor.type];
  if (ClientComponent) {
    return (
      <Suspense fallback={<div className="w-full h-20 bg-gray-50 animate-pulse" />}>
        <ClientComponent data={floor.data} />
      </Suspense>
    );
  }

  // 3. Fallback
  console.warn(`Unknown component type: ${floor.type}`);
  return (
    <div className="p-4 border border-red-200 bg-red-50 text-red-600">
      Unknown Component: {floor.type}
    </div>
  );
};

