"use client";

import { ZodObject, ZodString, ZodEnum, ZodType, ZodArray, ZodNumber, ZodBoolean, ZodDiscriminatedUnion, ZodLiteral } from 'zod';
import { Plus, Trash2 } from 'lucide-react';
import { unwrapSchema, getSchemaMeta, getLiteralLabelsFromUnion } from '@/lib/utils';

interface AutoFormProps {
  schema: ZodType;
  data: any;
  onChange: (value: any) => void;
  label?: string;
  level?: number;
}

export function AutoForm({ schema, data, onChange, label, level = 0 }: AutoFormProps) {
  const unwrappedSchema = unwrapSchema(schema);
  const { label: displayLabel, enumLabels, unit, defaultValue } = getSchemaMeta(schema, label);

  // 1. 处理 Discriminated Union（可辨识联合）
  if (unwrappedSchema instanceof ZodDiscriminatedUnion) {
    // discriminator 在 def 中可用，options 是公开属性
    const discriminator = unwrappedSchema.def.discriminator;
    const unionOptions = unwrappedSchema.options;
    
    // 提取所有可能的类型值
    const options: string[] = [];
    
    if (discriminator && Array.isArray(unionOptions)) {
      unionOptions.forEach(opt => {
        // 直接访问 shape 属性
        const shape = opt.shape;
        const discriminatorField = shape?.[discriminator];
        
        if (discriminatorField) {
            // 优先取 value 属性
            if ('value' in discriminatorField) {
                options.push(discriminatorField.value as string);
            } else if (discriminatorField._def?.value) {
                options.push(discriminatorField._def.value as string);
            }
        }
      });
    }
    
    // 提取字面量的中文标签
    const literalLabels = getLiteralLabelsFromUnion(unionOptions, discriminator);

    // 无法解析出选项时显示错误提示
    if (options.length === 0) {
      return (
        <div className="text-red-500 text-xs p-2 border border-red-200 rounded">
          无法解析 Discriminated Union 选项（未知类型）
        </div>
      );
    }

    const currentDiscriminatorValue = data?.[discriminator];

    // 如果当前没有值或值不合法，优先使用元数据中的默认值，否则使用第一个选项
    let activeValue = currentDiscriminatorValue;
    if (!options.includes(activeValue)) {
        if (defaultValue && options.includes(defaultValue)) {
            activeValue = defaultValue;
        } else {
            activeValue = options[0];
        }
    }
    
    // 找到对应的 Schema
    const activeSchema = unionOptions.find(opt => {
        const shape = opt.shape;
        if (!discriminator || !shape) return false;

        const discriminatorField = shape[discriminator];
        if (!discriminatorField) return false;
        
        let val;
        if ('value' in discriminatorField) val = discriminatorField.value;
        else if (discriminatorField._def?.value) val = discriminatorField._def.value;
        
        return val === activeValue;
    });

    return (
      <div className={`space-y-3 ${level > 0 ? 'pl-3 border-l-2 border-gray-100 ml-1' : ''}`}>
        {/* 辨识符选择器 - 使用 displayLabel 作为标签，如果没有则使用 discriminator */}
        <div className="mb-3">
          <label className="block text-xs font-medium text-gray-700 mb-1 capitalize">
            {displayLabel || discriminator}
          </label>
          <select
            value={activeValue}
            onChange={(e) => {
              const newValue = e.target.value;
              if (discriminator) {
                  onChange({ ...data, [discriminator]: newValue });
              }
            }}
            className="w-full p-2 border rounded text-sm bg-white focus:ring-2 focus:ring-blue-500 outline-none"
          >
            {options.map((opt) => (
              <option key={opt} value={opt}>{literalLabels[opt] || opt}</option>
            ))}
          </select>
        </div>

        {/* 渲染当前选中的子 Schema */}
        {activeSchema && (
          <AutoForm
            schema={activeSchema}
            data={discriminator ? { ...data, [discriminator]: activeValue } : data} // 确保数据中包含正确的辨识符
            onChange={onChange}
            level={level} // 保持同级缩进
          />
        )}
      </div>
    );
  }

  // 2. 处理对象（ZodObject）
  if (unwrappedSchema instanceof ZodObject) {
    return (
      <div className={`space-y-3 ${level > 0 ? 'pl-3 border-l-2 border-gray-100 ml-1' : ''}`}>
        {displayLabel && <div className="text-xs font-semibold text-gray-800 mb-2">{displayLabel}</div>}
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

  // 3. 处理数组（ZodArray）
  if (unwrappedSchema instanceof ZodArray) {
    const items = Array.isArray(data) ? data : [];
    const itemSchema = unwrappedSchema.element;

    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-medium text-gray-700 capitalize">{displayLabel}</label>
          <button
            type="button"
            onClick={() => {
              // 推断数组项的默认值
              let defaultValue: any = undefined;
              const unwrappedItem = unwrapSchema(itemSchema as ZodType);
              if (unwrappedItem instanceof ZodString) defaultValue = '';
              if (unwrappedItem instanceof ZodObject) defaultValue = {};
              if (unwrappedItem instanceof ZodDiscriminatedUnion) {
                 const discriminator = (unwrappedItem as any).discriminator || (unwrappedItem as any)._def?.discriminator;
                 const unionOptions = (unwrappedItem as any).options as ZodObject<any>[];
                 
                 // 获取第一个选项的辨识符值
                 let firstOptionValue = '';
                 if (discriminator && unionOptions.length > 0) {
                     const firstOpt = unionOptions[0];
                     const shape = firstOpt.shape;
                     const discriminatorField = shape?.[discriminator];
                     
                     if (discriminatorField) {
                         if ('value' in discriminatorField) firstOptionValue = discriminatorField.value as string;
                         else if (discriminatorField._def?.value) firstOptionValue = discriminatorField._def.value as string;
                     }
                 }
                 
                 if (discriminator) {
                    defaultValue = { [discriminator]: firstOptionValue };
                 }
              }
              
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

  // 4. 处理基础类型（String, Enum, Number, Boolean）
  const renderField = () => {
    // 检查是否是字面量（用于 Discriminated Union 的标识字段）
    if (unwrappedSchema instanceof ZodLiteral || 
       ('value' in unwrappedSchema && (unwrappedSchema as any)._def.typeName === 'ZodLiteral')) {
        return (
             <div className="text-sm text-gray-500 bg-gray-50 p-2 rounded border border-gray-200">
                {String((unwrappedSchema as any).value)}
            </div>
        )
    }

    if (unwrappedSchema instanceof ZodEnum) {
      const options = unwrappedSchema.options as string[];
      return (
        <select
          value={data ?? ''}
          onChange={(e) => onChange(e.target.value)}
          className="w-full p-2 border rounded text-sm bg-white focus:ring-2 focus:ring-blue-500 outline-none"
        >
          <option value="" disabled>请选择</option>
          {options.map(opt => (
            <option key={opt} value={opt}>
              {enumLabels?.[opt] || opt}
            </option>
          ))}
        </select>
      );
    }

    if (unwrappedSchema instanceof ZodString) {
      // 如果字段有单位，显示为数字输入框
      if (unit) {
          const displayValue = data ? String(data).replace(new RegExp(`${unit}$`), '') : '';
          return (
             <div className="relative">
                <input
                    type="number"
                    value={displayValue}
                    onChange={(e) => {
                        const val = e.target.value;
                        onChange(val ? `${val}${unit}` : '');
                    }}
                    className="w-full p-2 border rounded text-sm focus:ring-2 focus:ring-blue-500 outline-none pr-8"
                />
                <span className="absolute right-2 top-2 text-gray-500 text-sm pointer-events-none">
                    {unit}
                </span>
             </div>
          )
      }

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
      // 如果字段有单位，显示单位后缀
      if (unit) {
        return (
          <div className="relative">
            <input
              type="number"
              value={data ?? 0}
              onChange={(e) => onChange(Number(e.target.value))}
              className="w-full p-2 border rounded text-sm focus:ring-2 focus:ring-blue-500 outline-none pr-8"
            />
            <span className="absolute right-2 top-2 text-gray-500 text-sm pointer-events-none">
              {unit}
            </span>
          </div>
        );
      }

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
      {displayLabel && <label className="block text-xs font-medium text-gray-700 mb-1 capitalize">{displayLabel}</label>}
      {fieldContent}
    </div>
  );
}
