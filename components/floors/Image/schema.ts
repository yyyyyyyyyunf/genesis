import { z } from 'zod';

export const ImageSchema = z.object({
  src: z.string().describe('Image URL'),
  alt: z.string().optional().describe('Alt text for accessibility').default(''),
  aspectRatio: z.enum(['16/9', '4/3', '1/1', 'auto']).optional().describe('Aspect ratio of the image wrapper').default('auto'),
  objectFit: z.enum(['cover', 'contain', 'fill']).optional().describe('CSS object-fit property').default('cover'),
  clickUrl: z.string().optional().describe('URL to navigate to when clicked'),
});

export type ImageProps = z.infer<typeof ImageSchema>;

