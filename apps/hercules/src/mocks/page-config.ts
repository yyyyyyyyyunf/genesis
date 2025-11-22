import { COMPONENT_NAMES } from '../widgets/component-map';

// 模拟页面配置数据 (DSL)
// 这是数据库或 Agent 返回的结构。
// 现在使用数字 ID (COMPONENT_NAMES) 而不是字符串名称
export const mockPageConfig = [
  {
    id: 'floor_1',
    type: COMPONENT_NAMES.Text,
    alias: '主标题',
    data: {
      content: '双十一全球好物节',
      align: 'center',
      size: '2xl',
      color: 'text-red-600 font-bold'
    }
  },
  {
    id: 'floor_banner',
    type: COMPONENT_NAMES.Image,
    alias: '活动Banner',
    data: {
      src: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800&auto=format&fit=crop&q=60',
      alt: 'Sale Banner',
      aspectRatio: '16/9',
      objectFit: 'cover',
      clickUrl: 'https://www.google.com' // 测试 Client Wrapper 交互功能
    }
  },
  {
    id: 'floor_2',
    type: COMPONENT_NAMES.Text,
    alias: '副标题',
    data: {
      content: '精选全球各地必买清单，限时特惠',
      align: 'center',
      size: 'base',
      color: 'text-gray-500'
    }
  },
  {
    id: 'floor_3',
    type: COMPONENT_NAMES.Tab,
    alias: '国家馆Tab',
    data: {
      defaultActiveKey: 'korea',
      items: [
        {
          label: '韩国',
          key: 'korea',
          children: [
            {
              id: 'floor_kr_header',
              type: COMPONENT_NAMES.Text,
              data: { content: '韩国美妆专场', align: 'left', size: 'xl' }
            },
            {
              id: 'floor_kr_shelf',
              type: COMPONENT_NAMES.Shelf,
              data: {
                layout: 'grid',
                products: [
                  { id: 'p1', name: 'Sulwhasoo Set', price: '¥899', imageUrl: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=300&q=80' },
                  { id: 'p2', name: 'Laneige Mask', price: '¥199', imageUrl: 'https://images.unsplash.com/photo-1608248597279-f99d160bfbc8?w=300&q=80' },
                  { id: 'p3', name: 'Innisfree Cream', price: '¥120', imageUrl: 'https://images.unsplash.com/photo-1556228552-e3a708957b92?w=300&q=80' },
                  { id: 'p4', name: 'Etude House', price: '¥89', imageUrl: 'https://images.unsplash.com/photo-1571781535014-53bd13016e8e?w=300&q=80' },
                ]
              }
            }
          ]
        },
        {
          label: '中国',
          key: 'china',
          children: [
            {
              id: 'floor_cn_header',
              type: COMPONENT_NAMES.Text,
              data: { content: '国潮崛起', align: 'center', size: 'xl', color: 'text-red-800' }
            },
             {
              id: 'floor_cn_shelf',
              type: COMPONENT_NAMES.Shelf,
              data: {
                layout: 'scroll',
                products: [
                  { id: 'c1', name: 'Florasis Lipstick', price: '¥219', imageUrl: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=300&q=80' },
                  { id: 'c2', name: 'Perfect Diary', price: '¥109', imageUrl: 'https://images.unsplash.com/photo-1596462502278-27bfdd403348?w=300&q=80' },
                  { id: 'c3', name: 'Colorkey', price: '¥69', imageUrl: 'https://images.unsplash.com/photo-1625093742435-6fa192b6fb10?w=300&q=80' },
                ]
              }
            }
          ]
        },
        {
          label: '日本',
          key: 'japan',
          children: [
            {
              id: 'floor_jp_header',
              type: COMPONENT_NAMES.Text,
              data: { content: '日系清爽', align: 'center', color: 'text-blue-400', size: 'lg' }
            },
            {
              id: 'floor_jp_banner',
              type: COMPONENT_NAMES.Image,
              data: {
                  src: 'https://images.unsplash.com/photo-1528164344705-47542687000d?w=800&auto=format&fit=crop&q=60',
                  alt: 'Japan Vibe',
                  aspectRatio: '4/3',
                  objectFit: 'cover'
              }
            },
            {
              id: 'floor_jp_text',
              type: COMPONENT_NAMES.Text,
              data: { content: '更多商品敬请期待...', align: 'center', color: 'text-gray-400' }
            }
          ]
        }
      ]
    }
  }
];
