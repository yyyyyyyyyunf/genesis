import { z } from 'zod';

export const FeedSchema = z.object({
  items: z.array(
    z.object({
      title: z.string().describe('标题: 内容的标题'),
      summary: z.string().describe('摘要: 内容的简短描述'),
      image: z.string().optional().describe('封面图: 内容的封面图片 URL'),
      date: z.string().optional().describe('日期: 发布日期 (例如 "2023-10-01")'),
      tag: z.string().optional().describe('标签: 内容的分类标签 (例如 "新闻", "博客")'),
      link: z.string().optional().describe('跳转链接: 点击内容后的跳转地址'),
    })
  ).describe('内容列表: 信息流中的内容项列表'),
  layout: z.enum(['list', 'card']).describe('布局模式: 展示方式，list (列表) 或 card (卡片) @labels({"list":"列表", "card":"卡片"})').default('list'),
  columns: z.number().min(1).max(4).optional().describe('列数: 卡片布局下的列数 (仅在 layout="card" 时生效)').default(2),
});

export type FeedProps = z.infer<typeof FeedSchema>;

