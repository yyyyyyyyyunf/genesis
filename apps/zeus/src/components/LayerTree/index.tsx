"use client";

import React from 'react';
import { useEditorStore } from '@/lib/store';
import {
  DndContext, 
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { SortableItem } from './SortableItem';

export function LayerTree() {
  const { currentConfig, draftConfig, loadConfig } = useEditorStore();
  const displayConfig = draftConfig || currentConfig;
  
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = displayConfig.findIndex((item) => item.id === active.id);
      const newIndex = displayConfig.findIndex((item) => item.id === over.id);
      
      const newOrder = arrayMove(displayConfig, oldIndex, newIndex);
      loadConfig(newOrder); // This should probably be a reorder action in store, but reusing loadConfig for simplicity or add reorder action
    }
  }

  return (
    <div className="flex flex-col h-full p-4 overflow-y-auto">
      <h3 className="text-lg font-bold mb-4">楼层</h3>
      <DndContext 
        sensors={sensors} 
        collisionDetection={closestCenter} 
        onDragEnd={handleDragEnd}
      >
        <SortableContext 
          items={displayConfig.map(f => f.id)}
          strategy={verticalListSortingStrategy}
        >
          {displayConfig.map((floor) => (
            <SortableItem key={floor.id} id={floor.id} floor={floor} />
          ))}
        </SortableContext>
      </DndContext>
    </div>
  );
}

