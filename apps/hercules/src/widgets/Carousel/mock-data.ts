import { z } from 'zod';
import { CarouselSchema } from './schema';

type CarouselProps = z.infer<typeof CarouselSchema>;

export const CarouselMockData: {
  minimal: CarouselProps;
  complete: CarouselProps;
} = {
  minimal: {
    items: [
      {
        image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8',
        link: 'https://example.com/sale1'
      },
      {
        image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b',
        link: 'https://example.com/sale2'
      }
    ]
  },
  complete: {
    items: [
      {
        image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8',
        link: 'https://example.com/promotion/summer-sale',
        alt: '夏季大促销'
      },
      {
        image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b',
        link: 'https://example.com/promotion/new-arrival',
        alt: '新品上市'
      },
      {
        image: 'https://images.unsplash.com/photo-1445205170230-053b83016050',
        link: 'https://example.com/promotion/clearance',
        alt: '清仓特惠'
      }
    ],
    autoplay: true,
    interval: 3000,
    showArrows: true,
    showDots: true,
    aspectRatio: '16/9'
  }
};

