'use client';

import React from 'react';

interface ClientClickTrackerProps {
  clickUrl: string;
  children: React.ReactNode;
}

export const ClientClickTracker = ({ clickUrl, children }: ClientClickTrackerProps) => {
  const handleClick = (e: React.MouseEvent) => {
    // Prevent default if it's not an anchor tag, or handle logic before navigation
    // Since we wrap with <a>, the browser will navigate automatically.
    // We just want to track it.
    console.log(`[Analytics] Click tracked for URL: ${clickUrl}`);
    
    // In a real app, you might send a beacon:
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

