import { z } from 'zod';
import { withMeta } from '@/lib/schema-utils';

export const TextSchema = z.object({
  content: withMeta(z.string(), {
    label: '文本内容',
    description: '要显示的实际文本内容',
  }),
  align: withMeta(z.enum(['left', 'center', 'right']), {
    label: '对齐方式',
    description: '文本对齐方式',
    labels: {
      left: '左对齐',
      center: '居中',
      right: '右对齐',
    },
  }).optional().default('left'),
  size: withMeta(z.enum(['sm', 'base', 'lg', 'xl', '2xl']), {
    label: '字体大小',
    description: '字体大小',
    labels: {
      sm: '小',
      base: '标准',
      lg: '大',
      xl: '超大',
      '2xl': '特大',
    },
  }).optional().default('base'),
  color: withMeta(z.string(), {
    label: '文本颜色',
    description: '文本颜色 (Hex 或 Tailwind 类)',
  }).optional().default('text-black'),
  mode: withMeta(z.enum(['simple', 'with-locale']), {
    label: '显示模式',
    description: '显示模式',
    labels: {
      simple: '标准模式',
      'with-locale': '多语言模式',
    },
  }).optional().default('simple'),
});

export type TextProps = z.infer<typeof TextSchema>;
