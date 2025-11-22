"use client";

import { ZodObject, ZodString, ZodEnum, ZodType, ZodArray, ZodOptional, ZodDefault, ZodNumber, ZodBoolean } from 'zod';
import { Plus, Trash2 } from 'lucide-react';

// 解包 ZodOptional 和 ZodDefault 以获取底层类型
function unwrapSchema(schema: ZodType): ZodType {
  if (schema instanceof ZodOptional) {
    return unwrapSchema(schema.unwrap() as ZodType);
  }
  if (schema instanceof ZodDefault) {
    return unwrapSchema(schema.removeDefault() as ZodType);
  }
  return schema;
}

interface AutoFormProps {
  schema: ZodType;
  data: any;
  onChange: (value: any) => void;
  label?: string;
  level?: number;
}

export function AutoForm({ schema, data, onChange, label, level = 0 }: AutoFormProps) {
  const unwrappedSchema = unwrapSchema(schema);

  // 1. 处理对象 (ZodObject)
  if (unwrappedSchema instanceof ZodObject) {
    return (
      <div className={`space-y-3 ${level > 0 ? 'pl-3 border-l-2 border-gray-100 ml-1' : ''}`}>
        {label && <div className="text-xs font-semibold text-gray-800 mb-2">{label}</div>}
        {Object.entries(unwrappedSchema.shape).map(([key, fieldSchema]) => (
          <AutoForm
            key={key}
            label={key}
            schema={fieldSchema as ZodType}
            data={data?.[key]}
            onChange={(val) => onChange({ ...data, [key]: val })}
            level={level + 1}
          />
        ))}
      </div>
    );
  }

  // 2. 处理数组 (ZodArray)
  if (unwrappedSchema instanceof ZodArray) {
    const items = Array.isArray(data) ? data : [];
    const itemSchema = unwrappedSchema.element;

    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-medium text-gray-700 capitalize">{label}</label>
          <button
            type="button"
            onClick={() => {
              // 简单的默认值推断
              let defaultValue: any = undefined;
              const unwrappedItem = unwrapSchema(itemSchema as ZodType);
              if (unwrappedItem instanceof ZodString) defaultValue = '';
              if (unwrappedItem instanceof ZodObject) defaultValue = {};
              
              onChange([...items, defaultValue]);
            }}
            className="p-1 hover:bg-gray-100 rounded text-blue-600"
            title="添加项"
          >
            <Plus size={14} />
          </button>
        </div>
        
        <div className="space-y-2">
          {items.map((item: any, index: number) => (
            <div key={index} className="group relative p-3 bg-gray-50 rounded border border-gray-200">
              <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                <button
                  type="button"
                  onClick={() => onChange(items.filter((_: any, i: number) => i !== index))}
                  className="p-1 text-red-500 hover:bg-red-50 rounded"
                >
                  <Trash2 size={14} />
                </button>
              </div>
              <AutoForm
                schema={itemSchema as ZodType}
                data={item}
                onChange={(val) => {
                  const newItems = [...items];
                  newItems[index] = val;
                  onChange(newItems);
                }}
                level={level + 1}
              />
            </div>
          ))}
          {items.length === 0 && (
            <div className="text-xs text-gray-400 italic p-2 text-center border border-dashed rounded">
              空列表
            </div>
          )}
        </div>
      </div>
    );
  }

  // 3. 处理基础类型 (String, Enum, Number, Boolean)
  const renderField = () => {
    if (unwrappedSchema instanceof ZodEnum) {
      const options = unwrappedSchema.options as string[];
      return (
        <select
          value={data ?? ''}
          onChange={(e) => onChange(e.target.value)}
          className="w-full p-2 border rounded text-sm bg-white focus:ring-2 focus:ring-blue-500 outline-none"
        >
          <option value="" disabled>请选择</option>
          {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>
      );
    }

    if (unwrappedSchema instanceof ZodString) {
      return (
        <input
          type="text"
          value={data ?? ''}
          onChange={(e) => onChange(e.target.value)}
          className="w-full p-2 border rounded text-sm focus:ring-2 focus:ring-blue-500 outline-none"
        />
      );
    }

    if (unwrappedSchema instanceof ZodNumber) {
       return (
        <input
          type="number"
          value={data ?? 0}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full p-2 border rounded text-sm focus:ring-2 focus:ring-blue-500 outline-none"
        />
      );
    }

    if (unwrappedSchema instanceof ZodBoolean) {
       return (
        <input
          type="checkbox"
          checked={!!data}
          onChange={(e) => onChange(e.target.checked)}
          className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
        />
      );
    }

    return null;
  };

  const fieldContent = renderField();

  if (!fieldContent) return null;

  return (
    <div className="mb-3">
      {label && <label className="block text-xs font-medium text-gray-700 mb-1 capitalize">{label}</label>}
      {fieldContent}
    </div>
  );
}
