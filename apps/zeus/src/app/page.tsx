"use client";

import { useState, useEffect } from 'react';
import { useEditorStore } from '@/lib/store';
import { PreviewFrame } from '@/components/PreviewFrame';
import { LayerTree } from '@/components/LayerTree';
import { PropertyInspector } from '@/components/PropertyInspector';
import { ChatPanel } from '@/components/ChatPanel';
import { ComponentToolbar } from '@/components/ComponentToolbar';
import { usePageConfig, useSavePageConfig } from '@/query/page-config';
import { DndContext, DragEndEvent, DragOverlay, useSensor, useSensors, PointerSensor, Active } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { Layout, MessageSquare } from 'lucide-react';
import { ComponentItem } from '@/components/ComponentToolbar';

export default function Home() {
  const { 
    loadConfig, 
    currentConfig, 
    addFloor,
    isManualEditorOpen, 
    isChatPanelOpen,
    toggleManualEditor,
    toggleChatPanel 
  } = useEditorStore();
  
  const { data: pageConfig, isLoading } = usePageConfig();
  const { mutate: saveConfig, isPending: isSaving } = useSavePageConfig();
  
  const [activeDragItem, setActiveDragItem] = useState<Active | null>(null);

  // 简单的 "dirty" 检查
  const isDirty = pageConfig && JSON.stringify(currentConfig) !== JSON.stringify(pageConfig);
  
  useEffect(() => {
    if (pageConfig) {
      loadConfig(pageConfig);
    }
  }, [pageConfig, loadConfig]);

  const handleSave = () => {
    saveConfig(currentConfig, {
      onSuccess: () => {
         alert('保存成功');
      },
      onError: (error) => {
         console.error('保存出错:', error);
         alert('保存失败');
      }
    });
  };

  // Dnd Sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  );

  const handleDragStart = (event: any) => {
    setActiveDragItem(event.active);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveDragItem(null);
    const { active, over } = event;

    if (!over) return;

    // 1. 处理从组件栏拖拽添加
    if (active.data.current?.type === 'new_component') {
      const type = active.data.current.componentType;
      // 如果拖拽到了 LayerTree 区域或者具体的 Item 上
      addFloor(type); 
      return;
    }

    // 2. 处理 LayerTree 内部排序
    if (active.id !== over.id) {
      // 重新实现排序逻辑，因为现在 DndContext 在这里
      const oldIndex = currentConfig.findIndex((item) => item.id === active.id);
      const newIndex = currentConfig.findIndex((item) => item.id === over.id);
      
      if (oldIndex !== -1 && newIndex !== -1) {
        const newOrder = arrayMove(currentConfig, oldIndex, newIndex);
        loadConfig(newOrder);
      }
    }
  };

  if (isLoading) {
    return <div className="flex h-screen w-full items-center justify-center">加载中...</div>;
  }

  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <main className="flex h-screen w-full bg-gray-50 overflow-hidden relative">
        {/* 1. 最左侧：组件工具栏 */}
        <ComponentToolbar />

        {/* 2. 中间：预览区域 (flex-1) */}
        <div className="flex-1 h-full border-r border-gray-200 min-w-0 bg-gray-100 flex flex-col">
           <div className="flex-none h-14 border-b border-gray-200 bg-white flex items-center justify-between px-4">
              <span className="font-bold text-sm text-gray-500">预览区</span>
           </div>
           <div className="flex-1 overflow-hidden relative">
             {/* Iframe 遮罩，防止拖拽时被 iframe 捕获事件 */}
             {activeDragItem && <div className="absolute inset-0 z-50 bg-transparent" />}
             <PreviewFrame />
           </div>
        </div>

        {/* 3. 右侧面板：编辑器和 AI */}
        <div className="w-[800px] h-full flex flex-col flex-none border-l border-gray-200 bg-white transition-all duration-300 ease-in-out">
          
          {/* 顶部标题栏 & 工具栏 */}
          <div className="h-14 border-b border-gray-200 bg-white flex items-center justify-between px-4 flex-none">
             <div className="flex items-center gap-2">
               <h2 className="font-bold text-sm">页面编辑器</h2>
               <div className="h-4 w-[1px] bg-gray-300 mx-2"></div>
               <button 
                 onClick={toggleManualEditor}
                 className={`p-1.5 rounded hover:bg-gray-100 ${isManualEditorOpen ? 'text-blue-600 bg-blue-50' : 'text-gray-400'}`}
                 title="手动编辑"
               >
                 <Layout size={16} />
               </button>
               <button 
                 onClick={toggleChatPanel}
                 className={`p-1.5 rounded hover:bg-gray-100 ${isChatPanelOpen ? 'text-blue-600 bg-blue-50' : 'text-gray-400'}`}
                 title="AI 对话"
               >
                 <MessageSquare size={16} />
               </button>
             </div>
             <button 
               onClick={handleSave}
               disabled={isSaving || !isDirty}
               className={`px-4 py-1.5 text-sm rounded transition-colors ${
                  isSaving || !isDirty 
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                    : 'bg-blue-600 text-white hover:bg-blue-700'
               }`}
             >
               {isSaving ? '保存中...' : '保存'}
             </button>
          </div>

          {/* 内容区域 */}
          <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
              
              {/* 上半部分：手动编辑区 */}
              {isManualEditorOpen && (
                <div className={`flex border-b border-gray-200 transition-all duration-300 ${isChatPanelOpen ? 'h-[60%]' : 'h-full'}`}>
                  {/* 图层树 (40%) */}
                  <div className="w-[40%] border-r border-gray-200 h-full overflow-hidden bg-gray-50">
                    <LayerTree />
                  </div>
                  
                  {/* 属性检查器 (60%) */}
                  <div className="w-[60%] h-full overflow-hidden bg-white">
                    <PropertyInspector />
                  </div>
                </div>
              )}

              {/* 下半部分：AI 聊天 */}
              {isChatPanelOpen && (
                <div className={`bg-white transition-all duration-300 ${isManualEditorOpen ? 'h-[40%]' : 'h-full'}`}>
                  <ChatPanel />
                </div>
              )}
          </div>

        </div>
      </main>
      <DragOverlay>
        {activeDragItem?.data.current?.type === 'new_component' && (
          <ComponentItem 
            label={activeDragItem.data.current.label}
            componentName={activeDragItem.data.current.componentName}
            className="opacity-80 shadow-xl border-blue-500 border-2"
            style={{ width: '80px', height: '80px' }} // Optional: force size or style for overlay
          />
        )}
      </DragOverlay>
    </DndContext>
  );
}
