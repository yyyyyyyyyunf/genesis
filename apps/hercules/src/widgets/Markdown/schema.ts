import { z } from 'zod';

export const MarkdownSchema = z.object({
  content: z.string().describe('内容: Markdown 格式的文本内容').default('# 你好\n这是一个 Markdown 组件示例。'),
  className: z.string().optional().describe('样式类名: 额外的 CSS 类名').default('prose prose-slate max-w-none'),
});

