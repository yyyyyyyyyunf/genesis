import { z } from 'zod';
import { withMeta } from '@/lib/schema-utils';

export const AvatarGroupSchema = z.object({
  images: withMeta(z.array(z.url()), {
    label: '头像链接列表',
  }).default([
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Bob'
  ]),
  size: withMeta(z.enum(['sm', 'md', 'lg']), {
    label: '尺寸',
    labels: {
      sm: '小',
      md: '中',
      lg: '大',
    },
  }).default('md'),
  max: withMeta(z.number().min(1), {
    label: '最大显示数量',
  }).default(5),
});

