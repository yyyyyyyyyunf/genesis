import { z } from 'zod';

export const CarouselSchema = z.object({
  items: z.array(
    z.object({
      image: z.string().describe('图片链接: 轮播图片的 URL'),
      link: z.string().optional().describe('跳转链接: 点击图片的跳转地址'),
      alt: z.string().optional().describe('替代文本: 图片的替代文本'),
    })
  ).describe('轮播项: 轮播图列表'),
  autoplay: z.boolean().optional().describe('自动播放: 是否开启自动轮播').default(true),
  interval: z.number().optional().describe('轮播间隔: 自动轮播的时间间隔 (毫秒)').default(3000),
  showArrows: z.boolean().optional().describe('显示箭头: 是否显示左右切换箭头').default(true),
  showDots: z.boolean().optional().describe('显示指示点: 是否显示底部指示点').default(true),
  aspectRatio: z.enum(['16/9', '4/3', '3/1', 'auto']).optional().describe('宽高比: 轮播容器的宽高比').default('16/9'),
});

