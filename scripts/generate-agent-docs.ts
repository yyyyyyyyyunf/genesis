import fs from 'fs';
import path from 'path';
import { ZodType, ZodObject, ZodEnum, ZodOptional, ZodDefault, ZodString, ZodNumber, ZodBoolean, ZodArray } from 'zod';
import { SchemaRegistry } from '../widgets/schemas';

const OUTPUT_FILE = path.join(process.cwd(), 'agent-manual.md');

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
  let markdown = '# Hercules Component Library for Agents\n\n';
  markdown += 'Use this reference to generate the JSON configuration for the marketing page.\n\n';

  for (const [name, schema] of Object.entries(SchemaRegistry)) {
    markdown += `## Component: ${name}\n\n`;
    
    if (!(schema instanceof ZodObject)) {
      markdown += `(Complex Schema: ${getType(schema as ZodType)})\n\n`;
      continue;
    }

    markdown += `### Properties\n\n`;

    const shape = schema.shape;

    for (const [propName, propSchema] of Object.entries(shape)) {
      const fieldSchema = propSchema as ZodType;
      
      const type = getType(fieldSchema);
      const options = getOptions(fieldSchema);
      const description = getDescription(fieldSchema);
      const required = isRequired(fieldSchema);
      const defaultValue = getDefault(fieldSchema);

      markdown += `- **${propName}** ${required ? '(Required)' : '(Optional)'}\n`;
      markdown += `  - Type: \`${type}\`\n`;
      
      if (options) {
        markdown += `  - Options: ${options.map((o: string) => `\`${o}\``).join(', ')}\n`;
      }

      if (defaultValue !== undefined) {
        markdown += `  - Default: \`${JSON.stringify(defaultValue)}\`\n`;
      }

      if (description) {
        markdown += `  - Description: ${description}\n`;
      }
      
      markdown += '\n';
    }
    
    markdown += '---\n\n';
  }

  fs.writeFileSync(OUTPUT_FILE, markdown);
  console.log(`Documentation generated at ${OUTPUT_FILE}`);
}

generateDocs();
