# Zeus (可视化编辑器)

Zeus 是 Genesis 平台的所见即所得 (WYSIWYG) 编辑器，专为运营人员和 AI Agent 设计。

## 核心能力

1.  **可视化编排**: 支持拖拽组件、调整顺序、实时预览。
2.  **动态属性面板**: 基于 Hercules 定义的 Zod Schema，自动生成对应的编辑表单（AutoForm）。这意味着新增组件时，无需修改编辑器代码，表单会自动适配。
3.  **AI 辅助生成**: (Coming Soon) 集成大模型能力，支持通过自然语言对话生成和修改页面配置。

## 核心特性：Schema 驱动的自动表单 (Schema-Driven AutoForm)

Zeus 采用了极其先进的 **Schema-Driven UI** 设计理念，彻底颠覆了传统编辑器的开发模式。

### 1. 零样板代码 (Zero Boilerplate)
在传统的后台开发中，每当你新增一个组件（例如 `FloatButton`），你需要编写两份代码：一份是组件本身的渲染逻辑，另一份是编辑器里的一堆表单控件（输入框、开关、下拉选框等）。

在 Genesis 架构中，你 **只需要** 做一件事：**定义 Zod Schema**。

Zeus 的 `AutoForm` 引擎会读取这个 Schema，并动态生成对应的编辑界面。
- 定义了 `z.string()` -> 自动渲染 Input 输入框
- 定义了 `z.boolean()` -> 自动渲染 Switch 开关
- 定义了 `z.enum(['a', 'b'])` -> 自动渲染 Select 下拉框

### 2. 支持复杂嵌套
AutoForm 不仅仅处理简单的平铺属性，它支持任意深度的递归结构：
- **对象 (Objects)**: 自动生成分组的嵌套面板。
- **数组 (Arrays)**: 自动生成可增删改查的列表 UI（如轮播图配置）。

### 3. 单一事实来源 (Single Source of Truth)
Schema 同时服务于 **运行时校验** 和 **编辑器 UI**。这确保了只要 Schema 变了，编辑器 UI 就会自动更新，永远不会出现“代码改了但编辑器没跟上”的 Bug。

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
