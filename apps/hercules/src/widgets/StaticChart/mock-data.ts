import { z } from 'zod';
import { StaticChartSchema } from './schema';

type StaticChartProps = z.infer<typeof StaticChartSchema>;

export const StaticChartMockData: {
  minimal: StaticChartProps;
  complete: StaticChartProps;
} = {
  minimal: {
    type: 'bar',
    data: [10, 25, 15, 30, 45, 20]
  },
  complete: {
    title: '2024年销售业绩',
    type: 'line',
    data: [120, 250, 180, 320, 450, 280, 390, 510, 420, 560, 620, 700],
    labels: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
    color: '#3b82f6',
    height: 300
  }
};

