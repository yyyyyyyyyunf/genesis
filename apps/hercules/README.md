# Hercules (渲染引擎)

Hercules 是 Genesis 平台的渲染核心，负责将后端下发的 JSON 配置 (DSL) 转化为高性能的 React 页面。

## 核心职责

1. **SSR 服务端渲染**: 利用 Next.js 和 RSC 技术，确保极佳的 SEO 和加载速度。
2. **实时预览服务**: 为 Zeus 编辑器提供实时渲染能力。
3. **AI 校验网关**: 内置智能校验器，拦截并修正 AI 生成的错误配置。

## 快速开始

```bash
pnpm --filter hercules dev
```

访问 http://localhost:3001

## 详细文档

- **[架构设计](./ARCHITECTURE.md)**: 双注册表模式、混合渲染、Validator
- **[组件开发指南](./COMPONENT_GUIDE.md)**: 如何创建新组件
- **[Schema 元数据规范](../../SCHEMA_GUIDE.md)**: @labels、@unit、@default 注解

## 目录结构

```bash
src/
├── widgets/           # 组件库
├── lib/engine/        # 渲染引擎核心
└── app/               # Next.js 路由
```
