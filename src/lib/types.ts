import { z } from 'zod';

// 1. 基础楼层 Schema
// 每个楼层必须包含 id 和 type。
export const BaseFloorSchema = z.object({
  id: z.string().describe('楼层实例的唯一标识符'),
  type: z.number().describe('组件的数字类型 ID'),
  alias: z.string().optional().describe('用户定义的楼层别名 (例如 "主标题", "活动 Banner")'),
});

// 2. 页面 Schema
// 页面只是楼层的集合。
export const PageSchema = z.object({
  id: z.string(),
  title: z.string().optional(),
  floors: z.array(z.any()), // 这里暂时用 any，稍后我们会细化组件 schema
});

export type PageConfig = z.infer<typeof PageSchema>;

