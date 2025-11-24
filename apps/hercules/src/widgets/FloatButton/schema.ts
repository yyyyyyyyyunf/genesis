import { z } from 'zod';

export const FloatButtonSchema = z.object({
  icon: z.string().describe('图标: Lucide图标名称').default('ArrowUp'),
  action: z.enum(['backToTop', 'link', 'custom']).describe('动作: 点击按钮触发的行为 @labels({"backToTop":"回到顶部", "link":"跳转链接", "custom":"自定义"})').default('backToTop'),
  link: z.string().optional().describe('链接: 跳转地址 (仅action=link时生效)'),
  position: z.enum(['bottom-right', 'bottom-left']).optional().describe('位置: 按钮位置 @labels({"bottom-right":"右下角", "bottom-left":"左下角"})').default('bottom-right'),
  bottomOffset: z.number().optional().describe('底部偏移: 距离底部的距离 (px) @unit(px)').default(100),
  color: z.string().optional().describe('颜色: 按钮颜色 (Tailwind类)').default('bg-blue-600 text-white'),
});

