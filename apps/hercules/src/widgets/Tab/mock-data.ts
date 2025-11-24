import { z } from 'zod';
import { TabSchema } from './schema';

type TabProps = z.infer<typeof TabSchema>;

export const TabMockData: {
  minimal: TabProps;
  complete: TabProps;
} = {
  minimal: {
    items: [
      {
        label: '推荐',
        key: 'recommend',
        children: []
      },
      {
        label: '新品',
        key: 'new',
        children: []
      }
    ]
  },
  complete: {
    items: [
      {
        label: '热门商品',
        key: 'hot',
        children: [
          {
            id: 'floor_text_001',
            type: 1,
            data: {
              content: '这是热门商品分类',
              align: 'center'
            }
          }
        ]
      },
      {
        label: '新品上架',
        key: 'new',
        children: [
          {
            id: 'floor_text_002',
            type: 1,
            data: {
              content: '这是新品分类',
              align: 'center'
            }
          }
        ]
      },
      {
        label: '特价促销',
        key: 'sale',
        children: []
      }
    ],
    defaultActiveKey: 'hot'
  }
};

