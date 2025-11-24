import { z } from 'zod';
import { ShelfSchema } from './schema';

type ShelfProps = z.infer<typeof ShelfSchema>;

export const ShelfMockData: {
  minimal: ShelfProps;
  complete: ShelfProps;
} = {
  minimal: {
    layout: 'grid',
    products: [
      {
        id: 'prod_001',
        name: '经典款运动鞋',
        price: '¥299',
        imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff'
      },
      {
        id: 'prod_002',
        name: '时尚休闲包',
        price: '¥199',
        imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62'
      }
    ]
  },
  complete: {
    layout: 'scroll',
    title: '热门推荐',
    products: [
      {
        id: 'prod_001',
        name: '经典款运动鞋',
        price: '¥299',
        imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff'
      },
      {
        id: 'prod_002',
        name: '时尚休闲包',
        price: '¥199',
        imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62'
      },
      {
        id: 'prod_003',
        name: '蓝牙耳机',
        price: '¥399',
        imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e'
      },
      {
        id: 'prod_004',
        name: '智能手表',
        price: '¥899',
        imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30'
      }
    ]
  }
};

