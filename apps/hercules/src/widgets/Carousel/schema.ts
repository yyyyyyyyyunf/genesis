import { z } from 'zod';
import { withMeta } from '@/lib/schema-utils';

export const CarouselSchema = z.object({
  items: withMeta(
    z.array(
      z.object({
        image: withMeta(z.string(), {
          label: '图片链接',
          description: '轮播图片的 URL',
        }),
        link: withMeta(z.string(), {
          label: '跳转链接',
          description: '点击图片的跳转地址',
        }).optional(),
        alt: withMeta(z.string(), {
          label: '替代文本',
          description: '图片的替代文本',
        }).optional(),
      })
    ),
    {
      label: '轮播项',
      description: '轮播图列表',
    }
  ),
  autoplay: withMeta(z.boolean(), {
    label: '自动播放',
    description: '是否开启自动轮播',
  }).optional().default(true),
  interval: withMeta(z.number(), {
    label: '轮播间隔',
    description: '自动轮播的时间间隔 (毫秒)',
  }).optional().default(3000),
  showArrows: withMeta(z.boolean(), {
    label: '显示箭头',
    description: '是否显示左右切换箭头',
  }).optional().default(true),
  showDots: withMeta(z.boolean(), {
    label: '显示指示点',
    description: '是否显示底部指示点',
  }).optional().default(true),
  aspectRatio: withMeta(z.enum(['16/9', '4/3', '3/1', 'auto']), {
    label: '宽高比',
    description: '轮播容器的宽高比',
    labels: {
      '16/9': '宽屏',
      '4/3': '标准',
      '3/1': '全景',
      auto: '自适应',
    },
  }).optional().default('16/9'),
});

