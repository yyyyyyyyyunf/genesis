import { PageConfig } from './types';
import { usePageStore } from './store';

interface SyncMessage {
  type: 'SYNC_CONFIG';
  payload: PageConfig;
}

export function initBridge() {
  if (typeof window === 'undefined') return;

  const handleMessage = (event: MessageEvent) => {
    const data = event.data as SyncMessage;
    
    if (data?.type === 'SYNC_CONFIG') {
      console.log('[Hercules] Received config update', data.payload);
      usePageStore.setState({ pageConfig: data.payload });
    }
  };

  window.addEventListener('message', handleMessage);

  // Notify parent that we are ready
  window.parent.postMessage({ type: 'HERCULES_READY' }, '*');

  return () => {
    window.removeEventListener('message', handleMessage);
  };
}

