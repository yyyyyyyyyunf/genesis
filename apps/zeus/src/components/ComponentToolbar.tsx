"use client";

import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { COMPONENT_MAP } from '@genesis/hercules/component-map';
import { Type, Image as ImageIcon, LayoutGrid, Columns, Box, MousePointerClick, Video, GalleryHorizontal, MoveVertical } from 'lucide-react';

// 基于组件名称的图标映射 (COMPONENT_MAP 值的 keys)
const NAME_TO_ICON: Record<string, React.ElementType> = {
  'Text': Type,
  'Image': ImageIcon,
  'Shelf': LayoutGrid,
  'Tab': Columns,
  'Button': MousePointerClick,
  'Video': Video,
  'Carousel': GalleryHorizontal,
  'Spacer': MoveVertical,
};

function getIconForComponent(name: string): React.ElementType {
  return NAME_TO_ICON[name] || Box; // 如果没有匹配，默认使用 Box 图标
}

interface ComponentItemProps {
  label: string; // 中文标签
  componentName: string; // 用于查找图标的英文名称
  className?: string;
  style?: React.CSSProperties;
}

export function ComponentItem({ label, componentName, className, style }: ComponentItemProps) {
  const Icon = getIconForComponent(componentName);
  return (
    <div
      style={style}
      className={`flex flex-col items-center justify-center p-3 bg-white border border-gray-200 rounded-lg cursor-move hover:bg-gray-50 hover:shadow-sm transition-all ${className || ''}`}
    >
      <Icon className="w-6 h-6 mb-2 text-gray-600" />
      <span className="text-xs font-medium text-gray-700">{label}</span>
    </div>
  );
}

interface ComponentCardProps {
  type: number;
  name: string; // 英文名称
  label: string; // 中文标签
}

function ComponentCard({ type, name, label }: ComponentCardProps) {
  const { attributes, listeners, setNodeRef } = useDraggable({
    id: `new_component_${type}`,
    data: {
      type: 'new_component',
      componentType: type,
      label, // 传递中文标签用于覆盖层
      componentName: name, // 传递英文名称用于图标查找
    },
  });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
    >
      <ComponentItem label={label} componentName={name} />
    </div>
  );
}

export function ComponentToolbar() {
  return (
    <div className="w-20 h-full bg-gray-100 border-r border-gray-200 flex flex-col p-2 gap-3 overflow-y-auto flex-none">
      <div className="text-xs font-bold text-gray-400 text-center mb-2">组件库</div>
      {Object.entries(COMPONENT_MAP).map(([code, { name, label }]) => (
        <ComponentCard 
          key={code} 
          type={Number(code)} 
          name={name}
          label={label} 
        />
      ))}
    </div>
  );
}

