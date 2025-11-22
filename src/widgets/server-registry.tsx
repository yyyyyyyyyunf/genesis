import React from 'react';
import { Text } from './Text';
import { Image } from './Image';
import { FloorComponentProps } from '@/lib/engine/types';

// Server Registry - 用于可以作为 RSC 渲染的组件
// 我们直接导入它们，因为 RSC 不需要 'dynamic' 进行代码分割（服务器会处理）
// 但为了避免打包客户端代码，我们必须确保这些文件不导入大型客户端库
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const ServerRegistry: Record<string, React.ComponentType<FloorComponentProps<any>>> = {
  Text,
  Image,
};

