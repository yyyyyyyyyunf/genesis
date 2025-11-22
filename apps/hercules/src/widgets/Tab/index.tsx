'use client';

import React, { useState } from 'react';
import { TabProps } from './schema';
import { cn } from '@/lib/utils';
import { ClientRecursiveRenderer } from '@/lib/engine/renderer/client/ClientRecursiveRenderer';

export const Tab = ({ data }: { data: TabProps }) => {
  const { items, defaultActiveKey } = data;
  const [activeKey, setActiveKey] = useState(defaultActiveKey || items[0]?.key);

  if (!items || items.length === 0) return null;

  const activeItem = items.find((item) => item.key === activeKey) || items[0];

  return (
    <div className="w-full flex flex-col">
      {/* Tab 头部 */}
      <div className="flex border-b overflow-x-auto">
        {items.map((item) => (
          <button
            key={item.key}
            onClick={() => setActiveKey(item.key)}
            className={cn(
              'px-6 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors',
              activeKey === item.key
                ? 'border-green-600 text-green-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            )}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Tab 内容 */}
      <div className="p-4 bg-gray-50 min-h-[200px]">
        {activeItem.children && activeItem.children.length > 0 ? (
          <div className="space-y-4">
             <ClientRecursiveRenderer floors={activeItem.children} />
          </div>
        ) : (
          <div className="text-center text-gray-400 py-10">
            此标签页暂无内容
          </div>
        )}
      </div>
    </div>
  );
};
