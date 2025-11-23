'use client';

import React, { useEffect, useState } from 'react';
import { z } from 'zod';
import { FloatButtonSchema } from './schema';
import { cn } from '@/lib/utils';
import * as LucideIcons from 'lucide-react';

// Tailwind 安全列表，用于 db.json 中使用的动态颜色
// bg-orange-500 text-white shadow-orange-200
// bg-blue-600 bg-red-600 bg-green-600 bg-purple-600

type FloatButtonProps = z.infer<typeof FloatButtonSchema>;

export const FloatButton = ({ data }: { data: FloatButtonProps }) => {
  const { icon, action, link, position, bottomOffset, color } = data;
  const [isVisible, setIsVisible] = useState(false);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const IconComponent = (LucideIcons as any)[icon || 'ArrowUp'];

  useEffect(() => {
    if (action === 'backToTop') {
      const toggleVisibility = () => {
        if (window.scrollY > 300) {
          setIsVisible(true);
        } else {
          setIsVisible(false);
        }
      };

      // 初始检查
      toggleVisibility();

      window.addEventListener('scroll', toggleVisibility);
      return () => window.removeEventListener('scroll', toggleVisibility);
    } else {
      setIsVisible(true);
    }
  }, [action]);

  const handleClick = () => {
    if (action === 'backToTop') {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    } else if (action === 'link' && link) {
      window.location.href = link;
    } else {
      console.log('自定义动作被点击');
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md h-0 pointer-events-none z-40 overflow-visible">
      <button
        onClick={handleClick}
        className={cn(
          "absolute pointer-events-auto p-3 rounded-full shadow-md transition-transform hover:scale-110 active:scale-95 flex items-center justify-center bg-white",
          position === 'bottom-right' ? 'right-4' : 'left-4',
          color
        )}
        style={{ bottom: `${bottomOffset}px` }}
        aria-label={action}
      >
        {IconComponent && <IconComponent className="w-6 h-6" />}
      </button>
    </div>
  );
};
