import React from 'react';
import { ImageProps } from './schema';
import { cn } from '@/lib/utils';

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

  const ImageContent = (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt || 'image'}
      className={cn('w-full h-full', fitMap[objectFit || 'cover'])}
    />
  );

  const Wrapper = clickUrl ? 'a' : 'div';
  const wrapperProps = clickUrl ? { href: clickUrl, target: '_blank', rel: 'noopener noreferrer' } : {};

  return (
    <Wrapper
      {...wrapperProps}
      className={cn('block w-full overflow-hidden', ratioMap[aspectRatio || 'auto'])}
    >
      {ImageContent}
    </Wrapper>
  );
};

