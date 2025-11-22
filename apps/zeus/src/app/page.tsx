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
    // Load initial mock data
    loadConfig(mockPageConfig);
  }, [loadConfig]);

  return (
    <main className="flex h-screen w-full bg-gray-50 overflow-hidden">
      {/* Left Panel: Preview (60%) */}
      <div className="w-[60%] h-full border-r border-gray-200">
         <PreviewFrame />
      </div>

      {/* Right Panel: Editor & AI (40%) */}
      <div className="w-[40%] h-full flex flex-col">
        
        {/* Top Half: Structure & Inspector */}
        <div className="h-[60%] flex border-b border-gray-200">
          {/* Layer Tree (40%) */}
          <div className="w-[40%] border-r border-gray-200 h-full overflow-hidden">
            <LayerTree />
          </div>
          
          {/* Property Inspector (60%) */}
          <div className="w-[60%] h-full overflow-hidden bg-white">
            <PropertyInspector />
          </div>
        </div>

        {/* Bottom Half: AI Chat */}
        <div className="h-[40%] bg-white">
          <ChatPanel />
        </div>

      </div>
    </main>
  );
}
