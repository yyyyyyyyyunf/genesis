import React, { Suspense } from 'react';
import { ServerRegistry } from '@/widgets/server-registry';
import { ClientRegistry } from '@/widgets/client-registry';
import { Floor } from '../types';
import { getComponentKey } from '@/widgets/component-map';

export const ServerFloorItem = ({ floor }: { floor: Floor }) => {
  const componentKey = getComponentKey(floor.type);

  if (!componentKey) {
     // 3. 兜底处理 (未知 ID)
    console.warn(`未知的组件 ID: ${floor.type}`);
    return (
      <div className="p-4 border border-red-200 bg-red-50 text-red-600">
        未知组件 ID: {floor.type}
      </div>
    );
  }

  // 1. 优先尝试 Server Registry (RSC 优先)
  const ServerComponent = ServerRegistry[componentKey];
  if (ServerComponent) {
    return <ServerComponent data={floor.data} />;
  }

  // 2. 尝试 Client Registry
  const ClientComponent = ClientRegistry[componentKey];
  if (ClientComponent) {
    return (
      <Suspense fallback={<div className="w-full h-20 bg-gray-50 animate-pulse" />}>
        <ClientComponent data={floor.data} />
      </Suspense>
    );
  }

  // 3. 兜底处理 (ID 存在但没注册)
  console.warn(`未注册的组件类型: ${componentKey} (ID: ${floor.type})`);
  return (
    <div className="p-4 border border-red-200 bg-red-50 text-red-600">
      未注册组件: {componentKey}
    </div>
  );
};
