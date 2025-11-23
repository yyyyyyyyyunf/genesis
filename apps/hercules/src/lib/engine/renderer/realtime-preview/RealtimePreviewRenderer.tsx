"use client";

import React, { useEffect } from 'react';
import { usePageStore } from '@/lib/store';
import { Floor } from '@/lib/types';
import { getComponentKey } from '@/widgets/component-map';
import { useRegistry } from '@/context/RegistryContext';

export function RealtimePreviewRenderer({ initialFloors }: { initialFloors: Floor[] }) {
  const { pageConfig, setPageConfig } = usePageStore();
  const registry = useRegistry();

  useEffect(() => {
    // 仅在 store 为空时初始化，避免覆盖后续的 postMessage 更新
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
         const Component = componentName ? registry[componentName] : null;
         
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
