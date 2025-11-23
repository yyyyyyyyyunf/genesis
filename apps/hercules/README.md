# Hercules (渲染引擎)

Hercules 是 Genesis 平台的渲染核心，负责将后端下发的 JSON 配置 (DSL) 转化为高性能的 React 页面。

## 核心职责

1.  **SSR 服务端渲染**: 利用 Next.js App Router 和 React Server Components (RSC) 技术，直接在服务端生成首屏 HTML，确保极佳的 SEO 和加载速度。
2.  **实时预览服务**: 为 Zeus 编辑器提供实时渲染能力，支持通过 `postMessage` 接收配置变更并即时更新视图。
3.  **AI 校验网关**: 内置智能校验器，拦截并修正 AI 生成的错误配置。

## 架构亮点

### 1. 双注册表模式 (Dual Registry)

为了平衡 RSC 的高性能与 Client Component 的交互性，我们将组件注册表分为两部分：

-   **ServerRegistry**: 包含 RSC 组件（如 Markdown、CodeBlock），在服务端执行重逻辑（文件读取、语法高亮），输出纯 HTML。
-   **ClientRegistry**: 包含交互组件（如 Carousel、Tab）和 RSC 的客户端回退（Fallback），通过 `next/dynamic` 动态加载，减小 Bundle 体积。

### 2. Zod Schema 驱动

每个组件都必须定义严格的 `schema.ts`。这不仅用于运行时校验，还用于生成 AI 操作手册 (`agent-manual.md`) 和编辑器表单。

### 3. AI 反馈闭环

内置 `validator.ts` 工具，能够将配置错误转化为 AI 可读的中文报告（例如：`字段 'color' 无效: 期望字符串...`），从而支持 AI Agent 的自我修正流程。

## 目录结构

```bash
src/
├── widgets/           # 组件库 (每个组件包含 index.tsx 和 schema.ts)
├── lib/
│   ├── engine/        # 渲染引擎核心
│   │   ├── renderer/  # 递归渲染器 (Client/Server)
│   │   └── validator.ts # AI 配置校验器
├── context/           # 依赖注入上下文
└── app/               # Next.js 路由
```
