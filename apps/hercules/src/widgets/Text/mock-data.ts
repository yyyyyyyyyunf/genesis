import { z } from 'zod';
import { TextSchema } from './schema';

type TextProps = z.infer<typeof TextSchema>;

export const TextMockData: {
  minimal: TextProps;
  complete: TextProps;
} = {
  minimal: {
    content: '这是一段示例文本',
    align: 'left',
    size: 'base',
    color: 'text-black',
    mode: 'simple'
  },
  complete: {
    content: '欢迎来到我们的电商平台，这里有最优质的商品和服务',
    align: 'center',
    size: 'xl',
    color: 'text-gray-800',
    mode: 'simple'
  }
};

