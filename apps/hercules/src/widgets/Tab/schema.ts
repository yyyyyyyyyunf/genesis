import { z } from 'zod';
import { withMeta } from '@/lib/schema-utils';

// 这里定义一个最小化的子组件结构以避免循环依赖
// 在实际应用中，我们可以使用 z.lazy() 来引用完整的 Floor 架构
const FloorStub = z.object({
  id: z.string(),
  type: z.number(), // 从字符串更改为数字
  alias: z.string().optional(), // 添加可选别名
  data: z.any(),
});

export const TabSchema = z.object({
  items: withMeta(
    z.array(
      z.object({
        label: withMeta(z.string(), {
          label: '标签名',
          description: 'Tab 标签 (例如：韩国、中国)',
        }),
        key: withMeta(z.string(), {
          label: '键值',
          description: 'Tab 的唯一标识 Key',
        }),
        children: withMeta(z.array(FloorStub), {
          label: '子组件',
          description: '该 Tab 下要渲染的组件列表',
        }).default([]),
      })
    ),
    {
      label: '标签项',
      description: 'Tab 列表项',
    }
  ),
  defaultActiveKey: withMeta(z.string(), {
    label: '默认选中',
    description: '默认激活的 Tab Key',
  }).optional(),
});

export type TabProps = z.infer<typeof TabSchema>;
