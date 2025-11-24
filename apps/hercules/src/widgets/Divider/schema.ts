import { z } from 'zod';

export const DividerSchema = z.object({
  style: z.enum(['solid', 'dashed', 'dotted']).describe('样式: 分割线样式 @labels({"solid":"实线", "dashed":"虚线", "dotted":"点线"})').default('solid'),
  color: z.string().describe('颜色 (Tailwind 类)').default('border-gray-200'),
  thickness: z.number().min(1).max(10).describe('粗细 (px) @unit(px)').default(1),
  margin: z.number().min(0).max(100).describe('上下间距 (px) @unit(px)').default(20),
});

