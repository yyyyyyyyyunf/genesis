// Agent 知识库文档生成脚本
import fs from 'fs';
import path from 'path';
import { ZodType, ZodObject, ZodEnum, ZodOptional, ZodDefault, ZodString, ZodNumber, ZodBoolean, ZodArray, ZodDiscriminatedUnion, ZodLiteral } from 'zod';
import { SchemaRegistry } from '../src/widgets/schemas';
import { COMPONENT_NAMES, COMPONENT_LABELS } from '../src/widgets/component-map';
import { MockDatas } from '../src/widgets/mock-datas';

const OUTPUT_FILE = path.join(process.cwd(), '../../knowledge/agent-manual.md');

function getType(schema: ZodType): string {
  if (schema instanceof ZodString) return 'string';
  if (schema instanceof ZodNumber) return 'number';
  if (schema instanceof ZodBoolean) return 'boolean';
  if (schema instanceof ZodEnum) return 'enum';
  if (schema instanceof ZodArray) return 'array';
  if (schema instanceof ZodObject) return 'object';
  if (schema instanceof ZodDiscriminatedUnion) return 'union';
  if (schema instanceof ZodLiteral) return 'literal';
  
  if (schema instanceof ZodOptional) {
    return getType(schema.def.innerType as ZodType);
  }
  if (schema instanceof ZodDefault) {
    return getType(schema.def.innerType as ZodType);
  }
  
  return 'any';
}

function getOptions(schema: ZodType): string[] | number[] | null {
  if (schema instanceof ZodEnum) {
    return schema.options as string[];
  }
  
  if (schema instanceof ZodOptional) {
    return getOptions(schema.def.innerType as ZodType);
  }
  if (schema instanceof ZodDefault) {
    return getOptions(schema.def.innerType as ZodType);
  }
  
  return null;
}

/**
 * 从 Zod schema 的 .meta() 调用中提取元数据
 */
function getMetadata(schema: ZodType): { label?: string, description?: string, labels?: Record<string, string>, unit?: string, defaultValue?: string } {
  let current: ZodType | null = schema;

  // 通过解包 schema 来查找元数据
  while (current) {
    // 使用 .meta() 方法获取元数据（Zod 4 API）
    const metadata = (current as any).meta?.();
    if (metadata) {
      return {
        label: metadata.label,
        description: metadata.description,
        labels: metadata.labels,
        unit: metadata.unit,
        defaultValue: metadata.defaultValue,
      };
    }

    // 解包 ZodOptional 和 ZodDefault 来检查内部 schema
    if (current instanceof ZodOptional) {
      current = (current as any).unwrap?.() || (current as any)._def?.innerType;
    } else if (current instanceof ZodDefault) {
      current = (current as any).removeDefault?.() || (current as any)._def?.innerType;
    } else {
      current = null;
    }
  }

  return {};
}

function getDescription(schema: ZodType): string {
  const metadata = getMetadata(schema);
  if (metadata.label || metadata.description) {
    // 组合 label 和 description 以保持向后兼容
    if (metadata.label && metadata.description) {
      return `${metadata.label}: ${metadata.description}`;
    }
    return metadata.label || metadata.description || '';
  }
  return '';
}

function isRequired(schema: ZodType): boolean {
  if (schema instanceof ZodOptional || schema instanceof ZodDefault) return false;
  return true;
}

function getDefault(schema: ZodType): unknown {
  if (schema instanceof ZodDefault) {
    const def = schema.def.defaultValue;
    return typeof def === 'function' ? def() : def;
  }
  return undefined;
}

/**
 * 渲染 schema 的文档结构
 */
function renderSchema(schema: ZodType, level: number = 0): string {
  let output = '';

  // 处理可辨识联合类型（Discriminated Union）
  if (schema instanceof ZodDiscriminatedUnion) {
    const discriminator = schema.def.discriminator;
    const options = schema.options as ZodObject<any>[];
    const metadata = getMetadata(schema);

    if (metadata.description) {
        output += `${metadata.description}\n\n`;
    }
    if (metadata.defaultValue) {
        output += `> 默认类型: \`${metadata.defaultValue}\`\n\n`;
    }

    output += `**支持的类型 (${discriminator})**:\n`;
    
    for (const option of options) {
      const shape = option.shape;
      const discriminatorField = shape[discriminator];
      
      // 获取字面量值
      const discriminatorValue = discriminatorField._def?.value || discriminatorField.value;
      
      // 获取字面量标签
      const literalMetadata = getMetadata(discriminatorField);
      let displayLabel = literalMetadata.label || discriminatorValue;
      
      output += `\n#### 类型: \`${discriminatorValue}\` - ${displayLabel}\n`;
      
      // 如果整个选项有描述也显示
      const optionDesc = getDescription(option);
      if (optionDesc) {
          output += `${optionDesc}\n`;
      }
      
      // 渲染该类型特有的字段
      output += renderObjectProperties(option, level, discriminator);
    }
    return output;
  }

  // 处理对象类型
  if (schema instanceof ZodObject) {
    return renderObjectProperties(schema, level);
  }

  // 简单类型的兜底处理（通常顶层是对象或联合类型）
  return `(类型: ${getType(schema)})`;
}

/**
 * 渲染对象属性的文档列表
 */
function renderObjectProperties(schema: ZodObject<any>, level: number, skipField?: string): string {
  let output = '';
  const shape = schema.shape;

  for (const [propName, propSchema] of Object.entries(shape)) {
    if (propName === skipField) continue; // 跳过辨识符字段（已在上层展示）

    const fieldSchema = propSchema as ZodType;
    const type = getType(fieldSchema);
    const options = getOptions(fieldSchema);
    const metadata = getMetadata(fieldSchema);
    const required = isRequired(fieldSchema);
    const defaultValue = getDefault(fieldSchema);

    output += `- **${propName}** ${required ? '(必填)' : '(可选)'}\n`;
    
    // 输出中文名
    if (metadata.label) {
      output += `  - **中文名**: ${metadata.label}\n`;
    }
    
    // 输出类型
    output += `  - 类型: \`${type}\`\n`;
    
    // 输出选项及其中文标签
    if (options) {
      if (metadata.labels) {
        // 有标签元数据时显示中文标签
        output += `  - 选项: ${options.map((o: string | number) => {
          const label = metadata.labels?.[String(o)];
          return label ? `\`${o}\` (${label})` : `\`${o}\``;
        }).join(', ')}\n`;
      } else {
        // 无标签时只显示原始值
        output += `  - 选项: ${options.map((o: string | number) => `\`${o}\``).join(', ')}\n`;
      }
    }

    // 输出默认值
    if (defaultValue !== undefined) {
      output += `  - 默认值: \`${JSON.stringify(defaultValue)}\`\n`;
    }

    // 输出描述及单位信息
    if (metadata.description) {
      let desc = metadata.description;
      if (metadata.unit) {
        desc += ` (单位: ${metadata.unit})`;
      }
      output += `  - 描述: ${desc}\n`;
    }
    
    // 递归处理嵌套对象
    if (fieldSchema instanceof ZodObject) {
         output += `  - **属性详情**:\n`;
         // 增加缩进
         const nested = renderObjectProperties(fieldSchema, 2);
         output += nested.split('\n').map(line => line ? `    ${line}` : line).join('\n') + '\n';
    }
    
    // 递归处理对象数组
    if (fieldSchema instanceof ZodArray && fieldSchema.element instanceof ZodObject) {
        output += `  - **列表项属性**:\n`;
        const nested = renderObjectProperties(fieldSchema.element as ZodObject<any>, 2);
        output += nested.split('\n').map(line => line ? `    ${line}` : line).join('\n') + '\n';
    }

    output += '\n';
  }
  return output;
}

/**
 * 生成组件的 JSON 配置示例
 */
function generateExamples(name: string, schema: ZodType, typeId: number): string {
  let output = '### 配置示例\n\n';
  
  // 检查是否有预定义的 mock 数据
  const mockData = MockDatas[name as keyof typeof MockDatas];
  
  if (mockData) {
    // 使用预定义的 mock 数据
    const minimalExample = {
      id: `floor_${name.toLowerCase()}_example`,
      type: typeId,
      data: mockData.minimal
    };
    
    const completeExample = {
      id: `floor_${name.toLowerCase()}_example`,
      type: typeId,
      alias: `示例${COMPONENT_LABELS[name] || name}`,
      data: mockData.complete
    };
    
    output += '#### 最小配置\n\n```json\n';
    output += JSON.stringify(minimalExample, null, 2);
    output += '\n```\n\n';
    
    output += '#### 完整配置\n\n```json\n';
    output += JSON.stringify(completeExample, null, 2);
    output += '\n```\n\n';
  } else {
    // 回退到自动生成（带警告）
    console.warn(`⚠️  组件 ${name} 没有 mock-data.ts 文件，使用自动生成的示例`);
    
    output += '#### 最小配置\n\n```json\n';
    output += generateMinimalExample(name, typeId, schema);
    output += '\n```\n\n';
    
    output += '#### 完整配置\n\n```json\n';
    output += generateCompleteExample(name, typeId, schema);
    output += '\n```\n\n';
  }
  
  return output;
}

/**
 * 生成最小配置示例（只包含必填字段）
 */
function generateMinimalExample(name: string, typeId: number, schema: ZodType): string {
  const example: any = {
    id: `floor_${name.toLowerCase()}_example`,
    type: typeId,
    data: {}
  };
  
  const unwrapped = schema instanceof ZodOptional || schema instanceof ZodDefault 
    ? (schema as any).unwrap?.() || (schema as any).removeDefault?.() || schema
    : schema;
  
  if (unwrapped instanceof ZodObject) {
    const shape = unwrapped.shape;
    for (const [key, fieldSchema] of Object.entries(shape)) {
      const field = fieldSchema as ZodType;
      if (isRequired(field)) {
        example.data[key] = getExampleValue(field, key);
      }
    }
  }
  
  return JSON.stringify(example, null, 2);
}

/**
 * 生成完整配置示例（包含所有常用字段及默认值）
 */
function generateCompleteExample(name: string, typeId: number, schema: ZodType): string {
  const example: any = {
    id: `floor_${name.toLowerCase()}_example`,
    type: typeId,
    alias: `示例${COMPONENT_LABELS[name] || name}`,
    data: {}
  };
  
  const unwrapped = schema instanceof ZodOptional || schema instanceof ZodDefault 
    ? (schema as any).unwrap?.() || (schema as any).removeDefault?.() || schema
    : schema;
  
  if (unwrapped instanceof ZodDiscriminatedUnion) {
    // 对于 discriminated union，使用第一个选项作为示例
    const firstOption = unwrapped.options[0] as ZodObject<any>;
    const shape = firstOption.shape;
    
    for (const [key, fieldSchema] of Object.entries(shape)) {
      example.data[key] = getExampleValue(fieldSchema as ZodType, key);
    }
  } else if (unwrapped instanceof ZodObject) {
    const shape = unwrapped.shape;
    for (const [key, fieldSchema] of Object.entries(shape)) {
      example.data[key] = getExampleValue(fieldSchema as ZodType, key);
    }
  }
  
  return JSON.stringify(example, null, 2);
}

/**
 * 根据 schema 类型生成示例值
 */
function getExampleValue(schema: ZodType, fieldName: string): any {
  // 获取默认值
  const defaultVal = getDefault(schema);
  if (defaultVal !== undefined) {
    return defaultVal;
  }
  
  // 解包
  const unwrapped = schema instanceof ZodOptional || schema instanceof ZodDefault
    ? (schema as any).unwrap?.() || (schema as any).removeDefault?.() || schema
    : schema;
  
  // 根据类型生成示例
  if (unwrapped instanceof ZodString) {
    if (fieldName.includes('url') || fieldName.includes('Url') || fieldName.includes('link') || fieldName.includes('src')) {
      return 'https://example.com/image.jpg';
    }
    if (fieldName.includes('color') || fieldName.includes('Color')) {
      return 'text-blue-600';
    }
    if (fieldName.includes('date') || fieldName.includes('Date')) {
      return '2025-12-31T23:59:59.000Z';
    }
    return `示例${fieldName}`;
  }
  
  if (unwrapped instanceof ZodNumber) {
    return 100;
  }
  
  if (unwrapped instanceof ZodBoolean) {
    return true;
  }
  
  if (unwrapped instanceof ZodEnum) {
    const options = getOptions(unwrapped);
    return options ? options[0] : 'option1';
  }
  
  if (unwrapped instanceof ZodLiteral) {
    return (unwrapped as any)._def?.value || (unwrapped as any).value;
  }
  
  if (unwrapped instanceof ZodArray) {
    return [];
  }
  
  if (unwrapped instanceof ZodObject) {
    return {};
  }
  
  return null;
}

function generateDocs() {
  let markdown = '# Hercules Agent 组件库手册\n\n';
  markdown += '请参考此文档来生成营销页面的 JSON 配置。\n\n';
  markdown += '> **注意**: `type` 字段现在使用数字 ID (Type ID)。请务必使用对应的数字。\n\n';

  markdown += '## 页面结构 (Page Structure)\n\n';
  markdown += '一个标准的楼层 (Floor) 对象包含以下字段：\n';
  markdown += '- `id`: (string) 楼层的唯一标识符\n';
  markdown += '- `type`: (number) 组件的数字 Type ID\n';
  markdown += '- `alias`: (string, 可选) 楼层的别名，用于在对话中指代该楼层 (例如 "主标题", "活动 Banner")\n';
  markdown += '- `data`: (object) 组件的具体配置数据，详见下方各组件定义\n\n';
  markdown += '---\n\n';

  for (const [name, schema] of Object.entries(SchemaRegistry)) {
    const typeId = COMPONENT_NAMES[name];
    const label = COMPONENT_LABELS[name] || name;
    markdown += `## 组件: ${name} - ${label} (Type ID: ${typeId})\n\n`;
    
    markdown += `### 属性 (Properties)\n\n`;
    markdown += renderSchema(schema as ZodType);
    
    // 在属性列表之后添加配置示例
    markdown += generateExamples(name, schema as ZodType, typeId);
    
    markdown += '---\n\n';
  }

  fs.writeFileSync(OUTPUT_FILE, markdown);
  console.log(`文档已生成至 ${OUTPUT_FILE}`);
}

generateDocs();
