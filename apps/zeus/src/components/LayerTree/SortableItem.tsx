"use client";

import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useEditorStore } from '@/lib/store';
import { COMPONENT_MAP } from '@genesis/hercules/component-map';

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
      className={`p-3 mb-2 rounded border cursor-pointer hover:bg-gray-50 group ${selectedFloorId === id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-white'}`}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="min-w-0 flex-1">
          <div className="font-medium text-sm truncate" title={floor.alias || floor.id}>
            {floor.alias || floor.id}
          </div>
          <div className="text-xs text-gray-500">{COMPONENT_MAP[floor.type]?.label || COMPONENT_MAP[floor.type]?.name || '未知组件'}</div>
        </div>
        <button
          onPointerDown={(e) => e.stopPropagation()}
          onClick={(e) => {
            e.stopPropagation(); // 防止触发选择
            const { removeFloor } = useEditorStore.getState();
            removeFloor(id);
          }}
          className={`p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-opacity flex-none ${selectedFloorId === id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
          title="删除楼层"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 6h18"></path>
            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
          </svg>
        </button>
      </div>
    </div>
  );
}

