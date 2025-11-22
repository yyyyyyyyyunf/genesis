import { z } from 'zod';

// We define a minimal structure for children here to avoid circular dependencies
// In a real app, we might use z.lazy() to reference the full Floor schema
const FloorStub = z.object({
  id: z.string(),
  type: z.string(),
  data: z.any(),
});

export const TabSchema = z.object({
  items: z.array(
    z.object({
      label: z.string().describe('Tab label (e.g. Korea, China)'),
      key: z.string().describe('Unique key for the tab'),
      children: z.array(FloorStub).default([]).describe('List of components to render inside this tab'),
    })
  ).describe('List of tab items'),
  defaultActiveKey: z.string().optional().describe('Key of the initially active tab'),
});

export type TabProps = z.infer<typeof TabSchema>;

