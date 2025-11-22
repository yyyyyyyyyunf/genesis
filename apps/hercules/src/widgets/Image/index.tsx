import React from 'react';
import { ImageProps } from './schema';
import { cn } from '@/lib/utils';
import { ClientClickTracker } from './ClientClickTracker';

export const Image = ({ data }: { data: ImageProps }) => {
  const { src, alt, aspectRatio, objectFit, clickUrl } = data;

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

  // 这完全是在服务器上生成的静态 HTML
  const ImageContent = (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt || '图片'}
      className={cn('w-full h-full', fitMap[objectFit || 'cover'])}
    />
  );

  const wrapperClass = cn('block w-full overflow-hidden', ratioMap[aspectRatio || 'auto']);

  // 如果有点击链接，则用 Client Component 包装
  if (clickUrl) {
    return (
      <div className={wrapperClass}>
        <ClientClickTracker clickUrl={clickUrl}>
          {ImageContent}
        </ClientClickTracker>
      </div>
    );
  }

  // 否则返回静态 HTML
  return (
    <div className={wrapperClass}>
      {ImageContent}
    </div>
  );
};
