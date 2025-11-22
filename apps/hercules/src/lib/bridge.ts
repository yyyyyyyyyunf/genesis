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
      console.log('[Hercules] 收到配置更新', data.payload);
      usePageStore.setState({ pageConfig: data.payload });
    }
  };

  window.addEventListener('message', handleMessage);

  // 通知父级我们已准备好
  window.parent.postMessage({ type: 'HERCULES_READY' }, '*');

  return () => {
    window.removeEventListener('message', handleMessage);
  };
}

