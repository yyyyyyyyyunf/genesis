import { z } from 'zod';

export const TextSchema = z.object({
  content: z.string().describe('要显示的实际文本内容'),
  align: z.enum(['left', 'center', 'right']).optional().describe('文本对齐方式').default('left'),
  size: z.enum(['sm', 'base', 'lg', 'xl', '2xl']).optional().describe('字体大小').default('base'),
  color: z.string().optional().describe('文本颜色 (Hex 或 Tailwind 类)').default('text-black'),
});

export type TextProps = z.infer<typeof TextSchema>;
