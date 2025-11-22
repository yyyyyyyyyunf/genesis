"use client";

import React from 'react';
import { useEditorStore } from '@/lib/store';
import {
  useDroppable, // Import useDroppable
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { SortableItem } from './SortableItem';

export function LayerTree() {
  const { currentConfig, draftConfig } = useEditorStore();
  const displayConfig = draftConfig || currentConfig;
  
  // Make LayerTree a droppable zone for adding new components
  const { setNodeRef } = useDroppable({
    id: 'layer-tree-droppable',
  });

  // The parent DndContext in page.tsx handles the sensors and onDragEnd logic now.
  // We just render the SortableContext here.

  return (
    <div className="flex flex-col h-full p-4 overflow-y-auto" ref={setNodeRef}>
      <h3 className="text-lg font-bold mb-4">页面搭建</h3>
      <SortableContext 
        items={displayConfig.map(f => f.id)}
        strategy={verticalListSortingStrategy}
      >
        {displayConfig.map((floor) => (
          <SortableItem key={floor.id} id={floor.id} floor={floor} />
        ))}
        {/* Placeholder for empty state if needed */}
        {displayConfig.length === 0 && (
          <div className="p-4 text-center text-gray-400 text-sm border border-dashed rounded">
            暂无楼层，请从左侧拖拽组件添加
          </div>
        )}
      </SortableContext>
    </div>
  );
}

