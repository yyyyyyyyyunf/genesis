import { z } from 'zod';
import { withMeta } from '@/lib/schema-utils';

export const CodeBlockSchema = z.object({
  code: withMeta(z.string(), {
    label: '代码',
    description: '需要高亮的代码内容',
  }).default('console.log("Hello World");'),
  language: withMeta(z.string(), {
    label: '语言',
    description: '代码语言 (如 typescript, python, html)',
  }).default('typescript'),
  theme: withMeta(z.string(), {
    label: '主题',
    description: '代码高亮主题 (如 github-dark, dracula)',
  }).optional().default('github-dark'),
});

