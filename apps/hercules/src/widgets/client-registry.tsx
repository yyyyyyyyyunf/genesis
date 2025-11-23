import React from 'react';
import { FloorComponentProps } from '@/lib/engine/types';
import { dynamicClientFloor } from '@/lib/engine/utils';

export const ClientRegistry: Record<string, React.ComponentType<FloorComponentProps>> = {
  // Tab 本质上是交互式的 (useState)，所以它放在这里
  Tab: dynamicClientFloor(() => import('./Tab').then(mod => mod.Tab)),
  
  // Shelf 未来可能有无限滚动或加入购物车功能，所以目前保留在客户端
  // 但严格来说，静态网格可以是 RSC。让我们保留它在客户端以演示混合渲染。
  Shelf: dynamicClientFloor(() => import('./Shelf').then(mod => mod.Shelf)),

  // Carousel 使用 Swiper (Hooks)，必须是客户端组件
  Carousel: dynamicClientFloor(() => import('./Carousel').then(mod => mod.Carousel)),

  // Button 为了支持 onClick 交互（如弹窗），必须是客户端组件
  Button: dynamicClientFloor(() => import('./Button').then(mod => mod.Button)),
};
