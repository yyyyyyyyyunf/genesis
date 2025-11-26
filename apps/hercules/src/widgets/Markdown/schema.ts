import { z } from 'zod';
import { withMeta } from '@/lib/schema-utils';

export const MarkdownSchema = z.object({
  content: withMeta(z.string(), {
    label: '内容',
    description: 'Markdown 格式的文本内容',
  }).default('# 你好\n这是一个 Markdown 组件示例。'),
  className: withMeta(z.string(), {
    label: '样式类名',
    description: '额外的 CSS 类名',
  }).optional().default('prose prose-slate max-w-none'),
});

