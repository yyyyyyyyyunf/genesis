"use client";

import { useEffect } from 'react';
import { useEditorStore } from '@/lib/store';
import { PreviewFrame } from '@/components/PreviewFrame';
import { LayerTree } from '@/components/LayerTree';
import { PropertyInspector } from '@/components/PropertyInspector';
import { ChatPanel } from '@/components/ChatPanel';
import { usePageConfig, useSavePageConfig } from '@/query/page-config';

export default function Home() {
  const { loadConfig, currentConfig } = useEditorStore();
  const { data: pageConfig, isLoading } = usePageConfig();
  const { mutate: saveConfig, isPending: isSaving } = useSavePageConfig();

  // 简单的 "dirty" 检查：比较当前配置和加载时的配置的 JSON 字符串
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

  if (isLoading) {
    return <div className="flex h-screen w-full items-center justify-center">加载中...</div>;
  }

  return (
    <main className="flex h-screen w-full bg-gray-50 overflow-hidden">
      {/* 左侧面板：预览区域 (60%) */}
      <div className="w-[60%] h-full border-r border-gray-200">
         <PreviewFrame />
      </div>

      {/* 右侧面板：编辑器和 AI (40%) */}
      <div className="w-[40%] h-full flex flex-col">
        
        {/* 顶部标题栏 */}
        <div className="h-14 border-b border-gray-200 bg-white flex items-center justify-between px-4 flex-none">
           <h2 className="font-bold text-sm">页面编辑器</h2>
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
        <div className="flex-1 flex flex-col min-h-0">
            {/* 上半部分：结构树和属性检查器 */}
            <div className="h-[60%] flex border-b border-gray-200">
              {/* 图层树 (40%) */}
              <div className="w-[40%] border-r border-gray-200 h-full overflow-hidden">
                <LayerTree />
              </div>
              
              {/* 属性检查器 (60%) */}
              <div className="w-[60%] h-full overflow-hidden bg-white">
                <PropertyInspector />
              </div>
            </div>

            {/* 下半部分：AI 聊天 */}
            <div className="h-[40%] bg-white">
              <ChatPanel />
            </div>
        </div>

      </div>
    </main>
  );
}
