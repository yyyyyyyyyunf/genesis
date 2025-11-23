'use client';

import React from 'react';
import { z } from 'zod';
import { CodeBlockSchema } from './schema';

type CodeBlockProps = z.infer<typeof CodeBlockSchema>;

export const CodeBlockClient = ({ data }: { data: CodeBlockProps }) => {
  const { code, language } = data;

  return (
    <div className="rounded-lg overflow-hidden shadow-sm border border-gray-200 bg-gray-900 text-white text-sm">
      <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700">
        <span className="text-xs font-mono text-gray-400">{language}</span>
        <span className="text-xs text-gray-500 uppercase">Preview</span>
      </div>
      <pre className="p-4 overflow-x-auto">
        <code>{code}</code>
      </pre>
    </div>
  );
};

