import { z } from 'zod';
import { CountdownSchema } from './schema';

type CountdownProps = z.infer<typeof CountdownSchema>;

// 生成一个未来的时间（24小时后）
const futureDate = new Date(Date.now() + 86400000).toISOString();
// 生成一个未来的时间（3天后）
const threeDaysLater = new Date(Date.now() + 3 * 86400000).toISOString();

export const CountdownMockData: {
  minimal: CountdownProps;
  complete: CountdownProps;
} = {
  minimal: {
    targetDate: futureDate,
    textColor: 'text-gray-900',
    backgroundColor: 'bg-white',
    endMessage: '活动已结束'
  },
  complete: {
    targetDate: threeDaysLater,
    textColor: 'text-white',
    backgroundColor: 'bg-gradient-to-r from-red-500 to-pink-500',
    endMessage: '限时抢购已结束，敬请期待下次活动！'
  }
};

