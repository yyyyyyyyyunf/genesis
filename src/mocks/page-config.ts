// Mock Page Configuration (DSL)
// This is what the database or Agent would return.
export const mockPageConfig = [
  {
    id: 'floor_1',
    type: 'Text',
    data: {
      content: '双十一全球好物节',
      align: 'center',
      size: '2xl',
      color: 'text-red-600 font-bold'
    }
  },
  {
    id: 'floor_banner',
    type: 'Image',
    data: {
      src: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800&auto=format&fit=crop&q=60',
      alt: 'Sale Banner',
      aspectRatio: '16/9',
      objectFit: 'cover',
      clickUrl: 'https://www.google.com' // Testing the Client Wrapper
    }
  },
  {
    id: 'floor_2',
    type: 'Text',
    data: {
      content: '精选全球各地必买清单，限时特惠',
      align: 'center',
      size: 'base',
      color: 'text-gray-500'
    }
  },
  {
    id: 'floor_3',
    type: 'Tab',
    data: {
      defaultActiveKey: 'korea',
      items: [
        {
          label: '韩国',
          key: 'korea',
          children: [
            {
              id: 'floor_kr_header',
              type: 'Text',
              data: { content: '韩国美妆专场', align: 'left', size: 'xl' }
            },
            {
              id: 'floor_kr_shelf',
              type: 'Shelf',
              data: {
                layout: 'grid',
                products: [
                  { id: 'p1', name: 'Sulwhasoo Set', price: '¥899', imageUrl: '' },
                  { id: 'p2', name: 'Laneige Mask', price: '¥199', imageUrl: '' },
                  { id: 'p3', name: 'Innisfree Cream', price: '¥120', imageUrl: '' },
                  { id: 'p4', name: 'Etude House', price: '¥89', imageUrl: '' },
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
              type: 'Text',
              data: { content: '国潮崛起', align: 'center', size: 'xl', color: 'text-red-800' }
            },
             {
              id: 'floor_cn_shelf',
              type: 'Shelf',
              data: {
                layout: 'scroll',
                products: [
                  { id: 'c1', name: 'Florasis Lipstick', price: '¥219', imageUrl: '' },
                  { id: 'c2', name: 'Perfect Diary', price: '¥109', imageUrl: '' },
                  { id: 'c3', name: 'Colorkey', price: '¥69', imageUrl: '' },
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
              id: 'floor_jp_text',
              type: 'Text',
              data: { content: '敬请期待...', align: 'center', color: 'text-gray-400' }
            }
          ]
        }
      ]
    }
  }
];

