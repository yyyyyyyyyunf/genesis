import React from 'react';
import { ShelfProps } from './schema';
import { cn } from '@/lib/utils';

export const Shelf = ({ data }: { data: ShelfProps }) => {
  const { layout, title, products } = data;

  return (
    <div className="w-full p-4 space-y-4">
      {title && <h2 className="text-xl font-bold">{title}</h2>}
      
      <div className={cn(
        'w-full',
        layout === 'grid' ? 'grid grid-cols-2 gap-4' : 'flex overflow-x-auto gap-4 pb-4'
      )}>
        {products.map((product) => (
          <div 
            key={product.id} 
            className={cn(
              'border rounded-lg p-3 bg-white shadow-sm flex-shrink-0',
              layout === 'scroll' ? 'w-40' : 'w-full'
            )}
          >
            <div className="h-32 bg-gray-100 rounded-md mb-2 flex items-center justify-center text-gray-400">
              {product.imageUrl ? (
                 /* eslint-disable-next-line @next/next/no-img-element */
                <img src={product.imageUrl} alt={product.name} className="h-full object-cover rounded-md" />
              ) : (
                'Image'
              )}
            </div>
            <h3 className="font-medium text-sm truncate">{product.name}</h3>
            <p className="text-red-500 font-bold mt-1">{product.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

