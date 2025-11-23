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
  const { text, link, variant = 'solid', size = 'base', color = 'bg-blue-600', radius = 'md', fullWidth = false } = props.data;

  const baseStyles = 'inline-flex items-center justify-center font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';
  
  const variantClass = variantStyles[variant];
  const sizeClass = sizeStyles[size];
  const radiusClass = radiusStyles[radius];
  const widthClass = fullWidth ? 'w-full' : '';

  // 对于 outline 和 ghost 样式，如果 'color' 是背景色类，我们需要特殊处理文本颜色
  // 理想情况下 'color' 应该拆分或更智能地处理，但目前仅做简单的拼接
  // 如果 variant 是 solid，使用背景色。如果是 outline，使用与背景匹配的文本颜色（Tailwind 类比较复杂）。
  // 为了简化演示，如果是 solid 我们直接应用 'color' 类，或者尽可能推导文本颜色（或者让用户指定文本颜色）。
  // 假设 'color' 输入类似 'bg-blue-600' 或 'text-blue-600'。
  
  let colorClass = color;
  if (variant === 'outline' || variant === 'ghost') {
      // 如果用户传入了 bg- 类，尝试替换为 text- (简单的替换)
      if (color.startsWith('bg-')) {
          colorClass = color.replace('bg-', 'text-').replace('600', '600').replace('500', '600'); // 确保可见性
          colorClass += ` border-${color.replace('bg-', '')}`; // 为 outline 添加边框颜色
      }
  }

  const className = cn(
    baseStyles,
    sizeClass,
    radiusClass,
    widthClass,
    variant === 'solid' ? color : '', // Solid 样式直接使用背景色
    variant !== 'solid' ? colorClass : '', // 其他样式使用推导或原始颜色
    variantClass
  );

  if (link) {
    return (
      <a href={link} className={className}>
        {text}
      </a>
    );
  }

  return (
    <button type="button" className={className}>
      {text}
    </button>
  );
};

