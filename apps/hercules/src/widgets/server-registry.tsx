import React from 'react';
import { Text } from './Text';
import { Image } from './Image';
import { Video } from './Video';
import { Spacer } from './Spacer';
import { Feed } from './Feed';
import { AvatarGroup } from './AvatarGroup';
import { Divider } from './Divider';
import { FloorComponentProps } from '@/lib/engine/types';

// Server Registry - 用于可以作为 RSC 渲染的组件
// 我们直接导入它们，因为 RSC 不需要 'dynamic' 进行代码分割（服务器会处理）
// 但为了避免打包客户端代码，我们必须确保这些文件不导入大型客户端库
// 
// 为什么这里必须用 any？
// 因为这个注册表包含不同 Props 类型的组件（Text 用 TextProps，Image 用 ImageProps）。
// 在 TypeScript 中，没有一个单一的强类型（除了 any）能同时代表 "接受 TextProps 的组件" 和 "接受 ImageProps 的组件"。
// 当我们用字符串 key 动态访问这个对象时，TS 无法知道我们会取到哪一个，所以我们必须放宽类型限制。
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const ServerRegistry: Record<string, React.ComponentType<FloorComponentProps<any>>> = {
  Text,
  Image,
  Video,
  Spacer,
  Feed,
  AvatarGroup,
  Divider,
};
