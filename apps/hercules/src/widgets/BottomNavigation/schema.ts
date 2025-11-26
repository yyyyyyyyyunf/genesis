import { z } from 'zod';
import { withMeta } from '@/lib/schema-utils';

export const BottomNavigationSchema = z.object({
  items: withMeta(
    z.array(
      z.object({
        label: withMeta(z.string(), {
          label: '标签',
          description: '按钮文字',
        }),
        icon: withMeta(z.string(), {
          label: '图标',
          description: 'Lucide图标名称',
        }).optional().default('Home'),
        link: withMeta(z.string(), {
          label: '链接',
          description: '跳转地址',
        }).optional(),
        activeIcon: withMeta(z.string(), {
          label: '选中图标',
          description: '选中状态的图标',
        }).optional(),
      })
    ).min(1).max(5),
    {
      label: '导航项',
      description: '底部导航按钮列表',
    }
  ),
  activeColor: withMeta(z.string(), {
    label: '选中颜色',
    description: '选中状态的颜色 (Tailwind类)',
  }).optional().default('text-blue-600'),
  backgroundColor: withMeta(z.string(), {
    label: '背景颜色',
    description: '导航栏背景颜色 (Tailwind类)',
  }).optional().default('bg-white'),
});

