import React from 'react';
import { FeedProps } from './schema';
import { cn } from '@/lib/utils';

export const Feed = (props: { data: FeedProps }) => {
  const { items, layout = 'list', columns = 2 } = props.data;

  if (!items || items.length === 0) {
    return (
      <div className="w-full bg-gray-100 p-8 flex items-center justify-center text-gray-400 rounded-lg">
        暂无内容
      </div>
    );
  }

  const gridColsClass = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
  }[columns] || 'grid-cols-1 sm:grid-cols-2';

  if (layout === 'card') {
    return (
      <div className={cn("w-full grid gap-6 p-4", gridColsClass)}>
        {items.map((item, index) => (
          <Wrapper key={index} link={item.link} className="block h-full">
            <div className="bg-white rounded-lg overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-shadow h-full flex flex-col">
              {item.image && (
                <div className="aspect-video w-full relative overflow-hidden bg-gray-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src={item.image} 
                    alt={item.title} 
                    className="w-full h-full object-cover"
                  />
                  {item.tag && (
                    <span className="absolute top-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                      {item.tag}
                    </span>
                  )}
                </div>
              )}
              <div className="p-4 flex flex-col flex-grow">
                {!item.image && item.tag && (
                  <div className="mb-2">
                    <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">
                      {item.tag}
                    </span>
                  </div>
                )}
                <h3 className="font-bold text-lg mb-2 line-clamp-2 text-gray-900">{item.title}</h3>
                <p className="text-gray-500 text-sm mb-4 line-clamp-3 flex-grow">{item.summary}</p>
                {item.date && (
                  <div className="text-xs text-gray-400 mt-auto pt-2 border-t border-gray-50">
                    {item.date}
                  </div>
                )}
              </div>
            </div>
          </Wrapper>
        ))}
      </div>
    );
  }

  // List layout
  return (
    <div className="w-full flex flex-col divide-y divide-gray-100">
      {items.map((item, index) => (
        <Wrapper key={index} link={item.link} className="block hover:bg-gray-50 transition-colors">
          <div className="p-4 flex gap-4">
            {item.image && (
              <div className="w-24 h-24 sm:w-32 sm:h-32 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={item.image} 
                  alt={item.title} 
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div className="flex flex-col flex-grow min-w-0 justify-between py-1">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  {item.tag && (
                    <span className="text-blue-600 text-xs font-medium bg-blue-50 px-1.5 py-0.5 rounded">
                      {item.tag}
                    </span>
                  )}
                  <h3 className="font-bold text-base sm:text-lg text-gray-900 truncate">{item.title}</h3>
                </div>
                <p className="text-gray-500 text-sm line-clamp-2 mb-2">{item.summary}</p>
              </div>
              {item.date && (
                <div className="text-xs text-gray-400">
                  {item.date}
                </div>
              )}
            </div>
          </div>
        </Wrapper>
      ))}
    </div>
  );
};

const Wrapper = ({ link, children, className }: { link?: string; children: React.ReactNode; className?: string }) => {
  if (link) {
    return <a href={link} className={className}>{children}</a>;
  }
  return <div className={className}>{children}</div>;
};

