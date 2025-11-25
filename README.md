# Genesis Platform

Genesis 是一个现代化的低代码营销页面搭建平台。采用 Monorepo 架构，包含可视化编辑器、高性能渲染引擎和后端服务。

## 📚 文档导航

### 快速上手
- **[用户使用指南 (USER_GUIDE.md)](./USER_GUIDE.md)** - 从零开始构建你的第一个页面
- **[环境配置说明 (ENVIRONMENT.md)](./ENVIRONMENT.md)** - 本地开发和生产环境配置

### 架构与设计
- **[架构白皮书 (ARCHITECTURE.md)](./ARCHITECTURE.md)** - 了解 Genesis 的核心设计理念
- **[Zeus 编辑器架构 (apps/zeus/ARCHITECTURE.md)](./apps/zeus/ARCHITECTURE.md)** - AutoForm、Host Bridge 等核心引擎
- **[Hercules 渲染架构 (apps/hercules/ARCHITECTURE.md)](./apps/hercules/ARCHITECTURE.md)** - 双注册表、混合渲染、Validator

### 开发指南
- **[组件开发指南 (apps/hercules/COMPONENT_GUIDE.md)](./apps/hercules/COMPONENT_GUIDE.md)** - 如何创建新组件
- **[Schema 元数据规范 (SCHEMA_GUIDE.md)](./SCHEMA_GUIDE.md)** - @labels、@unit、@default 注解详解
- **[嵌套组件开发](./apps/hercules/COMPONENT_GUIDE.md#5-嵌套组件开发指南)** - 容器组件（Tab、Accordion）的特殊处理

### AI 与自动化
- **[AI Agent 集成规划 (AI_INTEGRATION.md)](./AI_INTEGRATION.md)** - Dify 集成和 agent-manual.md 使用
- **[AI 质量评估体系 (AI_EVAL.md)](./AI_EVAL.md)** - Eval 系统和 Self-Correction 机制
- **[AI 操作手册 (knowledge/agent-manual.md)](./knowledge/agent-manual.md)** - 自动生成的组件文档（供 AI 使用）

### 部署与运维
- **[部署指南 (DEPLOYMENT.md)](./DEPLOYMENT.md)** - Vercel 部署流程和环境配置
- **[常见问题 (FAQ.md)](./FAQ.md)** - 开发、调试和性能优化

### 子应用文档
- **[Zeus 编辑器 (apps/zeus/README.md)](./apps/zeus/README.md)** - 编辑器功能和使用说明
- **[Hercules 渲染引擎 (apps/hercules/README.md)](./apps/hercules/README.md)** - 渲染引擎职责和特性
- **[Jarvis 后端服务 (apps/jarvis/README.md)](./apps/jarvis/README.md)** - API 接口和数据存储

## 核心优势

Genesis 架构通过将 **SDUI (Server-Driven UI)**、**React Server Components (RSC)** 与 **AI Agent** 深度融合，构建了下一代前端平台：

- **健壮性 (Robustness)**: 基于 Zod Schema 的全链路强校验，彻底杜绝非法配置导致的页面崩溃。
- **AI 友好性 (AI-Ready)**: 代码即文档 (Schema as Prompt)，自动生成 AI 操作手册；内置反馈闭环，让 AI 具备自我修正能力。
- **研发效能 (Efficiency)**: "Schema 驱动一切"，一套类型定义同时生成校验逻辑、AI Prompt 和编辑器 UI (AutoForm)，新增组件零样板代码。
- **高性能 (Performance)**: 创新的双注册表模式 (Dual Registry)，实现 RSC 服务端直出与客户端轻量交互的完美平衡。

👉 *详细架构设计请参阅 [架构白皮书](./ARCHITECTURE.md)*

## 👥 适合谁使用

### 运营人员
通过 Zeus 可视化编辑器，无需编码即可快速搭建营销页面。AI 助手可以根据自然语言需求生成页面配置。

### 前端开发者
扩展组件库、定制 Schema、优化渲染性能。享受 TypeScript 类型安全和 React Server Components 的性能优势。

### 架构师
学习 Server-Driven UI、Schema-Driven UI 和 AI-Ready 架构的最佳实践。

### AI 研究者
探索 LLM 与结构化 UI 的深度集成，研究 Schema 作为 Prompt 的可行性。

## 项目结构

本项目使用 pnpm workspace 管理，主要包含以下应用：

- **apps/zeus**: 可视化编辑器 (Editor)。运营人员在此通过拖拽、配置和 AI 对话来构建页面，生成页面配置（DSL）。 ([📘 架构文档](./apps/zeus/ARCHITECTURE.md))
- **apps/hercules**: 渲染引擎 (Renderer)。负责将页面配置 (DSL) 渲染为最终的网页，同时提供给编辑器进行实时预览。 ([📘 架构文档](./apps/hercules/ARCHITECTURE.md))
- **apps/jarvis**: 后端服务 (Backend)。提供 API 接口、数据存储和 AI 代理能力。

## 环境要求

- Node.js >= 20
- pnpm >= 9

## 快速开始

### 1. 安装依赖

在根目录下运行：

```bash
pnpm install
```

### 2. 启动开发环境

我们提供了一个便捷的命令来同时启动编辑器和渲染端：

```bash
pnpm dev:all
```

启动成功后，您可以访问：

- **Zeus (编辑器)**: http://localhost:3000
- **Hercules (渲染端)**: http://localhost:3001
- **Jarvis (后端服务)**: http://localhost:3002

> 注意：编辑器 (Zeus) 依赖渲染端 (Hercules) 进行页面预览，同时依赖后端 (Jarvis) 存取数据，请确保所有服务都已成功启动。

## 其他命令

- `pnpm gen:docs`: 生成组件库文档（输出至 `knowledge/agent-manual.md`）
- `pnpm build`: 构建整个 Monorepo
- `pnpm lint`: 运行 ESLint 代码检查
- `pnpm type-check`: TypeScript 类型检查

💡 **提示**: 修改组件 Schema 后，记得运行 `pnpm gen:docs` 更新 AI 操作手册。

## 目录说明

```
/
├── apps/
│   ├── hercules/       # 渲染端应用 (Next.js)
│   ├── jarvis/         # 后端服务 (Hono)
│   └── zeus/           # 编辑端应用 (Next.js)
├── knowledge/          # 项目文档和知识库
├── package.json        # 根项目配置
└── pnpm-workspace.yaml # Workspace 配置
```
