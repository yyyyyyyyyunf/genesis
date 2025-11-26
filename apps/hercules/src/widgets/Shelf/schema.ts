import { z } from 'zod';
import { withMeta } from '@/lib/schema-utils';

export const ShelfSchema = z.object({
  layout: withMeta(z.enum(['grid', 'scroll']), {
    label: '布局模式',
    description: '布局模式：grid (双列网格) 或 scroll (横向滚动)',
    labels: {
      grid: '网格',
      scroll: '滚动',
    },
  }),
  title: withMeta(z.string(), {
    label: '标题',
    description: '货架的可选标题',
  }).optional(),
  products: withMeta(
    z.array(
      z.object({
        id: z.string(),
        name: z.string(),
        price: z.string(),
        imageUrl: z.string().optional(),
      })
    ),
    {
      label: '商品列表',
      description: '要展示的商品列表',
    }
  ),
});

export type ShelfProps = z.infer<typeof ShelfSchema>;
