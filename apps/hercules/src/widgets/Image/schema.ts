import { z } from 'zod';
import { withMeta } from '@/lib/schema-utils';

const BaseImageSchema = z.object({
  src: withMeta(z.string(), { label: '图片链接', description: '图片链接地址' }),
  clickUrl: withMeta(z.string(), { label: '跳转链接', description: '点击跳转链接' }).optional(),
  alt: withMeta(z.string(), { label: '替代文本', description: '无障碍替代文本' }).optional().default(''),
});

const ContentImageSchema = BaseImageSchema.extend({
  variant: withMeta(z.literal('content'), { label: '普通内容图片' }),
  aspectRatio: withMeta(z.enum(['16/9', '4/3', '1/1', 'auto']), {
    label: '宽高比',
    description: '图片容器的宽高比'
  }).optional().default('auto'),
  objectFit: withMeta(z.enum(['cover', 'contain', 'fill']), {
    label: '填充模式',
    description: 'CSS object-fit 属性',
    labels: { cover: '覆盖', contain: '包含', fill: '拉伸' }
  }).optional().default('cover'),
});

const BackgroundImageSchema = BaseImageSchema.extend({
  variant: withMeta(z.literal('background'), { label: '背景图片' }),
  height: withMeta(z.string(), { label: '高度', description: '容器高度 (如 300px, 20rem)', unit: 'px' }),
  backgroundPosition: withMeta(z.enum(['center', 'top', 'bottom', 'left', 'right']), {
    label: '背景位置',
    description: '在容器内的位置'
  }).optional().default('center'),
  backgroundSize: withMeta(z.enum(['cover', 'contain']), {
    label: '背景大小',
    description: 'CSS background-size 属性'
  }).optional().default('cover'),
});

export const ImageSchema = withMeta(z.discriminatedUnion('variant', [
  ContentImageSchema,
  BackgroundImageSchema,
]), {
  label: '图片类型',
  description: '支持内容图片和背景图片两种模式',
  defaultValue: 'content'
});

export type ImageProps = z.infer<typeof ImageSchema>;
