import { ClientRegistry } from './client-registry';
import { ServerRegistry } from './server-registry';

// Combined Registry for Client-Side Rendering
// When rendering on the client (e.g. inside a Tab), we need access to ALL components
export const FullRegistry = { ...ServerRegistry, ...ClientRegistry };

