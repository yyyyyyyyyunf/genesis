import { PageConfig } from '@genesis/hercules/types';
import { RefObject } from 'react';

export class HostBridge {
  private iframeRef: RefObject<HTMLIFrameElement | null>;

  constructor(iframeRef: RefObject<HTMLIFrameElement | null>) {
    this.iframeRef = iframeRef;
  }

  sendConfig(config: PageConfig) {
    if (this.iframeRef.current?.contentWindow) {
      this.iframeRef.current.contentWindow.postMessage(
        { type: 'SYNC_CONFIG', payload: config },
        '*'
      );
    }
  }
}

