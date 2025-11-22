import { z } from 'zod';

export const ShelfSchema = z.object({
  layout: z.enum(['grid', 'scroll']).describe('布局模式: 布局模式：grid (双列网格) 或 scroll (横向滚动)'),
  title: z.string().optional().describe('标题: 货架的可选标题'),
  products: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      price: z.string(),
      imageUrl: z.string().optional(),
    })
  ).describe('商品列表: 要展示的商品列表'),
});

export type ShelfProps = z.infer<typeof ShelfSchema>;
