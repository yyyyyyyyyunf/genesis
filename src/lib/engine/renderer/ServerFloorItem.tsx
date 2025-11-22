import React, { Suspense } from 'react';
import { ServerRegistry } from '@/widgets/server-registry';
import { ClientRegistry } from '@/widgets/client-registry';
import { Floor } from '../types';

export const ServerFloorItem = ({ floor }: { floor: Floor }) => {
  // 1. 优先尝试 Server Registry (RSC 优先)
  const ServerComponent = ServerRegistry[floor.type];
  if (ServerComponent) {
    return <ServerComponent data={floor.data} />;
  }

  // 2. 尝试 Client Registry
  const ClientComponent = ClientRegistry[floor.type];
  if (ClientComponent) {
    return (
      <Suspense fallback={<div className="w-full h-20 bg-gray-50 animate-pulse" />}>
        <ClientComponent data={floor.data} />
      </Suspense>
    );
  }

  // 3. 兜底处理
  console.warn(`未知的组件类型: ${floor.type}`);
  return (
    <div className="p-4 border border-red-200 bg-red-50 text-red-600">
      未知组件: {floor.type}
    </div>
  );
};
