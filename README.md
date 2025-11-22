# Genesis Platform

Genesis 是一个现代化的低代码营销页面搭建平台。采用 Monorepo 架构，包含可视化编辑器和高性能渲染引擎。

## 项目结构

本项目使用 pnpm workspace 管理，主要包含以下应用：

- **apps/zeus**: 可视化编辑器 (Editor)。运营人员在此通过拖拽、配置和 AI 对话来构建页面。
- **apps/hercules**: 渲染引擎 (Renderer)。负责将页面配置 (DSL) 渲染为最终的网页，同时提供给编辑器进行实时预览。
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

- `pnpm gen:docs`: 生成组件库文档 (输出至 `knowledge/agent-manual.md`)。
- `pnpm build`: 构建整个 Monorepo。

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
