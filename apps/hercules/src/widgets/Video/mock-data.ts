import { z } from 'zod';
import { VideoSchema } from './schema';

type VideoProps = z.infer<typeof VideoSchema>;

export const VideoMockData: {
  minimal: VideoProps;
  complete: VideoProps;
} = {
  minimal: {
    src: 'https://example.com/videos/product-demo.mp4'
  },
  complete: {
    src: 'https://example.com/videos/product-intro.mp4',
    poster: 'https://images.unsplash.com/photo-1492619375914-88005aa9e8fb',
    autoplay: false,
    controls: true,
    loop: false,
    muted: false,
    aspectRatio: '16/9'
  }
};

