import { create } from 'zustand';
import { PageConfig } from './types';

interface PageStore {
  pageConfig: PageConfig;
  setPageConfig: (config: PageConfig) => void;
}

export const usePageStore = create<PageStore>((set) => ({
  pageConfig: [],
  setPageConfig: (config) => set({ pageConfig: config }),
}));

