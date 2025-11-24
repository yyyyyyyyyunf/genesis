import { z } from 'zod';
import { BottomNavigationSchema } from './schema';

type BottomNavigationProps = z.infer<typeof BottomNavigationSchema>;

export const BottomNavigationMockData: {
  minimal: BottomNavigationProps;
  complete: BottomNavigationProps;
} = {
  minimal: {
    items: [
      {
        label: '首页',
        icon: 'Home',
        link: '/'
      },
      {
        label: '分类',
        icon: 'Grid',
        link: '/categories'
      },
      {
        label: '我的',
        icon: 'User',
        link: '/profile'
      }
    ],
    activeColor: 'text-blue-600',
    backgroundColor: 'bg-white'
  },
  complete: {
    items: [
      {
        label: '首页',
        icon: 'Home',
        activeIcon: 'Home',
        link: '/'
      },
      {
        label: '分类',
        icon: 'Grid',
        activeIcon: 'Grid',
        link: '/categories'
      },
      {
        label: '购物车',
        icon: 'ShoppingCart',
        activeIcon: 'ShoppingCart',
        link: '/cart'
      },
      {
        label: '消息',
        icon: 'Bell',
        activeIcon: 'Bell',
        link: '/notifications'
      },
      {
        label: '我的',
        icon: 'User',
        activeIcon: 'User',
        link: '/profile'
      }
    ],
    activeColor: 'text-blue-600',
    backgroundColor: 'bg-white'
  }
};

