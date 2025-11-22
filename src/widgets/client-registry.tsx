import React from 'react';
import { FloorComponentProps } from '@/lib/engine/types';
import { dynamicClientFloor } from '@/lib/engine/utils';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const ClientRegistry: Record<string, React.ComponentType<FloorComponentProps<any>>> = {
  // Tab 本质上是交互式的 (useState)，所以它放在这里
  Tab: dynamicClientFloor(() => import('./Tab').then(mod => mod.Tab)),
  
  // Shelf 未来可能有无限滚动或加入购物车功能，所以目前保留在客户端
  // 但严格来说，静态网格可以是 RSC。让我们保留它在客户端以演示混合渲染。
  Shelf: dynamicClientFloor(() => import('./Shelf').then(mod => mod.Shelf)),
};
