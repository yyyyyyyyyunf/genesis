'use client';

import React from 'react';

interface ClientClickTrackerProps {
  clickUrl: string;
  children: React.ReactNode;
}

export const ClientClickTracker = ({ clickUrl, children }: ClientClickTrackerProps) => {
  const handleClick = (e: React.MouseEvent) => {
    // 如果不是 anchor 标签，阻止默认行为，或者在导航前处理逻辑
    // 由于我们用 <a> 包装，浏览器会自动导航。
    // 我们只想在这里进行埋点。
    console.log(`[Analytics] Click tracked for URL: ${clickUrl}`);
    
    // 在真实应用中，你可能会发送 beacon:
    // navigator.sendBeacon('/api/track', JSON.stringify({ url: clickUrl }));
  };

  return (
    <a 
      href={clickUrl} 
      onClick={handleClick}
      target="_blank" 
      rel="noopener noreferrer"
      className="block w-full cursor-pointer"
    >
      {children}
    </a>
  );
};

