'use client';

import React from 'react';
import { z } from 'zod';
import { ButtonSchema } from './schema';
import { cn } from '@/lib/utils';
import { ArrowRight } from 'lucide-react';

type ButtonProps = z.infer<typeof ButtonSchema>;

const variantStyles = {
  solid: 'text-white border-transparent hover:brightness-110 shadow-sm active:scale-[0.98]',
  outline: 'bg-transparent border-2 hover:bg-opacity-10 active:scale-[0.98]',
  ghost: 'bg-transparent border-transparent hover:bg-gray-100 hover:text-gray-900',
  link: 'bg-transparent text-primary hover:underline underline-offset-4 p-0 h-auto',
};

const sizeStyles = {
  sm: 'px-4 py-2 text-sm gap-1.5',
  base: 'px-6 py-3 text-base gap-2',
  lg: 'px-8 py-4 text-lg font-semibold gap-2.5',
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
    fullWidth = false,
    showArrow = false,
  } = props.data;

  const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none cursor-pointer select-none';

  const variantClass = variantStyles[variant as keyof typeof variantStyles] || variantStyles.solid;
  const sizeClass = sizeStyles[size] || sizeStyles.base;
  const radiusClass = radiusStyles[radius] || radiusStyles.md;
  const widthClass = fullWidth ? 'w-full flex' : '';

  // 改进的颜色处理
  let colorClass = '';
  let borderClass = '';
  
  // 尽可能提取基础颜色名称 (非常基础的启发式)
  const baseColorMatch = color.match(/(?:bg|text|border)-([a-z]+)-(\d+)/);
  const baseColorName = baseColorMatch ? baseColorMatch[1] : 'blue';
  
  if (variant === 'solid') {
    colorClass = color; // 期望是 bg- 类名
  } else if (variant === 'outline') {
    // 如果输入是 bg-blue-600，我们需要 text-blue-600 和 border-blue-600
    if (color.startsWith('bg-')) {
        const textColor = color.replace('bg-', 'text-');
        const borderColor = color.replace('bg-', 'border-');
        colorClass = `${textColor} ${borderColor}`;
        // 添加鼠标悬停时的微弱背景色
        const hoverBg = `hover:bg-${baseColorName}-50`;
        colorClass += ` ${hoverBg}`;
    } else {
        colorClass = color;
    }
  } else if (variant === 'ghost') {
     if (color.startsWith('bg-')) {
        colorClass = color.replace('bg-', 'text-');
     } else {
        colorClass = color;
     }
  }

  const className = cn(
    baseStyles,
    sizeClass,
    radiusClass,
    widthClass,
    variantClass,
    colorClass
  );

  const handleClick = () => {
    if (clickMessage) {
      alert(clickMessage);
    }
  };

  const Content = (
    <>
      <span>{text}</span>
      {showArrow && <ArrowRight className="w-[1em] h-[1em]" />}
    </>
  );

  if (link) {
    return (
      <a href={link} className={className}>
        {Content}
      </a>
    );
  }

  return (
    <button 
      type="button" 
      className={className}
      onClick={handleClick}
    >
      {Content}
    </button>
  );
};
