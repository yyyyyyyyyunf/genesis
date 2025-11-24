import { z } from 'zod';

export const SpacerSchema = z.object({
  height: z.number().describe('高度: 间距的高度 (px) @unit(px)').default(20),
  backgroundColor: z.string().optional().describe('背景颜色: 间距的背景颜色 (Hex 或 Tailwind 类)').default('bg-transparent'),
});

