// 知识库生成器脚本
import fs from 'fs';
import path from 'path';
import { ZodType, ZodObject, ZodEnum, ZodOptional, ZodDefault, ZodString, ZodNumber, ZodBoolean, ZodArray } from 'zod';
import { SchemaRegistry } from '../src/widgets/schemas';
import { COMPONENT_NAMES } from '../src/lib/engine/component-map';

const OUTPUT_FILE = path.join(process.cwd(), 'knowledge/agent-manual.md');

function getType(schema: ZodType): string {
  if (schema instanceof ZodString) return 'string';
  if (schema instanceof ZodNumber) return 'number';
  if (schema instanceof ZodBoolean) return 'boolean';
  if (schema instanceof ZodEnum) return 'enum';
  if (schema instanceof ZodArray) return 'array';
  if (schema instanceof ZodObject) return 'object';
  
  if (schema instanceof ZodOptional) {
    return getType(schema.def.innerType as ZodType);
  }
  if (schema instanceof ZodDefault) {
    return getType(schema.def.innerType as ZodType);
  }
  
  return 'any';
}

function getOptions(schema: ZodType): string[] | null {
  if (schema instanceof ZodEnum) {
    return schema.options as unknown as string[];
  }
  
  if (schema instanceof ZodOptional) {
    return getOptions(schema.def.innerType as ZodType);
  }
  if (schema instanceof ZodDefault) {
    return getOptions(schema.def.innerType as ZodType);
  }
  
  return null;
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

function generateDocs() {
  let markdown = '# Hercules Agent 组件库手册\n\n';
  markdown += '请参考此文档来生成营销页面的 JSON 配置。\n\n';
  markdown += '> **注意**: `type` 字段现在使用数字 ID (Type ID)。请务必使用对应的数字。\n\n';

  for (const [name, schema] of Object.entries(SchemaRegistry)) {
    const typeId = COMPONENT_NAMES[name];
    markdown += `## 组件: ${name} (Type ID: ${typeId})\n\n`;
    
    if (!(schema instanceof ZodObject)) {
      markdown += `(复杂 Schema: ${getType(schema as ZodType)})\n\n`;
      continue;
    }

    markdown += `### 属性 (Properties)\n\n`;

    const shape = schema.shape;

    for (const [propName, propSchema] of Object.entries(shape)) {
      const fieldSchema = propSchema as ZodType;
      
      const type = getType(fieldSchema);
      const options = getOptions(fieldSchema);
      const description = getDescription(fieldSchema);
      const required = isRequired(fieldSchema);
      const defaultValue = getDefault(fieldSchema);

      markdown += `- **${propName}** ${required ? '(必填)' : '(可选)'}\n`;
      markdown += `  - 类型: \`${type}\`\n`;
      
      if (options) {
        markdown += `  - 选项: ${options.map((o: string) => `\`${o}\``).join(', ')}\n`;
      }

      if (defaultValue !== undefined) {
        markdown += `  - 默认值: \`${JSON.stringify(defaultValue)}\`\n`;
      }

      if (description) {
        markdown += `  - 描述: ${description}\n`;
      }
      
      markdown += '\n';
    }
    
    markdown += '---\n\n';
  }

  fs.writeFileSync(OUTPUT_FILE, markdown);
  console.log(`文档已生成至 ${OUTPUT_FILE}`);
}

generateDocs();
