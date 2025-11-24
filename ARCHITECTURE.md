# Genesis 架构白皮书

Genesis 不仅仅是一个前端组件库，它是一套专为 **Server-Driven UI (SDUI)** 和 **AI Agent** 设计的现代化渲染架构。本架构旨在解决传统前端开发中面临的灵活性不足、AI 生成代码不可控以及客户端性能瓶颈等问题。

## 核心优势

### 1. 健壮性 (Robustness)

我们的系统通过多层防御机制，确保了即使在输入数据不可靠（如 AI 幻觉生成错误配置）的情况下，应用依然稳定运行。

*   **Zod Schema 强校验 (Input Guard)**
    *   这是系统的第一道防线。每个组件都定义了严格的 Schema（如 `src/widgets/*/schema.ts`）。
    *   无论数据来自 CMS 后台还是 AI 生成，Zod 都会在运行时拦截非法数据。如果数据类型不匹配（例如期望数字却收到了字符串），Zod 会立即报错，防止非法 Props 传递给组件导致页面白屏。
*   **双注册表模式 (Dual Registry Pattern)**
    *   我们将组件注册表物理隔离为 **ServerRegistry** (RSC) 和 **ClientRegistry** (Client Components)。
    *   这确保了服务端的重逻辑（如 Markdown 解析、Shiki 代码高亮、文件读取）永远不会泄露到客户端 Bundle 中，极大地降低了客户端崩溃的风险，同时显著提升了首屏加载性能。
*   **优雅降级 (Graceful Degradation)**
    *   渲染引擎 (`RecursiveRenderer`) 内置了错误边界 (Error Boundary) 和 Try-Catch 机制。
    *   如果某个组件因配置错误而崩溃，系统只会渲染一个红色的错误提示框，而不会导致整个页面挂掉，最大程度保证了用户体验。

### 2. 可维护性 (Maintainability)

架构设计遵循“高内聚、低耦合”原则，使得长期维护和多人协作变得轻松。

*   **标准化的组件结构**
    *   每个组件都是一个独立的原子模块：`index.tsx` (逻辑实现) + `schema.ts` (接口定义)。
    *   开发者只需关注这两个文件，无需关心复杂的路由配置或全局状态管理。这种“即插即用”的模式极大地降低了新人的上手成本。
*   **依赖注入 (Dependency Injection)**
    *   通过 `RegistryContext` 将组件注册表注入到渲染树中，彻底解耦了渲染引擎和具体业务组件。
    *   这意味着你可以随时替换、升级或扩展组件库，而无需修改核心渲染引擎的一行代码，同时也完美解决了循环依赖问题。
*   **务实的混合架构**
    *   我们不盲目追求纯粹的 RSC。对于强交互组件（如 `FloatButton`, `BottomNavigation`），我们允许使用标准的 Client Component 模式。这种灵活的策略保证了开发体验和代码可读性始终处于最佳状态。

### 3. AI 友好性 (AI-Ready)

这是本架构最具前瞻性的设计。我们实际上是在构建一种 **"AI 能读懂、能生成、能自我修正的 UI 语言"**。

*   **Schema 即 Prompt (Single Source of Truth)**
    *   我们在 Zod Schema 中通过 `.describe('中文描述')` 编写的注释，不仅是给人类看的，更是给 AI 看的。
    *   系统通过脚本自动将这些 Schema 转换为 `agent-manual.md`。这份文档是 AI 的“操作手册”，确保了 AI 理解的规则与代码实际运行的逻辑 **100% 同步**。
*   **声明式 JSON 配置**
    *   页面结构本质上是一个扁平的 JSON 数组。这是 LLM 最擅长生成的格式。
    *   因为我们的 Schema 定义精确且语义化，AI 生成页面的准确率极高。AI 不需要理解复杂的 CSS 或 HTML 结构，只需理解“这里放个 Hero 组件”、“那里放个图表”即可。
*   **闭环反馈 (Feedback Loop)**
    *   架构支持将运行时错误反馈给 AI。当 AI 生成了错误的 JSON 配置被 Zod 拦截时，系统可以将具体的错误信息（如 `data.color 格式不正确`）返回给 AI。
    *   这使得 AI 能够进行“自我修正”，从而实现真正意义上的智能自动化配置。
    *   **基础设施支持**: 我们在 `src/lib/engine/validator.ts` 中内置了专用的校验工具 `validateFloorConfig`，它能生成 AI 可读的中文错误报告（例如：`字段 'action' 无效: 期望 'backToTop'，实际收到 'jump'`），直接作为 Prompt 反馈给 Agent。

### 4. 编辑器引擎：Schema-Driven AutoForm

Zeus 编辑器的核心引擎 `AutoForm` 是本架构灵活性的集大成者。它将“写编辑器 UI”这个繁琐的命令式编程工作，转化为了“定义数据结构”的声明式工作。

*   **开发效率倍增**: 每当我们想增加一个新组件，只需要在 Hercules 中定义一次 Zod Schema。Zeus 编辑器会自动根据 Schema 生成对应的属性编辑面板。无需任何额外的 React 表单代码。
*   **增强的语义元数据**:
    *   通过解析 Schema 描述中的元数据（如 `@labels`, `@unit`, `@default`），AutoForm 能够渲染出更加友好、本地化的交互界面（如中文下拉选项、带单位的输入框）。
*   **完美的人机协同**:
    *   `AutoForm` 证明了我们的架构是完全基于结构化数据的。
    *   AI 生成的 JSON 可以直接被 AutoForm 渲染回显；人类在 AutoForm 里的修改也能生成符合 Schema 的 JSON。
    *   这为 **"AI 初稿 -> 人工微调"** 的高效工作流提供了坚实的技术基础。

---

## 子系统架构详解 (Sub-system Architecture)

为了更深入地了解各个子系统的具体实现细节，请查阅以下专门文档：

*   **Hercules (渲染引擎)**: [Hercules Architecture Guide](./apps/hercules/ARCHITECTURE.md)
    *   包含：双注册表模式 (Dual Registry Pattern)、混合渲染策略、Validator 基础设施细节。
*   **Zeus (可视化编辑器)**: [Zeus Architecture Guide](./apps/zeus/ARCHITECTURE.md)
    *   包含：AutoForm 引擎内部原理、Host Bridge 通信协议、编辑器状态管理模式。

---

## 总结

Genesis 架构通过将 **TypeScript 类型安全**、**React Server Components 性能优势** 与 **AI Agent 的生成能力** 深度融合，构建了一个既适合人类工程师维护，又适合 AI 智能操作的下一代前端平台。
