import { z } from 'zod';

export const AvatarGroupSchema = z.object({
  images: z.array(z.url()).describe('头像链接列表').default([
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Bob'
  ]),
  size: z.enum(['sm', 'md', 'lg']).describe('尺寸 @labels({"sm":"小", "md":"中", "lg":"大"})').default('md'),
  max: z.number().min(1).describe('最大显示数量').default(5),
});

