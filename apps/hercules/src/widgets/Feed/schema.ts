import { z } from 'zod';
import { withMeta } from '@/lib/schema-utils';

export const FeedSchema = z.object({
  items: withMeta(
    z.array(
      z.object({
        title: withMeta(z.string(), {
          label: '标题',
          description: '内容的标题',
        }),
        summary: withMeta(z.string(), {
          label: '摘要',
          description: '内容的简短描述',
        }),
        image: withMeta(z.string(), {
          label: '封面图',
          description: '内容的封面图片 URL',
        }).optional(),
        date: withMeta(z.string(), {
          label: '日期',
          description: '发布日期 (例如 "2023-10-01")',
        }).optional(),
        tag: withMeta(z.string(), {
          label: '标签',
          description: '内容的分类标签 (例如 "新闻", "博客")',
        }).optional(),
        link: withMeta(z.string(), {
          label: '跳转链接',
          description: '点击内容后的跳转地址',
        }).optional(),
      })
    ),
    {
      label: '内容列表',
      description: '信息流中的内容项列表',
    }
  ),
  layout: withMeta(z.enum(['list', 'card']), {
    label: '布局模式',
    description: '展示方式，list (列表) 或 card (卡片)',
    labels: {
      list: '列表',
      card: '卡片',
    },
  }).default('list'),
  columns: withMeta(z.number().min(1).max(4), {
    label: '列数',
    description: '卡片布局下的列数 (仅在 layout="card" 时生效)',
  }).optional().default(2),
});

export type FeedProps = z.infer<typeof FeedSchema>;

