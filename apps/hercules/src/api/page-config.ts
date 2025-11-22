import { PageConfig } from '@/lib/types';
import { PAGE_CONFIG_API_URL } from '@/config';

export const fetchPageConfig = async (): Promise<PageConfig> => {
  const res = await fetch(PAGE_CONFIG_API_URL, { 
    cache: 'no-store',
    // Next.js fetch 选项
    next: { tags: ['page-config'] } 
  });
  if (!res.ok) {
    console.error('获取页面配置失败', res.status, res.statusText);
    return [];
  }
  return res.json();
};

