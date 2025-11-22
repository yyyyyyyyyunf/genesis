import React from 'react';
import { Text } from './Text';
import { Image } from './Image';
import { FloorComponentProps } from '../engine/types';

// Server Registry - For components that can be rendered as RSC
// We import them directly because RSCs don't need 'dynamic' for code splitting (the server handles it)
// But to avoid bundling client code, we must ensure these files don't import large client libs
export const ServerRegistry: Record<string, React.ComponentType<FloorComponentProps>> = {
  Text,
  Image,
};

