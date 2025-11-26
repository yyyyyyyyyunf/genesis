import { z } from 'zod';
import { withMeta } from '@/lib/schema-utils';

export const FloatButtonSchema = z.object({
  icon: withMeta(z.string(), {
    label: '图标',
    description: 'Lucide图标名称',
  }).default('ArrowUp'),
  action: withMeta(z.enum(['backToTop', 'link', 'custom']), {
    label: '动作',
    description: '点击按钮触发的行为',
    labels: {
      backToTop: '回到顶部',
      link: '跳转链接',
      custom: '自定义',
    },
  }).default('backToTop'),
  link: withMeta(z.string(), {
    label: '链接',
    description: '跳转地址 (仅action=link时生效)',
  }).optional(),
  position: withMeta(z.enum(['bottom-right', 'bottom-left']), {
    label: '位置',
    description: '按钮位置',
    labels: {
      'bottom-right': '右下角',
      'bottom-left': '左下角',
    },
  }).optional().default('bottom-right'),
  bottomOffset: withMeta(z.number(), {
    label: '底部偏移',
    description: '距离底部的距离 (px)',
    unit: 'px',
  }).optional().default(100),
  color: withMeta(z.string(), {
    label: '颜色',
    description: '按钮颜色 (Tailwind类)',
  }).optional().default('bg-blue-600 text-white'),
});

