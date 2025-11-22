# Zeus 编辑器 (Zeus Editor)

Zeus 是一个可视化的低代码营销页面编辑器。它允许运营人员通过拖放组件、编辑属性以及与 AI Agent 对话来构建页面。

## 功能特点

- **可视化预览**: 通过 Iframe 嵌入 Hercules 渲染引擎，确保所见即所得。
- **组件管理**: 
  - **图层树 (Layer Tree)**: 支持拖拽排序的楼层管理。
  - **属性检查器 (Property Inspector)**: 基于 Zod Schema 自动生成的表单，用于编辑组件属性。
- **AI 辅助**: 集成 AI Chat Panel，允许通过自然语言指令修改页面配置 (Mock)。
- **实时同步**: 编辑器的状态更改会实时同步到预览区域。

## 技术栈

- **框架**: Next.js 16 (App Router)
- **状态管理**: Zustand
- **拖拽库**: @dnd-kit
- **样式**: Tailwind CSS
- **通信**: `window.postMessage` (与 Hercules 通信)

## 快速开始

在项目根目录下运行以下命令启动开发服务器：

```bash
pnpm dev:all
```

该命令会同时启动：
- **Zeus (编辑器)**: http://localhost:3000
- **Hercules (渲染端)**: http://localhost:3001

## 架构概览

Zeus 作为宿主应用 (Host)，通过 Iframe 加载 Hercules 作为子应用 (Remote)。

1.  **状态源**: 页面配置数据 (`PageConfig`) 存储在 Zeus 的 Zustand Store 中。
2.  **通信桥接**: `src/lib/host-bridge.ts` 负责监听状态变化，并通过 `postMessage` 将最新的配置发送给 Hercules。
3.  **预览**: `src/components/PreviewFrame.tsx` 封装了 Iframe 和通信逻辑。

## 目录结构

- `src/app`: Next.js 页面路由。
- `src/components`: UI 组件。
  - `LayerTree`: 图层管理组件。
  - `PropertyInspector`: 属性编辑组件。
  - `ChatPanel`: AI 对话组件。
  - `PreviewFrame`: 预览容器。
- `src/lib`: 工具函数和状态管理。
  - `store.ts`: 全局状态定义。
  - `host-bridge.ts`: 跨应用通信逻辑。
