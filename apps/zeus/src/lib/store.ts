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
  
  // Initial load
  loadConfig: (config: PageConfig) => void;
}

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

