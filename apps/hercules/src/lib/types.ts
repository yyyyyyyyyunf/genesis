import { z } from 'zod';

// 1. 基础楼层 Schema
// 每个楼层必须包含 id 和 type。
export const BaseFloorSchema = z.object({
  id: z.string().describe('楼层实例的唯一标识符'),
  type: z.number().describe('组件的数字类型 ID'),
  alias: z.string().optional().describe('别名: 用户定义的楼层别名 (例如 "主标题", "活动 Banner")'),
});

// Floor 应该是 BaseFloorSchema 加上 data: any (具体由组件决定)
export type Floor = z.infer<typeof BaseFloorSchema> & { data: any };

// 2. 页面配置类型
// 直接定义为楼层数组，简化使用
export type PageConfig = Floor[];
