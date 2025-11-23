import { z } from 'zod';

export const BottomNavigationSchema = z.object({
  items: z.array(z.object({
    label: z.string().describe('标签: 按钮文字'),
    icon: z.string().optional().describe('图标: Lucide图标名称').default('Home'),
    link: z.string().optional().describe('链接: 跳转地址'),
    activeIcon: z.string().optional().describe('选中图标: 选中状态的图标'),
  })).min(1).max(5).describe('导航项: 底部导航按钮列表'),
  activeColor: z.string().optional().describe('选中颜色: 选中状态的颜色 (Tailwind类)').default('text-blue-600'),
  backgroundColor: z.string().optional().describe('背景颜色: 导航栏背景颜色 (Tailwind类)').default('bg-white'),
});

