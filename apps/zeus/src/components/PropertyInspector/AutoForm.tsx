"use client";

import React from 'react';
import { ZodObject, ZodString, ZodEnum, ZodType } from 'zod';

export function AutoForm({ schema, data, onChange }: { schema: ZodObject<any>, data: any, onChange: (key: string, value: any) => void }) {
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

