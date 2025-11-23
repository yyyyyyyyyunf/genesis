import React from 'react';
import { z } from 'zod';
import { CodeBlockSchema } from './schema';
import { codeToHtml } from 'shiki';

type CodeBlockProps = z.infer<typeof CodeBlockSchema>;

export const CodeBlock = async ({ data }: { data: CodeBlockProps }) => {
  const { code, language, theme = 'github-dark' } = data;

  let html = '';
  try {
    html = await codeToHtml(code, {
      lang: language,
      theme: theme
    });
  } catch (e) {
    // 如果语言不支持或发生错误，则回退到普通显示
    console.error('Shiki 高亮错误:', e);
    html = `<pre><code>${code}</code></pre>`;
  }

  return (
    <div 
      className="rounded-lg overflow-hidden shadow-lg text-sm"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};

