import { z } from 'zod';

// 这里定义一个最小化的子组件结构以避免循环依赖
// 在实际应用中，我们可以使用 z.lazy() 来引用完整的 Floor 架构
const FloorStub = z.object({
  id: z.string(),
  type: z.number(), // 从字符串更改为数字
  alias: z.string().optional(), // 添加可选别名
  data: z.any(),
});

export const TabSchema = z.object({
  items: z.array(
    z.object({
      label: z.string().describe('Tab 标签 (例如：韩国、中国)'),
      key: z.string().describe('Tab 的唯一标识 Key'),
      children: z.array(FloorStub).default([]).describe('该 Tab 下要渲染的组件列表'),
    })
  ).describe('Tab 列表项'),
  defaultActiveKey: z.string().optional().describe('默认激活的 Tab Key'),
});

export type TabProps = z.infer<typeof TabSchema>;
