import { z } from 'zod';
import { withMeta } from '@/lib/schema-utils';

export const SpacerSchema = z.object({
  height: withMeta(z.number(), {
    label: '高度',
    description: '间距的高度 (px)',
    unit: 'px',
  }).default(20),
  backgroundColor: withMeta(z.string(), {
    label: '背景颜色',
    description: '间距的背景颜色 (Hex 或 Tailwind 类)',
  }).optional().default('bg-transparent'),
});

