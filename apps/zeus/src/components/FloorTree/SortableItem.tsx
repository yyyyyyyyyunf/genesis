"use client";

import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useEditorStore } from '@/lib/store';
import { COMPONENT_MAP } from '@genesis/hercules/component-map';
import { COMPONENT_NAMES } from '@genesis/hercules/component-map';

export function SortableItem({ id, floor, depth = 0 }: { id: string, floor: any, depth?: number }) {
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
    marginLeft: `${depth * 16}px`, // 层级缩进
  };

  // 递归渲染 Tab 子组件
  const isTab = floor.type === COMPONENT_NAMES.Tab;
  const items = isTab && floor.data?.items ? floor.data.items : [];

  return (
    <div className="flex flex-col">
      <div 
        ref={setNodeRef} 
        style={style} 
        {...attributes} 
        {...listeners}
        onClick={(e) => {
            e.stopPropagation();
            selectFloor(id);
        }}
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
              if (confirm('确定要删除该楼层吗？')) {
                e.stopPropagation(); // 防止触发选择
                const { removeFloor } = useEditorStore.getState();
                removeFloor(id);
              } else {
                e.stopPropagation();
              }
            }}
            className={`p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-opacity flex-none ${selectedFloorId === id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
            title="删除图层"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 6h18"></path>
              <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
              <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
            </svg>
          </button>
        </div>
      </div>

      {/* 渲染 Tab 子组件 */}
      {isTab && items.length > 0 && (
        <div className="flex flex-col">
            {items.map((item: any, index: number) => (
                <div key={`${id}_tab_${index}`}>
                    {item.label && (
                        <div className="text-xs text-gray-400 pl-4 py-1 uppercase font-bold tracking-wider" style={{ marginLeft: `${(depth) * 16}px` }}>
                            {item.label} (Tab)
                        </div>
                    )}
                    {item.children?.map((child: any) => (
                        <SortableItem key={child.id} id={child.id} floor={child} depth={depth + 1} />
                    ))}
                </div>
            ))}
        </div>
      )}
    </div>
  );
}

