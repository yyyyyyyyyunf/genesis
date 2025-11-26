import { z } from 'zod';
import { withMeta } from '@/lib/schema-utils';

export const VideoSchema = z.object({
  src: withMeta(z.string(), {
    label: '视频链接',
    description: '视频文件的 URL 地址',
  }),
  poster: withMeta(z.string(), {
    label: '封面图',
    description: '视频未播放时显示的封面图片',
  }).optional(),
  autoplay: withMeta(z.boolean(), {
    label: '自动播放',
    description: '是否自动播放 (通常需要静音)',
  }).optional().default(false),
  controls: withMeta(z.boolean(), {
    label: '显示控制条',
    description: '是否显示播放控制条',
  }).optional().default(true),
  loop: withMeta(z.boolean(), {
    label: '循环播放',
    description: '是否循环播放',
  }).optional().default(false),
  muted: withMeta(z.boolean(), {
    label: '静音',
    description: '是否默认静音 (自动播放通常需要)',
  }).optional().default(false),
  aspectRatio: withMeta(z.enum(['16/9', '4/3', '1/1', 'auto']), {
    label: '宽高比',
    description: '视频容器的宽高比',
    labels: {
      '16/9': '宽屏',
      '4/3': '标准',
      '1/1': '方形',
      auto: '自适应',
    },
  }).optional().default('16/9'),
});

