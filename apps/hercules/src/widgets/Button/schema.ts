import { z } from 'zod';

export const ButtonSchema = z.object({
  text: z.string().describe('按钮文本: 按钮上显示的文字').default('点击我'),
  link: z.string().optional().describe('跳转链接: 点击按钮后的跳转地址 (优先级高于点击提示)'),
  clickMessage: z.string().optional().describe('点击提示: 点击按钮时弹出的提示文字 (仅在无跳转链接时生效)'),
  variant: z.enum(['solid', 'outline', 'ghost', 'link']).optional().describe('样式变体: 样式变体 @labels({"solid":"实心", "outline":"描边", "ghost":"幽灵", "link":"链接"})').default('solid'),
  size: z.enum(['sm', 'base', 'lg']).optional().describe('尺寸: 按钮的大小 @labels({"sm":"小", "base":"中", "lg":"大"})').default('base'),
  color: z.string().optional().describe('颜色主题: 按钮的主题颜色 (Tailwind 类或 Hex)').default('bg-blue-600'),
  radius: z.enum(['none', 'sm', 'md', 'lg', 'full']).optional().describe('圆角: 按钮的圆角大小 @labels({"none":"无", "sm":"小", "md":"中", "lg":"大", "full":"全圆"})').default('md'),
  fullWidth: z.boolean().optional().describe('全宽: 是否占满容器宽度').default(false),
  showArrow: z.boolean().optional().describe('显示箭头: 是否在文字后显示箭头图标').default(false),
});
