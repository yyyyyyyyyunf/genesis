import { z } from 'zod';

export const ImageSchema = z.object({
  src: z.string().describe('图片链接地址'),
  alt: z.string().optional().describe('无障碍替代文本').default(''),
  aspectRatio: z.enum(['16/9', '4/3', '1/1', 'auto']).optional().describe('图片容器的宽高比').default('auto'),
  objectFit: z.enum(['cover', 'contain', 'fill']).optional().describe('CSS object-fit 属性').default('cover'),
  clickUrl: z.string().optional().describe('点击跳转链接'),
});

export type ImageProps = z.infer<typeof ImageSchema>;
