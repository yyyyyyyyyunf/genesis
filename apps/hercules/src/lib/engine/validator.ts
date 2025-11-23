import { ZodError, ZodIssue } from 'zod';
import { SchemaRegistry } from '../../widgets/schemas';
import { getComponentKey } from '../../widgets/component-map';

// 验证结果类型定义
export type ValidationResult = 
  | { success: true; data: any }
  | { success: false; error: ZodError; report: string };

/**
 * 格式化 Zod 错误信息为 AI 可读的简明报告 (中文)
 */
function formatZodError(error: ZodError): string {
  return error.issues.map((issue: ZodIssue) => {
    const path = issue.path.join('.');
    let message = issue.message;
    
    // 简单的错误信息翻译 (可以扩展)
    if (message === 'Required') message = '必填项丢失';
    if (message.includes('Expected')) message = message.replace('Expected', '期望').replace('received', '实际收到');

    return `字段 '${path}' 无效: ${message}`;
  }).join('; ');
}

/**
 * 验证楼层配置
 * @param type 组件类型 ID (例如 1, 19) 或 别名
 * @param data 组件数据对象
 * @returns 验证结果
 */
export function validateFloorConfig(type: number | string, data: any): ValidationResult {
  // 1. 获取组件 Key
  const componentKey = getComponentKey(type);
  if (!componentKey) {
    return {
      success: false,
      error: new ZodError([{
        code: 'custom',
        path: [],
        message: `未知的组件类型: ${type}`
      }]),
      report: `错误: 系统中不存在类型 ID 为 '${type}' 的组件。请检查 component-map。`
    };
  }

  // 2. 获取 Schema
  const schema = (SchemaRegistry as any)[componentKey];
  if (!schema) {
    return {
      success: false,
      error: new ZodError([{
        code: 'custom',
        path: [],
        message: `组件 ${componentKey} 未定义 Schema`
      }]),
      report: `错误: 组件 '${componentKey}' 缺少 Schema 定义。无法验证数据。`
    };
  }

  // 3. 执行校验 (Safe Parse)
  const result = schema.safeParse(data);

  // 4. 处理结果
  if (result.success) {
    return {
      success: true,
      data: result.data // 这里包含了被 Schema 填充的默认值
    };
  } else {
    return {
      success: false,
      error: result.error,
      report: `配置校验失败 (${componentKey}): ${formatZodError(result.error)}`
    };
  }
}

/*
 * 使用示例 (Verification):
 * 
 * // 假设 AI 返回了错误的配置:
 * const aiConfig = {
 *   type: 19, // FloatButton
 *   data: {
 *     action: 'jump', // 错误: enum 只有 'backToTop' | 'link' | 'custom'
 *     bottomOffset: "100" // 错误: 期望 number，收到 string
 *   }
 * };
 * 
 * const result = validateFloorConfig(aiConfig.type, aiConfig.data);
 * 
 * if (!result.success) {
 *   console.log(result.report);
 *   // 输出: 
 *   // "配置校验失败 (FloatButton): 字段 'action' 无效: Invalid enum value. Expected 'backToTop' | 'link' | 'custom', received 'jump'; 字段 'bottomOffset' 无效: 期望 number, 实际收到 string"
 *   
 *   // 我们可以将这个 report 直接返回给 AI，让它修正。
 * }
 */

