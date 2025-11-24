"use client";

import React from 'react';
import { useEditorStore } from '@/lib/store';
import { SchemaRegistry } from '@genesis/hercules/schemas';
import { getComponentKey } from '@genesis/hercules/component-map';
import { ZodObject, ZodDiscriminatedUnion } from 'zod';
import { AutoForm } from './AutoForm';
import { Trash2 } from 'lucide-react';
import { findFloorNode, getAliasLabel } from '@/lib/utils';

export function PropertyInspector() {
  const { currentConfig, draftConfig, selectedFloorId, updateFloor, removeFloor } = useEditorStore();
  const displayConfig = draftConfig || currentConfig;
  const selectedFloor = selectedFloorId ? findFloorNode(displayConfig, selectedFloorId) : null;

  if (!selectedFloor) {
    return <div className="p-4 text-gray-400 text-center">请选择一个楼层以编辑属性</div>;
  }

  const componentName = getComponentKey(selectedFloor.type);
  const schema = componentName ? (SchemaRegistry as any)[componentName] : null;

  const aliasLabel = getAliasLabel();

  const handleUpdate = (newData: Record<string, any>) => {
    updateFloor(selectedFloor.id, newData);
  };

  return (
    <div className="h-full flex flex-col p-4 overflow-y-auto">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold">属性面板</h3>
        <button
          onClick={() => {
            if (confirm('确定要删除该楼层吗？')) {
              removeFloor(selectedFloor.id);
            }
          }}
          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"
          title="删除当前楼层"
        >
          <Trash2 size={18} />
        </button>
      </div>
      <div className="mb-4">
        <label className="block text-xs font-medium text-gray-700 mb-1">ID</label>
        <input disabled value={selectedFloor.id} className="w-full p-2 bg-gray-100 border rounded text-sm text-gray-500" />
      </div>
      <div className="mb-4">
         <label className="block text-xs font-medium text-gray-700 mb-1">{aliasLabel}</label>
         <input 
            value={selectedFloor.alias || ''} 
            onChange={(e) => { updateFloor(selectedFloor.id, undefined, e.target.value); }} 
            className="w-full p-2 border rounded text-sm"
         />
      </div>
      
      <hr className="my-4" />
      
      {schema && (schema instanceof ZodObject || schema instanceof ZodDiscriminatedUnion) ? (
        <AutoForm schema={schema} data={selectedFloor.data} onChange={handleUpdate} />
      ) : (
        <div className="text-yellow-600 text-sm">未找到 Schema 或 {componentName} 的 Schema 过于复杂</div>
      )}
    </div>
  );
}
