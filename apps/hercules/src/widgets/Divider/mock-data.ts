import { z } from 'zod';
import { DividerSchema } from './schema';

type DividerProps = z.infer<typeof DividerSchema>;

export const DividerMockData: {
  minimal: DividerProps;
  complete: DividerProps;
} = {
  minimal: {
    style: 'solid',
    color: 'border-gray-200',
    thickness: 1,
    margin: 20
  },
  complete: {
    style: 'dashed',
    color: 'border-gray-300',
    thickness: 2,
    margin: 40
  }
};

