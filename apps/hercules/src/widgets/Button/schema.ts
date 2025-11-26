import { z } from 'zod';
import { withMeta } from '@/lib/schema-utils';

export const ButtonSchema = z.object({
  text: withMeta(z.string(), {
    label: '按钮文本',
    description: '按钮上显示的文字',
  }).default('点击我'),
  link: withMeta(z.string(), {
    label: '跳转链接',
    description: '点击按钮后的跳转地址 (优先级高于点击提示)',
  }).optional(),
  clickMessage: withMeta(z.string(), {
    label: '点击提示',
    description: '点击按钮时弹出的提示文字 (仅在无跳转链接时生效)',
  }).optional(),
  variant: withMeta(z.enum(['solid', 'outline', 'ghost', 'link']), {
    label: '样式变体',
    description: '样式变体',
    labels: {
      solid: '实心',
      outline: '描边',
      ghost: '幽灵',
      link: '链接',
    },
  }).optional().default('solid'),
  size: withMeta(z.enum(['sm', 'base', 'lg']), {
    label: '尺寸',
    description: '按钮的大小',
    labels: {
      sm: '小',
      base: '中',
      lg: '大',
    },
  }).optional().default('base'),
  color: withMeta(z.string(), {
    label: '颜色主题',
    description: '按钮的主题颜色 (Tailwind 类或 Hex)',
  }).optional().default('bg-blue-600'),
  radius: withMeta(z.enum(['none', 'sm', 'md', 'lg', 'full']), {
    label: '圆角',
    description: '按钮的圆角大小',
    labels: {
      none: '无',
      sm: '小',
      md: '中',
      lg: '大',
      full: '全圆',
    },
  }).optional().default('md'),
  fullWidth: withMeta(z.boolean(), {
    label: '全宽',
    description: '是否占满容器宽度',
  }).optional().default(false),
  showArrow: withMeta(z.boolean(), {
    label: '显示箭头',
    description: '是否在文字后显示箭头图标',
  }).optional().default(false),
});
