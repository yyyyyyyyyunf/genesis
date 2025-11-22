"use client";

import React, { useEffect } from 'react';
import { usePageStore } from '@/lib/store';
import { Floor } from '@/lib/types';
import { FullRegistry } from '@/widgets/full-registry';
import { getComponentKey } from '@/widgets/component-map';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Registry = FullRegistry as Record<string, React.ComponentType<any>>;

export function RealtimePreviewRenderer({ initialFloors }: { initialFloors: Floor[] }) {
  const { pageConfig, setPageConfig } = usePageStore();

  useEffect(() => {
    // 仅在 store 为空时初始化，避免覆盖后续的 postMessage 更新
    // 注意：这里的检查可能需要根据实际需求调整。
    // 如果每次刷新都想重置，可以去掉 length 检查。
    // 但考虑到开发体验，我们希望它能响应 initialFloors。
    if (initialFloors && initialFloors.length > 0 && pageConfig.length === 0) {
       setPageConfig(initialFloors);
    }
  }, [initialFloors, setPageConfig, pageConfig.length]);

  // 优先渲染 store 中的配置，如果没有则回退到初始配置
  const floorsToRender = pageConfig.length > 0 ? pageConfig : initialFloors;

  return (
    <div className="w-full max-w-md mx-auto bg-white min-h-screen shadow-xl overflow-hidden">
      {floorsToRender.map((floor) => {
         const componentName = getComponentKey(floor.type);
         const Component = componentName ? Registry[componentName] : null;
         
         if (!Component) {
            return (
                <div key={floor.id} className="p-4 border border-red-200 bg-red-50 text-red-600">
                    未知组件: {floor.type}
                </div>
            );
         }

         return (
            <React.Fragment key={floor.id}>
                <Component data={floor.data} />
            </React.Fragment>
         );
      })}
    </div>
  );
}

