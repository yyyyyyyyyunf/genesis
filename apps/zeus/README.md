# Zeus (可视化编辑器)

Zeus 是 Genesis 平台的所见即所得 (WYSIWYG) 编辑器，专为运营人员和 AI Agent 设计。

## 核心能力

1. **可视化编排**: 拖拽组件、调整顺序、实时预览。
2. **动态属性面板**: 基于 Schema 自动生成编辑表单（AutoForm）。
3. **AI 辅助生成**: 通过自然语言对话生成和修改页面配置。

## 快速开始

```bash
pnpm --filter zeus dev
```

访问 http://localhost:3000

## 详细文档

- **[架构设计](./ARCHITECTURE.md)**: AutoForm 引擎、Host Bridge、状态管理
- **[Hercules 渲染引擎](../hercules/README.md)**: 了解渲染端工作原理
- **[Schema 元数据规范](../../SCHEMA_GUIDE.md)**: 了解元数据注解的使用

## 目录结构

```bash
src/
├── components/
│   ├── FloorTree/         # 楼层树（拖拽）
│   ├── PropertyInspector/ # 属性面板（AutoForm）
│   └── ChatPanel.tsx      # AI 对话面板
└── lib/
    ├── store.ts           # 状态管理
    └── host-bridge.ts     # Iframe 通信
```
