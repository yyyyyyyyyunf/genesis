import { z } from 'zod';
import { FloatButtonSchema } from './schema';

type FloatButtonProps = z.infer<typeof FloatButtonSchema>;

export const FloatButtonMockData: {
  minimal: FloatButtonProps;
  complete: FloatButtonProps;
} = {
  minimal: {
    icon: 'ArrowUp',
    action: 'backToTop'
  },
  complete: {
    icon: 'MessageCircle',
    action: 'link',
    link: 'https://example.com/contact',
    position: 'bottom-right',
    bottomOffset: 100,
    color: 'bg-green-600 text-white'
  }
};

