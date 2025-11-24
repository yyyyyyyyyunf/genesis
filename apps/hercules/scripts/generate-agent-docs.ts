// 知识库生成器脚本
import fs from 'fs';
import path from 'path';
import { ZodType, ZodObject, ZodEnum, ZodOptional, ZodDefault, ZodString, ZodNumber, ZodBoolean, ZodArray, ZodDiscriminatedUnion, ZodLiteral } from 'zod';
import { SchemaRegistry } from '../src/widgets/schemas';
import { COMPONENT_NAMES, COMPONENT_LABELS } from '../src/widgets/component-map';

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
 * 清理和解析 schema 描述中的元数据标记
 */
function cleanDescription(rawDescription: string): { label: string, description: string, unit?: string, defaultValue?: string } {
  let description = rawDescription;
  let label = '';
  let unit: string | undefined;
  let defaultValue: string | undefined;

  // 1. 提取标签（冒号前的部分）
  if (description.includes(': ')) {
    const parts = description.split(': ');
    if (parts.length > 1) {
      label = parts[0];
      description = parts.slice(1).join(': ');
    }
  }

  // 2. 保留 @labels({...}) - Agent 需要通过这些标签理解选项含义
  // 不移除 @labels，因为用户在编辑器中看到的是这些 label

  // 3. 解析并转换 @unit(xxx) - Agent 需要知道单位
  const unitMatch = description.match(/@unit\(([^)]+)\)/);
  if (unitMatch) {
    unit = unitMatch[1];
    description = description.replace(unitMatch[0], '').trim();
    description += ` (单位: ${unit})`;
  }

  // 4. 解析 @default(xxx) - Agent 需要知道默认行为
  const defaultMatch = description.match(/@default\(([^)]+)\)/);
  if (defaultMatch) {
    defaultValue = defaultMatch[1];
    description = description.replace(defaultMatch[0], '').trim();
  }

  return { label, description, unit, defaultValue };
}

function getDescription(schema: ZodType): string {
  if (schema.description) return schema.description;
  
  if (schema.def && 'description' in schema.def && typeof schema.def.description === 'string') {
    return schema.def.description;
  }
  
  if (schema instanceof ZodOptional) {
    return getDescription(schema.def.innerType as ZodType);
  }
  if (schema instanceof ZodDefault) {
    return getDescription(schema.def.innerType as ZodType);
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

  // 处理 Discriminated Union（可辨识联合）
  if (schema instanceof ZodDiscriminatedUnion) {
    const discriminator = schema.def.discriminator;
    const options = schema.options as ZodObject<any>[];
    const rawDesc = getDescription(schema);
    const { description, defaultValue } = cleanDescription(rawDesc);

    if (description) {
        output += `${description}\n\n`;
    }
    if (defaultValue) {
        output += `> 默认类型: \`${defaultValue}\`\n\n`;
    }

    output += `**支持的类型 (${discriminator})**:\n`;
    
    for (const option of options) {
      const shape = option.shape;
      const discriminatorField = shape[discriminator];
      
      // 获取字面量的值
      const discriminatorValue = discriminatorField._def?.value || discriminatorField.value;
      
      // 获取字面量的描述作为标签
      const literalDesc = getDescription(discriminatorField);
      
      // 对于字面量，如果描述中没有冒号，整个描述就是标签
      let displayLabel = discriminatorValue;
      if (literalDesc) {
        if (literalDesc.includes(':')) {
          const { label: literalLabel } = cleanDescription(literalDesc);
          displayLabel = literalLabel || discriminatorValue;
        } else {
          // 没有冒号，整个描述就是标签
          displayLabel = literalDesc;
        }
      }
      
      output += `\n#### 类型: \`${discriminatorValue}\` - ${displayLabel}\n`;
      
      // 如果整个选项有描述，也显示出来
      const optionDesc = getDescription(option);
      if (optionDesc) {
          output += `${optionDesc}\n`;
      }
      
      // 渲染该类型的特有字段
      output += renderObjectProperties(option, level, discriminator);
    }
    return output;
  }

  // 处理对象
  if (schema instanceof ZodObject) {
    return renderObjectProperties(schema, level);
  }

  // 简单类型的兜底处理（通常顶层是 Object 或 Union）
  return `(类型: ${getType(schema)})`;
}

/**
 * 渲染对象属性的文档列表
 */
function renderObjectProperties(schema: ZodObject<any>, level: number, skipField?: string): string {
  let output = '';
  const shape = schema.shape;

  for (const [propName, propSchema] of Object.entries(shape)) {
    if (propName === skipField) continue; // 跳过辨识符字段（已在上层显示）

    const fieldSchema = propSchema as ZodType;
    const type = getType(fieldSchema);
    const options = getOptions(fieldSchema);
    const rawDescription = getDescription(fieldSchema);
    const required = isRequired(fieldSchema);
    const defaultValue = getDefault(fieldSchema);

    const { label, description } = cleanDescription(rawDescription);

    output += `- **${propName}** ${required ? '(必填)' : '(可选)'}\n`;
    if (label) {
      output += `  - **中文名**: ${label}\n`;
    }
    output += `  - 类型: \`${type}\`\n`;
    
    if (options) {
      output += `  - 选项: ${options.map((o: string | number) => `\`${o}\``).join(', ')}\n`;
    }

    if (defaultValue !== undefined) {
      output += `  - 默认值: \`${JSON.stringify(defaultValue)}\`\n`;
    }

    if (description) {
      output += `  - 描述: ${description}\n`;
    }
    
    // 递归处理嵌套对象（AutoForm 支持，文档也应该支持）
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
  
  // 生成最小示例（只包含必填字段）
  output += '#### 最小配置\n\n```json\n';
  output += generateMinimalExample(name, typeId, schema);
  output += '\n```\n\n';
  
  // 生成完整示例（包含所有常用字段）
  output += '#### 完整配置\n\n```json\n';
  output += generateCompleteExample(name, typeId, schema);
  output += '\n```\n\n';
  
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
