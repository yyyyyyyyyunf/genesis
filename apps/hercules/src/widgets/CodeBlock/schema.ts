import { z } from 'zod';

export const CodeBlockSchema = z.object({
  code: z.string().describe('代码: 需要高亮的代码内容').default('console.log("Hello World");'),
  language: z.string().describe('语言: 代码语言 (如 typescript, python, html)').default('typescript'),
  theme: z.string().optional().describe('主题: 代码高亮主题 (如 github-dark, dracula)').default('github-dark'),
});

