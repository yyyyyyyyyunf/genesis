
import { PageConfig, Floor, BaseFloorSchema } from '@genesis/hercules/types';
import { ZodType, ZodOptional, ZodDefault } from 'zod';

/**
 * 解包 ZodOptional 和 ZodDefault 以获取底层类型
 */
export function unwrapSchema(schema: ZodType): ZodType {
  if (schema instanceof ZodOptional) {
    return unwrapSchema(schema.unwrap() as ZodType);
  }
  if (schema instanceof ZodDefault) {
    return unwrapSchema(schema.removeDefault() as ZodType);
  }
  return schema;
}

export interface SchemaMetadata {
  label: string | undefined;
  description: string | undefined;
  unit: string | undefined;
  enumLabels: Record<string, string> | undefined;
  defaultValue: string | undefined;
  literalLabels?: Record<string, string>; // Discriminated Union 的字面量选项标签
}

export function getSchemaMeta(schema: ZodType, defaultLabel?: string): SchemaMetadata {
  let current: ZodType | null = schema;
  let fullDescription: string | undefined;

  while (current) {
      if (current.description) {
        fullDescription = current.description;
        break; // 找到描述就停止，通常最外层的描述最准确
      }

      // 逐层解包
      if (current instanceof ZodOptional) {
        current = current.unwrap() as ZodType;
      } else if (current instanceof ZodDefault) {
        current = current.removeDefault() as ZodType;
      } else {
        current = null;
      }
  }

  if (!fullDescription) {
    return {
      label: defaultLabel,
      description: undefined,
      unit: undefined,
      enumLabels: undefined,
      defaultValue: undefined,
    };
  }

  // 解析元数据
  let label = defaultLabel;
  let description = fullDescription;
  let unit: string | undefined;
  let enumLabels: Record<string, string> | undefined;
  let defaultValue: string | undefined;

  // 1. 提取标签（冒号前的部分）
  const parts = fullDescription.split(': ');
  if (parts.length > 0) {
    label = parts[0];
    if (parts.length > 1) {
        description = parts.slice(1).join(': ');
    }
  }

  // 2. 解析 @unit(单位)
  const unitMatch = description?.match(/@unit\(([^)]+)\)/);
  if (unitMatch) {
    unit = unitMatch[1];
    description = description?.replace(unitMatch[0], '').trim();
  }

  // 3. 解析 @labels(JSON映射)
  const labelsMatch = description?.match(/@labels\(([^)]+)\)/);
  if (labelsMatch) {
    try {
      // 尝试解析 JSON，将单引号替换为双引号
      const jsonStr = labelsMatch[1].replace(/'/g, '"');
      enumLabels = JSON.parse(jsonStr);
      description = description?.replace(labelsMatch[0], '').trim();
    } catch {
      console.warn('无法解析 @labels 元数据:', labelsMatch[1]);
    }
  }

  // 4. 解析 @default(默认值)
  const defaultMatch = description?.match(/@default\(([^)]+)\)/);
  if (defaultMatch) {
      defaultValue = defaultMatch[1];
      description = description?.replace(defaultMatch[0], '').trim();
  }

  return {
    label,
    description,
    unit,
    enumLabels,
    defaultValue,
    literalLabels: undefined,
  };
}

/**
 * 从 discriminated union 的各个 literal schema 中提取标签
 * 用于在属性检查器中显示友好的选项名称
 */
export function getLiteralLabelsFromUnion(
  unionOptions: any[],
  discriminator: string
): Record<string, string> {
  const labels: Record<string, string> = {};
  
  unionOptions.forEach(opt => {
    const shape = opt.shape;
    const discriminatorField = shape?.[discriminator];
    
    if (discriminatorField) {
      // 获取 literal 的值
      let value: string | undefined;
      if ('value' in discriminatorField) {
        value = discriminatorField.value as string;
      } else if (discriminatorField._def?.value) {
        value = discriminatorField._def.value as string;
      }
      
      if (value) {
        // 尝试从 description 中提取标签
        const meta = getSchemaMeta(discriminatorField);
        if (meta.label) {
          labels[value] = meta.label;
        }
      }
    }
  });
  
  return labels;
}

// 保持向后兼容性，但在 AutoForm 中应优先使用 getSchemaMeta
export function getLabelFromSchema(schema: ZodType, defaultLabel?: string): string | undefined {
    return getSchemaMeta(schema, defaultLabel).label;
}


export const getAliasLabel = () => {
    const aliasSchema = BaseFloorSchema.shape.alias;
    const meta = getSchemaMeta(aliasSchema);
    return meta.label;
};

/**
 * 递归在配置树中通过 ID 查找楼层节点
 * @param floors 页面配置数组
 * @param targetId 目标楼层 ID
 * @returns 找到的楼层节点，未找到则返回 null
 */
export function findFloorNode(floors: PageConfig, targetId: string): Floor | null {
  for (const floor of floors) {
    if (floor.id === targetId) {
      return floor;
    }
    // 检查 Tab 组件中的嵌套子项 (data.items[].children)
    if (floor.data?.items && Array.isArray(floor.data.items)) {
      for (const item of floor.data.items) {
        if (item.children && Array.isArray(item.children)) {
          const found = findFloorNode(item.children, targetId);
          if (found) return found;
        }
      }
    }
    // 通用子项检查（为将来可能的标准 children 属性预留）
    if (floor.data?.children && Array.isArray(floor.data.children)) {
       const found = findFloorNode(floor.data.children, targetId);
       if (found) return found;
    }
  }
  return null;
}

/**
 * 递归通过 ID 更新楼层节点
 * @param floors 页面配置数组
 * @param targetId 目标楼层 ID
 * @param updates 要更新的字段
 * @returns 新的配置数组（不可变更新）
 */
export function updateFloorNode(floors: PageConfig, targetId: string, updates: { data?: any, alias?: string }): PageConfig {
  return floors.map(floor => {
    // 找到匹配的楼层
    if (floor.id === targetId) {
      return {
        ...floor,
        ...(updates.data ? { data: { ...floor.data, ...updates.data } } : {}),
        ...(updates.alias !== undefined ? { alias: updates.alias } : {}),
      };
    }

    // 在 Tab 组件的子项中递归查找并更新
    if (floor.data?.items && Array.isArray(floor.data.items)) {
      const newItems = floor.data.items.map((item: any) => {
        if (item.children && Array.isArray(item.children)) {
          const newChildren = updateFloorNode(item.children, targetId, updates);
          if (newChildren !== item.children) {
             return { ...item, children: newChildren };
          }
        }
        return item;
      });
      
      // 如果 items 发生变化，返回新的 floor 对象
      // 注意：由于页面配置较小，完全重建新对象是可接受的
      return {
          ...floor,
          data: { ...floor.data, items: newItems }
      };
    }

    return floor;
  });
}

/**
 * 递归通过 ID 删除楼层节点
 * @param floors 页面配置数组
 * @param targetId 要删除的楼层 ID
 * @returns 新的配置数组（不可变删除）
 */
export function removeFloorNode(floors: PageConfig, targetId: string): PageConfig {
  // 过滤当前层级
  const filtered = floors.filter(f => f.id !== targetId);
  if (filtered.length !== floors.length) {
      return filtered; // 在当前层级找到并移除
  }

  // 递归查找子级
  return floors.map(floor => {
    if (floor.data?.items && Array.isArray(floor.data.items)) {
       const newItems = floor.data.items.map((item: any) => {
         if (item.children && Array.isArray(item.children)) {
           const newChildren = removeFloorNode(item.children, targetId);
           return { ...item, children: newChildren };
         }
         return item;
       });
       return { ...floor, data: { ...floor.data, items: newItems } };
    }
    return floor;
  });
}
