import { z } from 'zod';

export const AccordionSchema = z.object({
  items: z.array(z.object({
    title: z.string().describe('标题'),
    content: z.string().describe('内容'),
  })).describe('折叠项列表').default([{ title: 'FAQ 1', content: 'Answer to FAQ 1' }]),
  allowMultiple: z.boolean().describe('允许多个展开').default(false),
});

