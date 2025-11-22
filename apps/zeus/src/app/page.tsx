"use client";

import { useEffect } from 'react';
import { useEditorStore } from '@/lib/store';
import { mockPageConfig } from '@genesis/hercules/mocks';
import { PreviewFrame } from '@/components/PreviewFrame';
import { LayerTree } from '@/components/LayerTree';
import { PropertyInspector } from '@/components/PropertyInspector';
import { ChatPanel } from '@/components/ChatPanel';

export default function Home() {
  const { loadConfig } = useEditorStore();

  useEffect(() => {
    // 加载初始模拟数据
    loadConfig(mockPageConfig);
  }, [loadConfig]);

  return (
    <main className="flex h-screen w-full bg-gray-50 overflow-hidden">
      {/* 左侧面板：预览区域 (60%) */}
      <div className="w-[60%] h-full border-r border-gray-200">
         <PreviewFrame />
      </div>

      {/* 右侧面板：编辑器和 AI (40%) */}
      <div className="w-[40%] h-full flex flex-col">
        
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
    </main>
  );
}
