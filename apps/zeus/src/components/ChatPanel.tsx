"use client";

import React, { useState } from 'react';
import { useEditorStore } from '@/lib/store';
import { mockPageConfig } from '@genesis/hercules/mocks';

export function ChatPanel() {
  const [input, setInput] = useState('');
  const { setDraftConfig, commitDraft, rejectDraft, draftConfig } = useEditorStore();

  const handleSend = async () => {
    if (!input.trim()) return;
    
    // Mock Agent response: Randomly shuffle or change the config to demonstrate update
    console.log('Sending prompt to agent:', input);
    
    // Simulating network delay
    setTimeout(() => {
        // For demo purposes, we just load the default mock config as a "change"
        // In a real app, this would call an LLM API
        setDraftConfig([...mockPageConfig].reverse()); 
    }, 1000);
    
    setInput('');
  };

  return (
    <div className="flex flex-col h-full border-t border-gray-200">
      
      {/* Review Controls - Overlay or dedicated area */}
      {draftConfig && (
        <div className="bg-yellow-50 p-3 border-b border-yellow-200 flex items-center justify-between">
            <span className="text-sm text-yellow-800 font-medium">Agent proposed changes</span>
            <div className="space-x-2">
                <button 
                    onClick={commitDraft}
                    className="px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700"
                >
                    Accept
                </button>
                <button 
                    onClick={rejectDraft}
                    className="px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700"
                >
                    Reject
                </button>
            </div>
        </div>
      )}

      <div className="flex-1 p-4 overflow-y-auto">
        <div className="text-center text-gray-400 text-sm mt-4">
            Ask the agent to modify the page...
        </div>
        {/* Chat messages would go here */}
      </div>

      <div className="p-4 border-t border-gray-200 bg-white">
        <div className="flex gap-2">
          <input 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="e.g., 'Make the banner larger'"
            className="flex-1 p-2 border rounded text-sm"
          />
          <button 
            onClick={handleSend}
            className="px-4 py-2 bg-black text-white rounded text-sm font-medium"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

