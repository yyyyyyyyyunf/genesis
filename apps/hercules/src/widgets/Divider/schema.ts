import { z } from 'zod';
import { withMeta } from '@/lib/schema-utils';

export const DividerSchema = z.object({
  style: withMeta(z.enum(['solid', 'dashed', 'dotted']), {
    label: '样式',
    description: '分割线样式',
    labels: {
      solid: '实线',
      dashed: '虚线',
      dotted: '点线',
    },
  }).default('solid'),
  color: withMeta(z.string(), {
    label: '颜色',
    description: 'Tailwind 类',
  }).default('border-gray-200'),
  thickness: withMeta(z.number().min(1).max(10), {
    label: '粗细',
    description: 'px',
    unit: 'px',
  }).default(1),
  margin: withMeta(z.number().min(0).max(100), {
    label: '上下间距',
    description: 'px',
    unit: 'px',
  }).default(20),
});

