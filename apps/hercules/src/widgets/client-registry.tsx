import React from 'react';
import { FloorComponentProps } from '@/lib/engine/types';
import { dynamicClientFloor } from '@/lib/engine/utils';

export const ClientRegistry: Record<string, React.ComponentType<FloorComponentProps>> = {
  // --- Basic Components (Dynamic) ---
  Text: dynamicClientFloor(() => import('./Text').then(mod => mod.Text)),
  Image: dynamicClientFloor(() => import('./Image').then(mod => mod.Image)),
  Video: dynamicClientFloor(() => import('./Video').then(mod => mod.Video)),
  Spacer: dynamicClientFloor(() => import('./Spacer').then(mod => mod.Spacer)),
  Feed: dynamicClientFloor(() => import('./Feed').then(mod => mod.Feed)),
  AvatarGroup: dynamicClientFloor(() => import('./AvatarGroup').then(mod => mod.AvatarGroup)),
  Divider: dynamicClientFloor(() => import('./Divider').then(mod => mod.Divider)),
  StaticChart: dynamicClientFloor(() => import('./StaticChart').then(mod => mod.StaticChart)),

  // --- Interactive / Heavy Components (Dynamic) ---
  // Tab 本质上是交互式的 (useState)
  Tab: dynamicClientFloor(() => import('./Tab').then(mod => mod.Tab)),
  
  // Shelf 未来可能有无限滚动或加入购物车功能
  Shelf: dynamicClientFloor(() => import('./Shelf').then(mod => mod.Shelf)),

  // Carousel 使用 Swiper (Hooks)
  Carousel: dynamicClientFloor(() => import('./Carousel').then(mod => mod.Carousel)),

  // Button 为了支持 onClick 交互
  Button: dynamicClientFloor(() => import('./Button').then(mod => mod.Button)),

  Accordion: dynamicClientFloor(() => import('./Accordion').then(mod => mod.Accordion)),

  Form: dynamicClientFloor(() => import('./Form').then(mod => mod.Form)),

  Countdown: dynamicClientFloor(() => import('./Countdown').then(mod => mod.Countdown)),

  // --- RSC Fallbacks (Client Versions) ---
  Markdown: dynamicClientFloor(() => import('./Markdown/client').then(mod => mod.MarkdownClient)),
  CodeBlock: dynamicClientFloor(() => import('./CodeBlock/client').then(mod => mod.CodeBlockClient)),
};
