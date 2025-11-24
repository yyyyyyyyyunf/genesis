import { z } from 'zod';
import { ButtonSchema } from './schema';

type ButtonProps = z.infer<typeof ButtonSchema>;

export const ButtonMockData: {
  minimal: ButtonProps;
  complete: ButtonProps;
} = {
  minimal: {
    text: '立即购买'
  },
  complete: {
    text: '立即购买',
    link: 'https://example.com/products',
    variant: 'solid',
    size: 'lg',
    color: 'bg-blue-600',
    radius: 'md',
    fullWidth: false,
    showArrow: true
  }
};

