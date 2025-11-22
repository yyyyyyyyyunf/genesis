import { create } from 'zustand';
import { PageConfig } from '@genesis/hercules/types';

interface EditorState {
  currentConfig: PageConfig;
  draftConfig: PageConfig | null;
  selectedFloorId: string | null;
  
  setDraftConfig: (config: PageConfig | null) => void;
  commitDraft: () => void;
  rejectDraft: () => void;
  selectFloor: (id: string | null) => void;
  updateFloor: (floorId: string, data: any) => void;
  
  // 初始加载
  loadConfig: (config: PageConfig) => void;
}

// 简单的对象合并工具
// 注意：这会用 data 中的属性覆盖 target 中的属性，如果是对象则递归合并
// 但这里为了简化 AutoForm 的行为（AutoForm 传回的是该字段的完整新值），
// 我们应该假定 data 是部分更新，但对于复杂的嵌套结构，AutoForm 已经处理了完整性。
// 实际上，最安全的方式是浅层合并 data 到 floor.data，这正是目前所做的。
// 但对于 Tab 的 items 数组，AutoForm 会传回整个 items 数组，所以浅层合并是没问题的：
// floor.data = { ...floor.data, items: newItemsArray }
// 这里的 data 是 { items: [...] }
// 所以 { ...floor.data, ...data } 结果是 items 被完全替换，这正是我们要的。

export const useEditorStore = create<EditorState>((set, get) => ({
  currentConfig: [],
  draftConfig: null,
  selectedFloorId: null,

  setDraftConfig: (config) => set({ draftConfig: config }),

  commitDraft: () => {
    const { draftConfig } = get();
    if (draftConfig) {
      set({ currentConfig: draftConfig, draftConfig: null });
    }
  },

  rejectDraft: () => set({ draftConfig: null }),

  selectFloor: (id) => set({ selectedFloorId: id }),

  updateFloor: (floorId, data) => {
    const { currentConfig, draftConfig } = get();
    const targetConfig = draftConfig || currentConfig;
    
    const newConfig = targetConfig.map(floor => 
      floor.id === floorId ? { ...floor, data: { ...floor.data, ...data } } : floor
    );

    if (draftConfig) {
      set({ draftConfig: newConfig });
    } else {
      set({ currentConfig: newConfig });
    }
  },

  loadConfig: (config) => set({ currentConfig: config }),
}));
