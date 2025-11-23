import React from 'react';
import { Text } from './Text';
import { Image } from './Image';
import { Video } from './Video';
import { Spacer } from './Spacer';
import { Feed } from './Feed';
import { AvatarGroup } from './AvatarGroup';
import { Divider } from './Divider';
import { Markdown } from './Markdown';
import { CodeBlock } from './CodeBlock';
import { StaticChart } from './StaticChart';
import { FloorComponentProps } from '@/lib/engine/types';

// Server Registry - 用于可以作为 RSC 渲染的组件
// 包含所有组件的 Server 版本（RSC + Shared Components）
// 
// 为什么这里必须用 any？
// 因为这个注册表包含不同 Props 类型的组件。
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const ServerRegistry: Record<string, React.ComponentType<FloorComponentProps<any>>> = {
  Text,
  Image,
  Video,
  Spacer,
  Feed,
  AvatarGroup,
  Divider,
  Markdown,
  CodeBlock,
  StaticChart,
};
