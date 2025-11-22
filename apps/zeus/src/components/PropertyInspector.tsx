"use client";

import React from 'react';
import { useEditorStore } from '@/lib/store';
import { SchemaRegistry } from '@genesis/hercules/schemas';
import { getComponentKey } from '@genesis/hercules/component-map';
import { ZodObject, ZodString, ZodEnum, ZodType } from 'zod';

function AutoForm({ schema, data, onChange }: { schema: ZodObject<any>, data: any, onChange: (key: string, value: any) => void }) {
  const shape = schema.shape;

  return (
    <div className="space-y-4">
      {Object.entries(shape).map(([key, fieldSchema]) => {
        const fs = fieldSchema as ZodType;
        // Simple heuristic for form fields
        // In a real app, this would be recursive and handle more types
        
        if (fs instanceof ZodString) {
          return (
            <div key={key}>
              <label className="block text-xs font-medium text-gray-700 mb-1 capitalize">{key}</label>
              <input 
                type="text" 
                value={data?.[key] || ''} 
                onChange={(e) => onChange(key, e.target.value)}
                className="w-full p-2 border rounded text-sm"
              />
            </div>
          );
        }
        
        if (fs instanceof ZodEnum) {
           const options = (fs as any).options as string[];
           return (
            <div key={key}>
              <label className="block text-xs font-medium text-gray-700 mb-1 capitalize">{key}</label>
              <select 
                value={data?.[key] || ''} 
                onChange={(e) => onChange(key, e.target.value)}
                className="w-full p-2 border rounded text-sm"
              >
                {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </select>
            </div>
          );
        }

        return null; // Unsupported type for this simple demo
      })}
    </div>
  );
}

export function PropertyInspector() {
  const { currentConfig, draftConfig, selectedFloorId, updateFloor } = useEditorStore();
  const displayConfig = draftConfig || currentConfig;
  const selectedFloor = displayConfig.find(f => f.id === selectedFloorId);

  if (!selectedFloor) {
    return <div className="p-4 text-gray-400 text-center">Select a layer to edit properties</div>;
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
            onChange={(e) => { /* Need to update floor alias, not data */ }} 
            className="w-full p-2 border rounded text-sm"
         />
      </div>
      
      <hr className="my-4" />
      
      {schema && schema instanceof ZodObject ? (
        <AutoForm schema={schema} data={selectedFloor.data} onChange={handleUpdate} />
      ) : (
        <div className="text-yellow-600 text-sm">No schema found or complex schema for {componentName}</div>
      )}
    </div>
  );
}

