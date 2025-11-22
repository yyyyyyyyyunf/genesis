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

  // This is purely static HTML generated on the server
  const ImageContent = (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt || 'image'}
      className={cn('w-full h-full', fitMap[objectFit || 'cover'])}
    />
  );

  const wrapperClass = cn('block w-full overflow-hidden', ratioMap[aspectRatio || 'auto']);

  // If there's a click URL, wrap it in the Client Component
  if (clickUrl) {
    return (
      <div className={wrapperClass}>
        <ClientClickTracker clickUrl={clickUrl}>
          {ImageContent}
        </ClientClickTracker>
      </div>
    );
  }

  // Otherwise return static HTML
  return (
    <div className={wrapperClass}>
      {ImageContent}
    </div>
  );
};
