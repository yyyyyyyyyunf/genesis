"use client";

import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useEditorStore } from '@/lib/store';
import { COMPONENT_CODES } from '@genesis/hercules/component-map';

export function SortableItem({ id, floor }: { id: string, floor: any }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id });

  const { selectFloor, selectedFloorId } = useEditorStore();

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      {...attributes} 
      {...listeners}
      onClick={() => selectFloor(id)}
      className={`p-3 mb-2 rounded border cursor-pointer hover:bg-gray-50 ${selectedFloorId === id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-white'}`}
    >
      <div className="font-medium text-sm">{floor.alias || floor.id}</div>
      <div className="text-xs text-gray-500">{COMPONENT_CODES[floor.type] || '未知组件'}</div>
    </div>
  );
}

