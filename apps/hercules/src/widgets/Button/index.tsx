'use client';

import React from 'react';
import { z } from 'zod';
import { ButtonSchema } from './schema';
import { cn } from '@/lib/utils';

type ButtonProps = z.infer<typeof ButtonSchema>;

const variantStyles = {
  solid: 'text-white border-transparent hover:opacity-90',
  outline: 'bg-transparent border-2 hover:bg-gray-50',
  ghost: 'bg-transparent border-transparent hover:bg-gray-100',
};

const sizeStyles = {
  sm: 'px-3 py-1.5 text-sm',
  base: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg',
};

const radiusStyles = {
  none: 'rounded-none',
  sm: 'rounded-sm',
  md: 'rounded-md',
  lg: 'rounded-lg',
  full: 'rounded-full',
};

export const Button = (props: { data: ButtonProps }) => {
  const { 
    text, 
    link, 
    clickMessage,
    variant = 'solid', 
    size = 'base', 
    color = 'bg-blue-600', 
    radius = 'md', 
    fullWidth = false 
  } = props.data;

  const baseStyles = 'inline-flex items-center justify-center font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none cursor-pointer';

  const variantClass = variantStyles[variant];
  const sizeClass = sizeStyles[size];
  const radiusClass = radiusStyles[radius];
  const widthClass = fullWidth ? 'w-full' : '';

  let colorClass = color;
  if (variant === 'outline' || variant === 'ghost') {
      if (color.startsWith('bg-')) {
          colorClass = color.replace('bg-', 'text-').replace('600', '600').replace('500', '600');
          colorClass += ` border-${color.replace('bg-', '')}`;
      }
  }

  const className = cn(
    baseStyles,
    sizeClass,
    radiusClass,
    widthClass,
    variant === 'solid' ? color : '',
    variant !== 'solid' ? colorClass : '',
    variantClass
  );

  const handleClick = () => {
    if (clickMessage) {
      alert(clickMessage);
    }
  };

  if (link) {
    return (
      <a href={link} className={className}>
        {text}
      </a>
    );
  }

  return (
    <button 
      type="button" 
      className={className}
      onClick={handleClick}
    >
      {text}
    </button>
  );
};
