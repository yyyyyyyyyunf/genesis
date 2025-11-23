import React from 'react';
import { z } from 'zod';
import { AvatarGroupSchema } from './schema';
import { cn } from '@/lib/utils';

type AvatarGroupProps = z.infer<typeof AvatarGroupSchema>;

const sizeStyles = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base',
};

export const AvatarGroup = (props: { data: AvatarGroupProps }) => {
  const { images, size, max } = props.data;
  
  const displayImages = images?.slice(0, max) || [];
  const remaining = Math.max(0, (images?.length || 0) - max);
  const sizeClass = sizeStyles[size];

  return (
    <div className="flex -space-x-3 overflow-hidden p-1">
      {displayImages.map((src, index) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={index}
          className={cn(
            "inline-block rounded-full ring-2 ring-white object-cover bg-gray-100",
            sizeClass
          )}
          src={src}
          alt={`Avatar ${index + 1}`}
        />
      ))}
      {remaining > 0 && (
        <div className={cn(
          "flex items-center justify-center rounded-full ring-2 ring-white bg-gray-100 text-gray-600 font-medium z-10",
          sizeClass
        )}>
          +{remaining}
        </div>
      )}
    </div>
  );
};

