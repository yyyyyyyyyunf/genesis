import { z } from 'zod';
import { SpacerSchema } from './schema';

type SpacerProps = z.infer<typeof SpacerSchema>;

export const SpacerMockData: {
  minimal: SpacerProps;
  complete: SpacerProps;
} = {
  minimal: {
    height: 20
  },
  complete: {
    height: 40,
    backgroundColor: 'bg-gray-100'
  }
};

