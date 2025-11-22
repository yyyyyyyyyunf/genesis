import { create } from 'zustand';
import { PageConfig } from '@genesis/hercules/types';

interface EditorState {
  currentConfig: PageConfig;
  draftConfig: PageConfig | null;
  selectedFloorId: string | null;
  
  // UI State
  isManualEditorOpen: boolean;
  isChatPanelOpen: boolean;

  setDraftConfig: (config: PageConfig | null) => void;
  commitDraft: () => void;
  rejectDraft: () => void;
  selectFloor: (id: string | null) => void;
  updateFloor: (floorId: string, data?: any, alias?: string) => void;
  
  // Floor Management
  addFloor: (type: number, index?: number) => void;
  removeFloor: (id: string) => void;

  // UI Actions
  toggleManualEditor: () => void;
  toggleChatPanel: () => void;
  
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
  isManualEditorOpen: true,
  isChatPanelOpen: true,

  setDraftConfig: (config) => set({ draftConfig: config }),

  commitDraft: () => {
    const { draftConfig } = get();
    if (draftConfig) {
      set({ currentConfig: draftConfig, draftConfig: null });
    }
  },

  rejectDraft: () => set({ draftConfig: null }),

  selectFloor: (id) => set({ selectedFloorId: id }),

  updateFloor: (floorId, data, alias) => {
    const { currentConfig, draftConfig } = get();
    const targetConfig = draftConfig || currentConfig;
    
    const newConfig = targetConfig.map(floor => {
      if (floor.id === floorId) {
        return {
          ...floor,
          ...(data ? { data: { ...floor.data, ...data } } : {}),
          ...(alias !== undefined ? { alias } : {}),
        };
      }
      return floor;
    });

    if (draftConfig) {
      set({ draftConfig: newConfig });
    } else {
      set({ currentConfig: newConfig });
    }
  },

  addFloor: (type, index) => {
    const { currentConfig } = get();
    const newFloor = {
      id: `floor_${type}_${Date.now()}`,
      type,
      data: {}, // 默认空数据，后续可能需要根据类型提供默认值
    };

    const newConfig = [...currentConfig];
    if (typeof index === 'number' && index >= 0 && index <= newConfig.length) {
      newConfig.splice(index, 0, newFloor);
    } else {
      newConfig.push(newFloor);
    }

    set({ currentConfig: newConfig, selectedFloorId: newFloor.id });
  },

  removeFloor: (id) => {
    const { currentConfig, draftConfig } = get();
    if (draftConfig) {
      set({ draftConfig: draftConfig.filter(f => f.id !== id) });
    } else {
      set({ currentConfig: currentConfig.filter(f => f.id !== id) });
    }
  },

  toggleManualEditor: () => set((state) => ({ isManualEditorOpen: !state.isManualEditorOpen })),
  toggleChatPanel: () => set((state) => ({ isChatPanelOpen: !state.isChatPanelOpen })),

  loadConfig: (config) => set({ currentConfig: config }),
}));
