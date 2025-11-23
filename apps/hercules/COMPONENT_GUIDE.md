# Hercules 组件开发指南

欢迎加入 Hercules 开发！本指南将帮助你快速上手，了解如何为营销页面系统添加新的 UI 组件。

Hercules 使用 Next.js 构建，采用了一种基于配置驱动（Server-Driven UI）的架构。AI Agent 或运营后台生成的 JSON 配置决定了页面渲染哪些组件。

## 核心概念

在开发组件前，请理解以下核心文件和目录的作用：

*   **`src/widgets/`**: 所有组件的源代码目录。
*   **`src/widgets/<ComponentName>/schema.ts`**: 定义组件的数据结构（Zod Schema），**这对 AI Agent 至关重要**。
*   **`src/widgets/component-map.ts`**: 定义组件的 ID (Type ID) 和名称映射。
*   **`src/widgets/schemas.ts`**: 导出所有组件的 Schema。
*   **`src/widgets/server-registry.tsx`**: 注册服务端渲染组件 (RSC)。
*   **`src/widgets/client-registry.tsx`**: 注册客户端交互组件 (Client Components)。

---

## 开发流程

添加一个新组件通常需要以下 5 个步骤：

### 1. 创建组件文件

在 `src/widgets/` 下创建一个以组件名命名的目录（例如 `MyNewComponent`），包含两个文件：
*   `index.tsx`: 组件的 React 实现。
*   `schema.ts`: 组件的 Zod Schema 定义。

### 2. 定义 Schema (`schema.ts`)

这是最关键的一步。我们需要使用 `zod` 定义组件接收的数据结构。
**请务必使用中文描述 (`.describe()`)**，因为这些描述会被提取生成 Agent 手册，指导 AI 正确生成配置。

```typescript
import { z } from 'zod';

export const MyNewComponentSchema = z.object({
  title: z.string().describe('标题: 组件的标题文本').default('新组件'),
  description: z.string().optional().describe('描述: 组件的描述信息'),
  theme: z.enum(['light', 'dark']).describe('主题: 组件的颜色主题').default('light'),
});
```

### 3. 实现组件 (`index.tsx`)

编写 React 组件。组件会接收一个 `data` 属性，其类型为你定义的 Schema。

```tsx
import React from 'react';
import { z } from 'zod';
import { MyNewComponentSchema } from './schema';

type MyNewComponentProps = z.infer<typeof MyNewComponentSchema>;

export const MyNewComponent = (props: { data: MyNewComponentProps }) => {
  const { title, description, theme } = props.data;

  return (
    <div className={`my-component ${theme}`}>
      <h2>{title}</h2>
      {description && <p>{description}</p>}
    </div>
  );
};
```

**注意**: 如果组件需要使用 `useState`, `useEffect` 或其他浏览器 API (如 `swiper`), 请在文件顶部添加 `'use client';` 并将其视为客户端组件。

### 4. 注册组件

你需要修改以下几个文件来注册你的新组件：

#### A. `src/widgets/component-map.ts`
分配一个新的 Type ID (数字) 并添加中文标签。

```typescript
export const COMPONENT_MAP: Record<number, { name: string; label: string }> = {
  // ... existing
  9: { name: 'MyNewComponent', label: '我的新组件' }, // 确保 ID 不重复
};
```

#### B. `src/widgets/schemas.ts`
导出组件的 Schema。

```typescript
import { MyNewComponentSchema } from './MyNewComponent/schema';

export const SchemaRegistry = {
  // ... existing
  MyNewComponent: MyNewComponentSchema,
};
```

#### C. 注册到渲染表 (`server-registry.tsx` 或 `client-registry.tsx`)

*   **如果是服务端组件** (默认, 无交互):
    修改 `src/widgets/server-registry.tsx`:
    ```typescript
    import { MyNewComponent } from './MyNewComponent';

    export const ServerRegistry = {
      // ... existing
      MyNewComponent,
    };
    ```

*   **如果是客户端组件** (使用了 hooks 或浏览器 API):
    修改 `src/widgets/client-registry.tsx`:
    ```typescript
    export const ClientRegistry = {
      // ... existing
      MyNewComponent: dynamicClientFloor(() => import('./MyNewComponent').then(mod => mod.MyNewComponent)),
    };
    ```

### 5. 更新文档

运行以下命令重新生成 Agent 手册 (`knowledge/agent-manual.md`)：

```bash
# 在 apps/hercules 目录下
pnpm gen:docs
```

或者在根目录运行：
```bash
pnpm --filter hercules gen:docs
```

检查生成的文档，确保你的新组件和属性描述都正确显示为中文。

---

## 最佳实践

1.  **详细的中文描述**: Agent 依赖 Schema 中的 `.describe()` 来理解每个字段的用途。描述越清晰（包括格式、单位、用途），Agent 生成的配置就越准确。
2.  **提供默认值**: 尽量为非必填项提供 `.default()` 值，这样可以减少 Agent 的负担，也能保证组件在缺少配置时能正常渲染。
3.  **错误处理**: 在组件内部检查必要的数据。如果关键数据缺失（例如图片组件缺了 `src`），请渲染一个友好的占位符或返回 `null`，避免页面崩溃。
4.  **类型安全**: 始终使用 `z.infer<typeof Schema>` 来定义组件的 props 类型，保持 Schema 和组件实现的一致性。
