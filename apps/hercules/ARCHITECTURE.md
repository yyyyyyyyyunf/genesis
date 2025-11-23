# Hercules 渲染架构指南 (Architecture Guide)

本文档旨在解释 Hercules 项目的核心渲染架构，特别是关于 **Registry（组件注册表）** 的设计决策。

由于 Next.js App Router 引入了 **混合渲染架构 (Hybrid Rendering)**——即 Server Components (RSC) 和 Client Components 共存——我们需要一套稳健的机制来管理组件的动态加载和渲染。

---

## 核心设计理念

Hercules 是一个 **Server-Driven UI (SDUI)** 系统，页面的结构由后端 JSON 数据决定。为了实现这一目标，我们采用了以下架构模式：

### 1. 双注册表模式 (Dual Registry Pattern)

我们维护了两个独立的组件注册表，分别服务于不同的运行时环境。这是为了解决 **代码泄露 (Code Leakage)** 和 **构建错误**。

#### 🏛️ Server Registry (`widgets/server-registry.tsx`)
*   **运行时**: Node.js / Server Runtime
*   **用途**: **SSR (服务端渲染)**。在服务器端将 JSON 转换为初始 HTML。
*   **包含内容**: 
    *   **RSC (Async Components)**: 如 `Markdown`, `CodeBlock` (直接读取文件、处理繁重逻辑)。
    *   **Shared Components**: 如 `Text`, `Image` (通用 UI 组件)。
*   **引入方式**: **直接引入 (Static Import)**。因为服务器不需要拆包，我们需要最快的渲染速度。

#### 🌐 Client Registry (`widgets/client-registry.tsx`)
*   **运行时**: Browser / Client Runtime
*   **用途**: **Hydration (客户端激活)** & **Client Navigation**。在浏览器端接管页面，处理交互。
*   **包含内容**:
    *   **Shared Components**: `Text`, `Image` (在客户端再次渲染以匹配 HTML)。
    *   **Interactive Components**: `Tab`, `Carousel` (包含 `useState`, `onClick` 等)。
    *   **RSC Fallbacks**: `MarkdownClient` (RSC 的客户端替身，通常是简化版或骨架屏，防止客户端报错)。
*   **引入方式**: **动态引入 (Dynamic Import)**。使用 `dynamicClientFloor` 实现按需加载，减小首屏 Bundle 体积。

---

### 2. 依赖注入 (Dependency Injection)

你可能会发现 `ClientRecursiveRenderer` 并没有直接导入 `ClientRegistry`，而是使用了 `useRegistry()`。

```typescript
// ✅ 正确做法 (使用 Context)
const registry = useRegistry();
const Component = registry[type];

// ❌ 错误做法 (直接导入)
import { ClientRegistry } from '@/widgets/client-registry'; 
```

**为什么？为了解决循环依赖 (Circular Dependency)。**

在 SDUI 中，组件结构是递归的：
1.  **Renderer** 需要引入 **Registry** 来查找组件。
2.  **Registry** 中的组件 (如 `Tab`) 需要引入 **Renderer** 来渲染子楼层。

这构成了死循环：`Renderer -> Registry -> Component -> Renderer`。
在 JavaScript 中，这会导致 `undefined` 错误（`Cannot read properties of undefined`）。

**解决方案**:
我们在 `Providers` 层级通过 `RegistryContext` 将 `ClientRegistry` **注入** 到应用中。Renderer 只从 Context 读取注册表，从而切断了物理文件上的引用环。

---

## 开发指南：如何新增一个组件？

当你开发一个新的组件（例如 `NewWidget`）时，你需要遵循以下步骤：

### 1. 创建组件文件
在 `src/widgets/NewWidget/` 下创建 `index.tsx` (实现) 和 `schema.ts` (定义)。

### 2. 注册到 Server Registry
在 `src/widgets/server-registry.tsx` 中：
```typescript
import { NewWidget } from './NewWidget';

export const ServerRegistry = {
  // ...
  NewWidget, // 直接引入
};
```
> **目的**: 让服务器能 SSR 出它的 HTML。

### 3. 注册到 Client Registry
在 `src/widgets/client-registry.tsx` 中：
```typescript
import { dynamicClientFloor } from '@/lib/engine/utils';

export const ClientRegistry = {
  // ...
  NewWidget: dynamicClientFloor(() => import('./NewWidget').then(mod => mod.NewWidget)),
};
```
> **目的**: 让客户端能下载并激活它。
> *注意*: 即使是 RSC (如 `Markdown`)，也必须在这里注册一个 **Client Fallback** (如 `MarkdownClient`)，否则在编辑器预览或客户端路由切换时会报错。

### 4. 更新映射表
在 `src/widgets/component-map.ts` 中分配一个 ID。

---

## 常见问题 (FAQ)

**Q: 为什么我必须两边都注册？不能合并吗？**
A: 不能。
*   如果合并，`ServerRegistry` 里的 Async RSC 会污染客户端 Bundle，导致 Next.js 报错（浏览器无法执行 Async Component）。
*   如果拆分但不重复注册，比如 `Text` 只在 Server 注册，那么客户端渲染时遇到 `Text` 就会找不到组件，导致页面白屏或无法 Hydrate。

**Q: 我忘记在 ClientRegistry 注册会怎样？**
A: 页面首屏 (SSR) 看起来是正常的，但控制台会报 Hydration Mismatch 错误，或者在编辑器 (Zeus) 中预览该组件时显示 "未知组件"。

**Q: 为什么 ClientRegistry 全是 dynamic import？**
A: 性能优化。如果用户访问的页面只有 `Text` 和 `Image`，我们不希望他们下载 `Carousel` (包含 Swiper 库) 或 `CodeBlock` (包含 Shiki 库) 的代码。

