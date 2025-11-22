import { ClientRegistry } from './client-registry';
import { ServerRegistry } from './server-registry';

// 客户端渲染的合并注册表
// 当在客户端渲染时（例如在 Tab 内部），我们需要访问所有组件
export const FullRegistry = { ...ServerRegistry, ...ClientRegistry };

