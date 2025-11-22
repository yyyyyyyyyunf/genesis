import { z } from 'zod';

export const TextSchema = z.object({
  content: z.string().describe('The actual text content to display'),
  align: z.enum(['left', 'center', 'right']).optional().describe('Text alignment').default('left'),
  size: z.enum(['sm', 'base', 'lg', 'xl', '2xl']).optional().describe('Font size').default('base'),
  color: z.string().optional().describe('Text color (hex or tailwind class)').default('text-black'),
});

export type TextProps = z.infer<typeof TextSchema>;

