import { z } from 'zod';

export const CountdownSchema = z.object({
  targetDate: z.string().describe('目标时间 (ISO格式)').default(new Date(Date.now() + 86400000).toISOString()),
  textColor: z.string().describe('文字颜色 (Tailwind 类)').default('text-gray-900'),
  backgroundColor: z.string().describe('背景颜色 (Tailwind 类)').default('bg-white'),
  endMessage: z.string().describe('结束文案').default('活动已结束'),
});

