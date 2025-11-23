import React from 'react';
import { z } from 'zod';
import { SpacerSchema } from './schema';

type SpacerProps = z.infer<typeof SpacerSchema>;

export const Spacer = (props: { data: SpacerProps }) => {
  const { height, backgroundColor = 'bg-transparent' } = props.data;

  return (
    <div 
      className={backgroundColor} 
      style={{ height: `${height}px` }}
      aria-hidden="true"
    />
  );
};

