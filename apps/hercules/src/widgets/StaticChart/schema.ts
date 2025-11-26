import { z } from 'zod';
import { withMeta } from '@/lib/schema-utils';

export const StaticChartSchema = z.object({
  title: withMeta(z.string(), {
    label: '标题',
    description: '图表标题',
  }).optional().default('月度数据'),
  type: withMeta(z.enum(['bar', 'line']), {
    label: '类型',
    description: '图表类型 (柱状图/折线图)',
    labels: {
      bar: '柱状图',
      line: '折线图',
    },
  }).default('bar'),
  data: withMeta(z.array(z.number()), {
    label: '数据',
    description: '数值数组',
  }).default([10, 25, 15, 30, 45, 20]),
  labels: withMeta(z.array(z.string()), {
    label: '标签',
    description: 'X轴标签数组',
  }).optional().default(['1月', '2月', '3月', '4月', '5月', '6月']),
  color: withMeta(z.string(), {
    label: '颜色',
    description: '图表颜色 (Hex)',
  }).optional().default('#3b82f6'),
  height: withMeta(z.number(), {
    label: '高度',
    description: '图表高度 (px)',
    unit: 'px',
  }).optional().default(200),
});

