"use client";

import React from 'react';
import { ZodObject, ZodString, ZodEnum, ZodType } from 'zod';

export function AutoForm({ schema, data, onChange }: { schema: ZodObject<any>, data: any, onChange: (key: string, value: any) => void }) {
  const shape = schema.shape;

  return (
    <div className="space-y-4">
      {Object.entries(shape).map(([key, fieldSchema]) => {
        const fs = fieldSchema as ZodType;
        // 简单的表单字段启发式判断
        // 在实际应用中，这将是递归的并且处理更多类型
        
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

        return null; // 这个简单演示不支持的类型
      })}
    </div>
  );
}

