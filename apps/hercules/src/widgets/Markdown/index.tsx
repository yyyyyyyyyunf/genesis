import React from 'react';
import { z } from 'zod';
import { MarkdownSchema } from './schema';
import { remark } from 'remark';
import html from 'remark-html';
import { cn } from '@/lib/utils';

type MarkdownProps = z.infer<typeof MarkdownSchema>;

export const Markdown = async ({ data }: { data: MarkdownProps }) => {
  const { content, className } = data;

  const processedContent = await remark()
    .use(html)
    .process(content);
  const contentHtml = processedContent.toString();

  return (
    <div 
      className={cn("prose prose-slate max-w-none", className)}
      dangerouslySetInnerHTML={{ __html: contentHtml }} 
    />
  );
};

