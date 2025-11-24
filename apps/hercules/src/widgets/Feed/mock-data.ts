import { z } from 'zod';
import { FeedSchema } from './schema';

type FeedProps = z.infer<typeof FeedSchema>;

export const FeedMockData: {
  minimal: FeedProps;
  complete: FeedProps;
} = {
  minimal: {
    items: [
      {
        title: '春季新品发布',
        summary: '全新系列产品即将上市，敬请期待'
      },
      {
        title: '限时优惠活动',
        summary: '全场五折起，优惠多多'
      }
    ],
    layout: 'list'
  },
  complete: {
    items: [
      {
        title: '2024春季新品发布会',
        summary: '全新系列产品即将上市，包含服装、配饰等多个品类，敬请期待',
        image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8',
        date: '2024-03-15',
        tag: '新品',
        link: 'https://example.com/news/spring-collection'
      },
      {
        title: '周年庆限时优惠',
        summary: '全场五折起，优惠多多，精选商品低至3折',
        image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da',
        date: '2024-03-10',
        tag: '促销',
        link: 'https://example.com/promotion/anniversary'
      },
      {
        title: '品牌故事分享',
        summary: '了解我们的品牌理念和发展历程',
        image: 'https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1',
        date: '2024-03-05',
        tag: '品牌',
        link: 'https://example.com/about/story'
      }
    ],
    layout: 'card',
    columns: 3
  }
};

