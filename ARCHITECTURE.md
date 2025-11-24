# Genesis 架构白皮书

Genesis 通过 **SDUI + RSC + AI Agent** 融合，构建下一代前端平台。

## 核心设计理念

### 四大支柱

1. **健壮性 (Robustness)**: Zod Schema 强校验 + 双注册表模式 + 优雅降级
2. **可维护性 (Maintainability)**: 标准化组件结构 + 依赖注入 + 混合架构
3. **AI 友好性 (AI-Ready)**: Schema 即 Prompt + 声明式 JSON + 闭环反馈
4. **编辑器引擎 (Editor Engine)**: Schema-Driven AutoForm（零样板代码）

## 子系统架构

详细实现请参阅各子系统文档：

- **[Hercules (渲染引擎)](./apps/hercules/ARCHITECTURE.md)**: 双注册表模式、混合渲染、Validator
- **[Zeus (可视化编辑器)](./apps/zeus/ARCHITECTURE.md)**: AutoForm 引擎、Host Bridge、状态管理
- **[Jarvis (后端服务)](./apps/jarvis/README.md)**: API 接口、数据存储

## 核心概念

- **[Schema 元数据规范](./SCHEMA_GUIDE.md)**: @labels、@unit、@default 注解详解
- **[组件开发流程](./apps/hercules/COMPONENT_GUIDE.md)**: 如何创建新组件
- **[部署指南](./DEPLOYMENT.md)**: Vercel 部署流程
- **[常见问题](./FAQ.md)**: 开发和调试问题

## 核心优势速览

### 健壮性
- **Zod Schema**: 运行时拦截非法数据，防止 AI 幻觉导致的错误配置
- **双注册表**: 物理隔离 RSC 和 Client Components，避免 Bundle 污染
- **优雅降级**: Error Boundary 确保单个组件错误不影响整体页面

### 可维护性
- **标准化结构**: 每个组件仅需 `index.tsx` + `schema.ts`，即插即用
- **依赖注入**: RegistryContext 解耦渲染引擎与业务组件
- **混合架构**: 根据场景灵活选择 RSC 或 Client Component

### AI 友好性
- **Schema 即 Prompt**: 将 Zod Schema 自动转换为 `agent-manual.md`，确保 AI 理解与代码逻辑 100% 同步
- **声明式 JSON**: LLM 最擅长的数据格式，极高的生成准确率
- **闭环反馈**: `validator.ts` 生成 AI 可读的中文错误报告，支持自我修正

### 编辑器引擎
- **零样板代码**: 定义 Zod Schema 即可自动生成属性编辑面板
- **语义元数据**: `@labels`、`@unit` 等注解提供本地化 UI
- **人机协同**: AI 生成 JSON → AutoForm 回显 → 人工微调 → AI 继续迭代
