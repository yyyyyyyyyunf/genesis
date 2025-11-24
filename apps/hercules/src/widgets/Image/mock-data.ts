import { z } from 'zod';
import { ImageSchema } from './schema';

type ImageProps = z.infer<typeof ImageSchema>;

export const ImageMockData: {
  minimal: ImageProps;
  complete: ImageProps;
} = {
  minimal: {
    variant: 'content',
    src: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30',
    alt: '',
    aspectRatio: 'auto',
    objectFit: 'cover'
  },
  complete: {
    variant: 'content',
    src: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30',
    clickUrl: 'https://example.com/product/watch',
    alt: '精美手表产品图',
    aspectRatio: '16/9',
    objectFit: 'cover'
  }
};

// 背景图片模式的示例
export const ImageBackgroundMockData: {
  minimal: ImageProps;
  complete: ImageProps;
} = {
  minimal: {
    variant: 'background',
    src: 'https://images.unsplash.com/photo-1557821552-17105176677c',
    alt: '',
    height: '400px',
    backgroundPosition: 'center',
    backgroundSize: 'cover'
  },
  complete: {
    variant: 'background',
    src: 'https://images.unsplash.com/photo-1557821552-17105176677c',
    clickUrl: 'https://example.com/promotion',
    alt: '促销活动背景',
    height: '400px',
    backgroundPosition: 'center',
    backgroundSize: 'cover'
  }
};

