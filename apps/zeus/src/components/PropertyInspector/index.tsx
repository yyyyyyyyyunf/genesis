"use client";

import React from 'react';
import { useEditorStore } from '@/lib/store';
import { SchemaRegistry } from '@genesis/hercules/schemas';
import { getComponentKey } from '@genesis/hercules/component-map';
import { ZodObject } from 'zod';
import { AutoForm } from './AutoForm';

export function PropertyInspector() {
  const { currentConfig, draftConfig, selectedFloorId, updateFloor } = useEditorStore();
  const displayConfig = draftConfig || currentConfig;
  const selectedFloor = displayConfig.find(f => f.id === selectedFloorId);

  if (!selectedFloor) {
    return <div className="p-4 text-gray-400 text-center">选择一个图层以编辑属性</div>;
  }

  const componentName = getComponentKey(selectedFloor.type);
  const schema = componentName ? (SchemaRegistry as any)[componentName] : null;

  const handleUpdate = (key: string, value: any) => {
    updateFloor(selectedFloor.id, { [key]: value });
  };

  return (
    <div className="h-full flex flex-col p-4 overflow-y-auto">
      <h3 className="text-lg font-bold mb-4">Properties</h3>
      <div className="mb-4">
        <label className="block text-xs font-medium text-gray-700 mb-1">ID</label>
        <input disabled value={selectedFloor.id} className="w-full p-2 bg-gray-100 border rounded text-sm text-gray-500" />
      </div>
      <div className="mb-4">
         <label className="block text-xs font-medium text-gray-700 mb-1">Alias</label>
         <input 
            value={selectedFloor.alias || ''} 
            onChange={(e) => { /* 需要更新楼层别名，而不是数据 */ }} 
            className="w-full p-2 border rounded text-sm"
         />
      </div>
      
      <hr className="my-4" />
      
      {schema && schema instanceof ZodObject ? (
        <AutoForm schema={schema} data={selectedFloor.data} onChange={handleUpdate} />
      ) : (
        <div className="text-yellow-600 text-sm">未找到 Schema 或 {componentName} 的 Schema 过于复杂</div>
      )}
    </div>
  );
}

