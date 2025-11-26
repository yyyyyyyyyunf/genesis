import { z } from 'zod';
import { withMeta } from '@/lib/schema-utils';

export const AccordionSchema = z.object({
  items: withMeta(
    z.array(
      z.object({
        title: withMeta(z.string(), {
          label: '标题',
        }),
        content: withMeta(z.string(), {
          label: '内容',
        }),
      })
    ),
    {
      label: '折叠项列表',
    }
  ).default([{ title: 'FAQ 1', content: 'Answer to FAQ 1' }]),
  allowMultiple: withMeta(z.boolean(), {
    label: '允许多个展开',
  }).default(false),
});

