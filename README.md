# Hercules: Next.js 低代码 Agent 平台

一个现代化的生成式 UI 混合渲染架构，专为 Agent 友好性和高性能而设计。

## 架构亮点

本项目采用了 **混合渲染策略 (Hybrid Rendering Strategy)**，充分利用 React Server Components (RSC) 来最小化客户端 Bundle 体积。

### 1. 引擎 (Engine) vs 组件 (Widgets)
我们将 "引擎" (核心逻辑) 与 "组件" (业务组件) 严格分离。
- **`src/lib/engine`**: 包含递归渲染逻辑、类型定义和注册表辅助函数。它对具体的业务逻辑一无所知。
- **`src/widgets`**: 包含实际的 UI 组件 (Text, Image, Tab 等) 作为一等公民。

### 2. 双注册系统 (Dual Registry System)
我们将组件注册表分为两部分，以强制分离关注点：

- **`widgets/server-registry.tsx`**: 包含无状态的 RSC (Text, Image)。这些组件在服务器上渲染为静态 HTML。除了交互包装器外，不会向客户端发送任何 JS。
- **`widgets/client-registry.tsx`**: 包含交互式 Client Components (Tab, Shelf)。这些组件在客户端进行水合 (Hydrate)。

### 3. 递归渲染引擎 (Recursive Rendering Engine)
- **`ServerRecursiveRenderer`**: 根入口点 (RSC)。
- **`ClientRecursiveRenderer`**: 用于交互式容器 (如 Tab) 内部，在浏览器中动态渲染嵌套子组件。

### 4. 状态管理 (Context)
- **业务上下文**: 位于 `src/context/` (例如 `LocaleContext`)。
- **Providers**: 集中在 `src/providers/index.tsx` 中，避免弄乱 `page.tsx`。
- **RSC 消费**: Server Components 不能直接消费 Context。使用 **客户端包装器模式 (Client Wrapper Pattern)** (如 `Text` 内部的 `LocaleBadge`) 将依赖 Context 的 UI 注入到静态 Server Components 中。

### 5. 代码即 Agent 管道 (Code-to-Agent Pipeline)
我们将 **代码视为唯一的真理来源 (Single Source of Truth)**。
- 运行 `pnpm run gen:docs` 扫描 Zod Schemas。
- 它会生成 `knowledge/agent-manual.md`，这是一份完美的文档文件，可直接喂给 LLM Agents (Dify/GPT)。

## 使用方法

### 开发环境
```bash
pnpm dev
```

### 生成 Agent 文档
```bash
pnpm run gen:docs
```

## 目录结构
```
src/
  app/                    # Next.js App Router
  lib/
    engine/               # 核心低代码引擎
      renderer/
        ServerRecursiveRenderer.tsx
        ClientRecursiveRenderer.tsx
        ServerFloorItem.tsx
      types.ts
      utils.tsx
  widgets/                # 业务组件 (顶层)
    Image/
    Text/
    Tab/
    Shelf/
    server-registry.tsx
    client-registry.tsx
    full-registry.ts
  context/                # 全局上下文 (语言, 主题)
  providers/              # 应用层 Providers
knowledge/                # AI 知识库 (自动生成)
  agent-manual.md
scripts/
  generate-agent-docs.ts  # 知识库生成器
```
