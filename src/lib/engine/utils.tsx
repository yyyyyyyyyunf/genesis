import React from 'react';
import dynamic from 'next/dynamic';

// Client Registry Helper - 用于必须在客户端运行的组件
// 通常是那些具有复杂状态（如 Tabs）或使用 Hooks 的组件
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const dynamicClientFloor = (importFunc: () => Promise<React.ComponentType<any>>) => {
  return dynamic(importFunc, {
    loading: () => <div className="w-full h-24 animate-pulse bg-gray-100 rounded-md m-4" />,
    ssr: true // 我们希望客户端组件也能进行 SSR
  });
};

