'use client';

import React, { useState } from 'react';
import { z } from 'zod';
import { AccordionSchema } from './schema';
import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';

type AccordionProps = z.infer<typeof AccordionSchema>;

export const Accordion = (props: { data: AccordionProps }) => {
  const { items, allowMultiple } = props.data;
  const [openIndices, setOpenIndices] = useState<number[]>([]);

  const toggleItem = (index: number) => {
    if (allowMultiple) {
      setOpenIndices(prev => 
        prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
      );
    } else {
      setOpenIndices(prev => 
        prev.includes(index) ? [] : [index]
      );
    }
  };

  return (
    <div className="w-full space-y-2">
      {items?.map((item, index) => (
        <div key={index} className="border rounded-lg overflow-hidden">
          <button
            className="w-full px-4 py-3 flex justify-between items-center bg-white hover:bg-gray-50 transition-colors"
            onClick={() => toggleItem(index)}
          >
            <span className="font-medium text-gray-900">{item.title}</span>
            <ChevronDown 
              className={cn(
                "w-5 h-5 text-gray-500 transition-transform duration-200",
                openIndices.includes(index) ? "transform rotate-180" : ""
              )}
            />
          </button>
          <div 
             className={cn(
               "transition-all duration-200 ease-in-out overflow-hidden",
               openIndices.includes(index) ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
             )}
          >
             <div className="px-4 py-3 bg-gray-50 text-gray-600 border-t">
              {item.content}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

