import { z } from 'zod';

export const StaticChartSchema = z.object({
  title: z.string().optional().describe('标题: 图表标题').default('月度数据'),
  type: z.enum(['bar', 'line']).describe('类型: 图表类型 (柱状图/折线图)').default('bar'),
  data: z.array(z.number()).describe('数据: 数值数组').default([10, 25, 15, 30, 45, 20]),
  labels: z.array(z.string()).optional().describe('标签: X轴标签数组').default(['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']),
  color: z.string().optional().describe('颜色: 图表颜色 (Hex)').default('#3b82f6'),
  height: z.number().optional().describe('高度: 图表高度 (px)').default(200),
});

