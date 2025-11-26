import { z } from 'zod';
import { withMeta } from '@/lib/schema-utils';

export const CountdownSchema = z.object({
  targetDate: withMeta(z.string(), {
    label: '目标时间',
    description: 'ISO格式',
  }).default(new Date(Date.now() + 86400000).toISOString()),
  textColor: withMeta(z.string(), {
    label: '文字颜色',
    description: 'Tailwind 类',
  }).default('text-gray-900'),
  backgroundColor: withMeta(z.string(), {
    label: '背景颜色',
    description: 'Tailwind 类',
  }).default('bg-white'),
  endMessage: withMeta(z.string(), {
    label: '结束文案',
  }).default('活动已结束'),
});

