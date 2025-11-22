import { PageConfig } from '@genesis/hercules/types';
import { PAGE_CONFIG_API_URL } from '../config';

export const fetchPageConfig = async (): Promise<PageConfig> => {
  const res = await fetch(PAGE_CONFIG_API_URL);
  if (!res.ok) {
    throw new Error('获取页面配置失败');
  }
  return res.json();
};

export const savePageConfig = async (config: PageConfig): Promise<void> => {
  const res = await fetch(PAGE_CONFIG_API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(config),
  });
  if (!res.ok) {
    throw new Error('保存页面配置失败');
  }
};

