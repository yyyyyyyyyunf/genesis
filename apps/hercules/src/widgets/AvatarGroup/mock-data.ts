import { z } from 'zod';
import { AvatarGroupSchema } from './schema';

type AvatarGroupProps = z.infer<typeof AvatarGroupSchema>;

export const AvatarGroupMockData: {
  minimal: AvatarGroupProps;
  complete: AvatarGroupProps;
} = {
  minimal: {
    images: [
      'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
      'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka',
      'https://api.dicebear.com/7.x/avataaars/svg?seed=Bob'
    ],
    size: 'md',
    max: 5
  },
  complete: {
    images: [
      'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
      'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka',
      'https://api.dicebear.com/7.x/avataaars/svg?seed=Bob',
      'https://api.dicebear.com/7.x/avataaars/svg?seed=Alice',
      'https://api.dicebear.com/7.x/avataaars/svg?seed=David',
      'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma',
      'https://api.dicebear.com/7.x/avataaars/svg?seed=Frank'
    ],
    size: 'lg',
    max: 5
  }
};

