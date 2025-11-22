import React from 'react';
import { TextProps } from './schema';
import { cn } from '@/lib/utils';
import { LocaleBadge } from './LocaleBadge';

export const Text = ({ data }: { data: TextProps }) => {
  const { content, align, size, color } = data;

  const sizeMap = {
    sm: 'text-sm',
    base: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
    '2xl': 'text-2xl',
  };

  return (
    <div className={cn('w-full p-4', `text-${align}`)}>
      <p className={cn(sizeMap[size || 'base'], color)}>
        {content}
        {/* 演示在 RSC 内部通过 Client Component 插槽使用 Context */}
        <LocaleBadge />
      </p>
    </div>
  );
};
