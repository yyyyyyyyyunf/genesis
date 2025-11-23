import React from 'react';
import { z } from 'zod';
import { DividerSchema } from './schema';
import { cn } from '@/lib/utils';

type DividerProps = z.infer<typeof DividerSchema>;

export const Divider = (props: { data: DividerProps }) => {
  const { style, color, thickness, margin } = props.data;

  return (
    <div 
      className="w-full flex items-center"
      style={{ 
        paddingTop: `${margin}px`,
        paddingBottom: `${margin}px`
      }}
    >
      <div 
        className={cn("w-full border-t-0", color)}
        style={{
          borderTopStyle: style,
          borderTopWidth: `${thickness}px`,
        }}
      />
    </div>
  );
};

