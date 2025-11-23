'use client';

import React, { useState } from 'react';
import { z } from 'zod';
import { BottomNavigationSchema } from './schema';
import { cn } from '@/lib/utils';
import * as LucideIcons from 'lucide-react';

type BottomNavigationProps = z.infer<typeof BottomNavigationSchema>;

export const BottomNavigation = ({ data }: { data: BottomNavigationProps }) => {
  const { items, activeColor, backgroundColor } = data;
  const [activeIndex, setActiveIndex] = useState(0);

  const handleClick = (index: number, link?: string) => {
    setActiveIndex(index);
    if (link) {
      window.location.href = link;
    }
  };

  return (
    <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md z-50 pb-safe">
      <div className={cn("flex items-center justify-around h-16 border-t border-gray-200 shadow-lg", backgroundColor)}>
        {items.map((item, index) => {
          const isActive = index === activeIndex;
          // 动态获取图标组件
          const iconName = isActive && item.activeIcon ? item.activeIcon : (item.icon || 'Circle');
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const IconComponent = (LucideIcons as any)[iconName];

          return (
            <button
              key={index}
              className={cn(
                "flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors",
                isActive ? activeColor : "text-gray-500 hover:text-gray-700"
              )}
              onClick={() => handleClick(index, item.link)}
            >
              {IconComponent && <IconComponent className="w-6 h-6" />}
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
