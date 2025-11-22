"use client";

import React from 'react';
import { useEditorStore } from '@/lib/store';
import {
  useDroppable, // 导入 useDroppable
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { SortableItem } from './SortableItem';

export function FloorTree() {
  const { currentConfig, draftConfig } = useEditorStore();
  const displayConfig = draftConfig || currentConfig;
  
  // 将楼层树设置为可放置区域，用于添加新组件
  const { setNodeRef } = useDroppable({
    id: 'layer-tree-droppable',
  });

  // page.tsx 中的父级 DndContext 现在处理 sensors 和 onDragEnd 逻辑。
  // 我们在这里只渲染 SortableContext。

  return (
    <div className="flex flex-col h-full p-4 overflow-y-auto" ref={setNodeRef}>
      <h3 className="text-lg font-bold mb-4">楼层管理</h3>
      <SortableContext 
        items={displayConfig.map(f => f.id)}
        strategy={verticalListSortingStrategy}
      >
        {displayConfig.map((floor) => (
          <SortableItem key={floor.id} id={floor.id} floor={floor} />
        ))}
        {/* 空状态占位符（如果需要） */}
        {displayConfig.length === 0 && (
          <div className="p-4 text-center text-gray-400 text-sm border border-dashed rounded">
            暂无楼层，请从左侧拖拽组件添加
          </div>
        )}
      </SortableContext>
    </div>
  );
}

