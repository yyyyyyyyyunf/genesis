"use client";

import { useEffect, useRef } from 'react';
import { useEditorStore } from '@/lib/store';
import { HostBridge } from '@/lib/host-bridge';
import { HERCULES_URL } from '@/config';

export function PreviewFrame() {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const { currentConfig, draftConfig } = useEditorStore();
  const bridgeRef = useRef<HostBridge | null>(null);

  useEffect(() => {
    bridgeRef.current = new HostBridge(iframeRef);
  }, []);

  // Sync config when it changes
  useEffect(() => {
    const configToSync = draftConfig || currentConfig;
    if (configToSync && bridgeRef.current) {
      bridgeRef.current.sendConfig(configToSync);
    }
  }, [currentConfig, draftConfig]);

  return (
    <div className="w-full h-full bg-gray-100 flex items-center justify-center overflow-hidden">
      <iframe
        ref={iframeRef}
        src={HERCULES_URL}
        className="w-full h-full border-none bg-white shadow-lg"
        style={{ maxWidth: '100%', maxHeight: '100%' }}
        title="Hercules Preview"
      />
    </div>
  );
}

