import React from 'react';
import { z } from 'zod';
import { VideoSchema } from './schema';
import { cn } from '@/lib/utils';

type VideoProps = z.infer<typeof VideoSchema>;

const aspectRatioMap = {
  '16/9': 'aspect-video',
  '4/3': 'aspect-[4/3]',
  '1/1': 'aspect-square',
  'auto': '',
};

export const Video = (props: { data: VideoProps }) => {
  const { src, poster, autoplay, controls, loop, muted, aspectRatio = '16/9' } = props.data;

  if (!src) {
    return (
      <div className={cn("w-full bg-gray-100 flex items-center justify-center text-gray-400", aspectRatioMap[aspectRatio])}>
        未配置视频源
      </div>
    );
  }

  return (
    <div className={cn("w-full relative overflow-hidden", aspectRatioMap[aspectRatio])}>
      <video
        src={src}
        poster={poster}
        autoPlay={autoplay}
        controls={controls}
        loop={loop}
        muted={muted}
        className="w-full h-full object-cover"
        playsInline
      />
    </div>
  );
};

