"use client";

import React, { useState } from 'react';
import { useEditorStore } from '@/lib/store';
import { mockPageConfig } from '@genesis/hercules/mocks';

export function ChatPanel() {
  const [input, setInput] = useState('');
  const { setDraftConfig, commitDraft, rejectDraft, draftConfig } = useEditorStore();

  const handleSend = async () => {
    if (!input.trim()) return;
    
    // 模拟 Agent 响应：随机打乱或更改配置以演示更新
    console.log('发送指令给 Agent:', input);
    
    // 模拟网络延迟
    setTimeout(() => {
        // 为了演示目的，我们只是加载默认的模拟配置作为"更改"
        // 在实际应用中，这将调用 LLM API
        setDraftConfig([...mockPageConfig].reverse()); 
    }, 1000);
    
    setInput('');
  };

  return (
    <div className="flex flex-col h-full border-t border-gray-200">
      
      {/* 审查控制 - 覆盖层或专用区域 */}
      {draftConfig && (
        <div className="bg-yellow-50 p-3 border-b border-yellow-200 flex items-center justify-between">
            <span className="text-sm text-yellow-800 font-medium">Agent 提议的更改</span>
            <div className="space-x-2">
                <button 
                    onClick={commitDraft}
                    className="px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700"
                >
                    接受
                </button>
                <button 
                    onClick={rejectDraft}
                    className="px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700"
                >
                    拒绝
                </button>
            </div>
        </div>
      )}

          <div className="flex-1 p-4 overflow-y-auto">
        <div className="text-center text-gray-400 text-sm mt-4">
            请让 Agent 修改页面...
        </div>
        {/* 聊天消息将显示在这里 */}
      </div>

      <div className="p-4 border-t border-gray-200 bg-white">
        <div className="flex gap-2">
          <input 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !!input.trim() && handleSend()}
            placeholder="例如：'把 Banner 变大一点'"
            className="flex-1 p-2 border rounded text-sm"
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim()}
            className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
                !input.trim() 
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                    : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            发送
          </button>
        </div>
      </div>
    </div>
  );
}

