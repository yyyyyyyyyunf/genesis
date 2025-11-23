import { z } from 'zod';

export const MarkdownSchema = z.object({
  content: z.string().describe('内容: Markdown 格式的文本内容').default('# Hello World\nThis is a markdown component.'),
  className: z.string().optional().describe('样式类名: 额外的 CSS 类名').default('prose prose-slate max-w-none'),
});

