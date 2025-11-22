import { z } from 'zod';

export const ShelfSchema = z.object({
  layout: z.enum(['grid', 'scroll']).describe('Layout mode: grid (2 columns) or scroll (horizontal scroll)'),
  title: z.string().optional().describe('Optional title for the shelf'),
  products: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      price: z.string(),
      imageUrl: z.string().optional(),
    })
  ).describe('List of products to display'),
});

export type ShelfProps = z.infer<typeof ShelfSchema>;

