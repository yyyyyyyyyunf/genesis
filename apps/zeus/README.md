# Zeus (可视化编辑器)

Zeus 是 Genesis 平台的所见即所得 (WYSIWYG) 编辑器，专为运营人员和 AI Agent 设计。

## 核心能力

1.  **可视化编排**: 支持拖拽组件、调整顺序、实时预览。
2.  **动态属性面板**: 基于 Hercules 定义的 Zod Schema，自动生成对应的编辑表单（AutoForm）。这意味着新增组件时，无需修改编辑器代码，表单会自动适配。
3.  **AI 辅助生成**: (Coming Soon) 集成大模型能力，支持通过自然语言对话生成和修改页面配置。

## 工作原理

### 1. 渲染通信
Zeus 通过 `iframe` 嵌入 Hercules 渲染端。二者通过 `postMessage` 进行双向通信：
- **Zeus -> Hercules**: 发送最新的页面配置 JSON。
- **Hercules -> Zeus**: 发送组件选中、点击等交互事件。

### 2. Schema 共享
Zeus 直接引用 Hercules 的组件 Schema 定义。这确保了编辑器生成的配置数据与渲染端所需的格式 **100% 一致**，从源头杜绝了配置错误。

## 目录结构

```bash
src/
├── components/
│   ├── FloorTree/         # 楼层树状图 (拖拽排序)
│   ├── PropertyInspector/ # 属性检查器 (AutoForm 表单生成)
│   ├── PreviewFrame.tsx   # 渲染端 Iframe 容器
│   └── ChatPanel.tsx      # AI 对话面板
├── lib/
│   ├── store.ts           # 编辑器状态管理 (Zustand)
│   └── host-bridge.ts     # Iframe 通信桥接
```
