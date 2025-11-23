import { z } from 'zod';

export const VideoSchema = z.object({
  src: z.string().describe('视频链接: 视频文件的 URL 地址'),
  poster: z.string().optional().describe('封面图: 视频未播放时显示的封面图片'),
  autoplay: z.boolean().optional().describe('自动播放: 是否自动播放 (通常需要静音)').default(false),
  controls: z.boolean().optional().describe('显示控制条: 是否显示播放控制条').default(true),
  loop: z.boolean().optional().describe('循环播放: 是否循环播放').default(false),
  muted: z.boolean().optional().describe('静音: 是否默认静音 (自动播放通常需要)').default(false),
  aspectRatio: z.enum(['16/9', '4/3', '1/1', 'auto']).optional().describe('宽高比: 视频容器的宽高比').default('16/9'),
});

