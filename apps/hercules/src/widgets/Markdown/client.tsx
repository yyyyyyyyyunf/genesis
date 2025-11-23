'use client';

import React from 'react';
import { z } from 'zod';
import { MarkdownSchema } from './schema';
import { cn } from '@/lib/utils';

type MarkdownProps = z.infer<typeof MarkdownSchema>;

export const MarkdownClient = ({ data }: { data: MarkdownProps }) => {
  const { content, className } = data;

  return (
    <div className={cn("prose prose-slate max-w-none p-4 border border-dashed border-gray-300 rounded bg-gray-50", className)}>
      <div className="text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide">Markdown Preview (Client)</div>
      <pre className="whitespace-pre-wrap font-sans text-sm text-gray-700">
        {content}
      </pre>
      <div className="text-xs text-gray-400 mt-2 italic">
        * Full markdown rendering is available in Server Side Rendering.
      </div>
    </div>
  );
};

