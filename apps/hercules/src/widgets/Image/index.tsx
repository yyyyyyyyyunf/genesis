import React from 'react';
import { ImageProps } from './schema';
import { cn } from '@/lib/utils';
import { ClientClickTracker } from './ClientClickTracker';

export const Image = ({ data }: { data: ImageProps }) => {
  const { src, alt, clickUrl } = data;

  const renderContent = () => {
    if (data.variant === 'content') {
      const { aspectRatio, objectFit } = data;
      const ratioMap = {
        '16/9': 'aspect-video',
        '4/3': 'aspect-[4/3]',
        '1/1': 'aspect-square',
        'auto': 'aspect-auto',
      };

      const fitMap = {
        cover: 'object-cover',
        contain: 'object-contain',
        fill: 'object-fill',
      };

      return (
        <div className={cn('block w-full overflow-hidden', ratioMap[aspectRatio || 'auto'])}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt={alt || '图片'}
            className={cn('w-full h-full', fitMap[objectFit || 'cover'])}
          />
        </div>
      );
    }

    if (data.variant === 'background') {
      const { height, backgroundPosition, backgroundSize } = data;
      
      const posMap = {
        center: 'bg-center',
        top: 'bg-top',
        bottom: 'bg-bottom',
        left: 'bg-left',
        right: 'bg-right',
      };

      const sizeMap = {
        cover: 'bg-cover',
        contain: 'bg-contain',
      };

      return (
        <div 
          className={cn(
            'w-full bg-no-repeat',
            posMap[backgroundPosition || 'center'],
            sizeMap[backgroundSize || 'cover']
          )}
          style={{ 
            backgroundImage: `url(${src})`,
            height: height
          }}
          role="img"
          aria-label={alt || '背景图片'}
        />
      );
    }

    return null;
  };

  const content = renderContent();

  // 如果有点击链接，则用 Client Component 包装
  if (clickUrl) {
    return (
      <ClientClickTracker clickUrl={clickUrl}>
        {content}
      </ClientClickTracker>
    );
  }

  return content;
};
