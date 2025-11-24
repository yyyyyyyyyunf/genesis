import { z } from 'zod';

const BaseImageSchema = z.object({
  src: z.string().describe('图片链接: 图片链接地址'),
  clickUrl: z.string().optional().describe('跳转链接: 点击跳转链接'),
  alt: z.string().optional().describe('替代文本: 无障碍替代文本').default(''),
});

const ContentImageSchema = BaseImageSchema.extend({
  variant: z.literal('content').describe('普通内容图片'),
  aspectRatio: z.enum(['16/9', '4/3', '1/1', 'auto']).optional().describe('宽高比: 图片容器的宽高比').default('auto'),
  objectFit: z.enum(['cover', 'contain', 'fill']).optional().describe('填充模式: CSS object-fit 属性 @labels({"cover":"覆盖", "contain":"包含", "fill":"拉伸"})').default('cover'),
});

const BackgroundImageSchema = BaseImageSchema.extend({
  variant: z.literal('background').describe('背景图片'),
  height: z.string().describe('高度: 容器高度 (如 300px, 20rem) @unit(px)'),
  backgroundPosition: z.enum(['center', 'top', 'bottom', 'left', 'right']).optional().describe('背景位置: 在容器内的位置').default('center'),
  backgroundSize: z.enum(['cover', 'contain']).optional().describe('背景大小: CSS background-size 属性').default('cover'),
});

export const ImageSchema = z.discriminatedUnion('variant', [
  ContentImageSchema,
  BackgroundImageSchema,
]).describe('图片类型: 支持内容图片和背景图片两种模式 @default(content)');

export type ImageProps = z.infer<typeof ImageSchema>;
