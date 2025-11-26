import { z } from 'zod';

/**
 * 所有 schema 类型都可以有的基础元数据
 */
export interface BaseMetadata {
  label?: string;
  description?: string;
}

/**
 * 字符串和数字类型的元数据（可以有单位）
 */
export interface StringNumberMetadata extends BaseMetadata {
  unit?: string;
}

/**
 * 枚举类型的元数据（可以有标签映射）
 */
export interface EnumMetadata extends BaseMetadata {
  labels?: Record<string, string>;
}

/**
 * 可辨识联合类型的元数据（可以有默认值）
 */
export interface UnionMetadata extends BaseMetadata {
  defaultValue?: string;
}

/**
 * 以类型安全的方式为 Zod schemas 附加元数据的辅助函数
 * 
 * 使用示例：
 * ```typescript
 * // 带单位的字符串
 * withMeta(z.string(), { label: '高度', description: '容器高度', unit: 'px' })
 * 
 * // 带标签的枚举
 * withMeta(z.enum(['left', 'center', 'right']), {
 *   label: '对齐方式',
 *   description: '文本对齐方式',
 *   labels: { left: '左对齐', center: '居中', right: '右对齐' }
 * })
 * 
 * // 对象（只有基础元数据）
 * withMeta(z.object({ ... }), { label: '配置对象', description: '详细配置' })
 * ```
 */

// ZodString/ZodNumber - 可以有 unit
export function withMeta<T extends z.ZodString | z.ZodNumber>(
  schema: T,
  metadata: StringNumberMetadata
): T;

// ZodEnum - 可以有 labels
export function withMeta<T extends z.ZodEnum<any>>(
  schema: T,
  metadata: EnumMetadata
): T;

// ZodDiscriminatedUnion - 可以有 defaultValue
export function withMeta<T extends z.ZodDiscriminatedUnion<any, any>>(
  schema: T,
  metadata: UnionMetadata
): T;

// ZodObject/ZodArray - 只有基础元数据
export function withMeta<T extends z.ZodObject<any> | z.ZodArray<any>>(
  schema: T,
  metadata: BaseMetadata
): T;

// ZodLiteral - 只有基础元数据（用于辨识符字段）
export function withMeta<T extends z.ZodLiteral<any>>(
  schema: T,
  metadata: BaseMetadata
): T;

// ZodBoolean - 只有基础元数据
export function withMeta<T extends z.ZodBoolean>(
  schema: T,
  metadata: BaseMetadata
): T;

// 支持 ZodOptional 包装的 schemas
export function withMeta<T extends z.ZodOptional<z.ZodString | z.ZodNumber>>(
  schema: T,
  metadata: StringNumberMetadata
): T;

export function withMeta<T extends z.ZodOptional<z.ZodEnum<any>>>(
  schema: T,
  metadata: EnumMetadata
): T;

export function withMeta<T extends z.ZodOptional<z.ZodObject<any> | z.ZodArray<any> | z.ZodLiteral<any> | z.ZodBoolean>>(
  schema: T,
  metadata: BaseMetadata
): T;

// 支持 ZodDefault 包装的 schemas
export function withMeta<T extends z.ZodDefault<z.ZodString | z.ZodNumber>>(
  schema: T,
  metadata: StringNumberMetadata
): T;

export function withMeta<T extends z.ZodDefault<z.ZodEnum<any>>>(
  schema: T,
  metadata: EnumMetadata
): T;

export function withMeta<T extends z.ZodDefault<z.ZodObject<any> | z.ZodArray<any> | z.ZodLiteral<any> | z.ZodBoolean>>(
  schema: T,
  metadata: BaseMetadata
): T;

// 实现
export function withMeta(schema: any, metadata: any): any {
  return schema.meta(metadata);
}

