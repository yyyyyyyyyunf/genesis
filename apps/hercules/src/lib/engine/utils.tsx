import React from 'react';
import dynamic from 'next/dynamic';

export interface DynamicClientFloorOptions {
  ssr?: boolean;
}

// Client Registry Helper - 用于必须在客户端运行的组件
// 通常是那些具有复杂状态（如 Tabs）或使用 Hooks 的组件
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const dynamicClientFloor = (importFunc: () => Promise<React.ComponentType<any>>, options?: DynamicClientFloorOptions) => {
  return dynamic(importFunc, {
    loading: () => <div className="w-full h-24 animate-pulse bg-gray-100 rounded-md m-4" />,
    ssr: options?.ssr ?? true // 默认开启 SSR，但可通过 options 关闭
  });
};

