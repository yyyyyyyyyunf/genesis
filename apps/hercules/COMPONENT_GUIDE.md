# Hercules 组件开发指南

欢迎加入 Hercules 开发！本指南将帮助你快速上手，了解如何为营销页面系统添加新的 UI 组件。

Hercules 使用 Next.js 构建，采用了一种基于配置驱动（Server-Driven UI）的架构。AI Agent 或运营后台生成的 JSON 配置决定了页面渲染哪些组件。

## 核心概念

在开发组件前，请理解以下核心文件和目录的作用：

*   **`src/widgets/`**: 所有组件的源代码目录。
*   **`src/widgets/<ComponentName>/schema.ts`**: 定义组件的数据结构（Zod Schema），**这对 AI Agent 至关重要**。
*   **`src/widgets/component-map.ts`**: 定义组件的 ID (Type ID) 和名称映射。
*   **`src/widgets/schemas.ts`**: 导出所有组件的 Schema。
*   **`src/widgets/mock-datas.ts`**: 导出所有组件的示例配置数据（用于生成 AI Agent 文档）。
*   **`src/widgets/server-registry.tsx`**: 注册服务端渲染组件 (RSC)。
*   **`src/widgets/client-registry.tsx`**: 注册客户端交互组件 (Client Components)。

---

## 开发流程

添加一个新组件通常需要以下 6 个步骤：

### 1. 创建组件文件

在 `src/widgets/` 下创建一个以组件名命名的目录（例如 `MyNewComponent`），包含三个文件：
*   `index.tsx`: 组件的 React 实现。
*   `schema.ts`: 组件的 Zod Schema 定义。
*   `mock-data.ts`: 组件的示例配置数据。

### 2. 定义 Schema (`schema.ts`)

这是最关键的一步。我们需要使用 `zod` 定义组件接收的数据结构。
**请使用 `withMeta()` 函数添加元数据**，这些元数据会被提取生成 Agent 手册，指导 AI 正确生成配置。

`withMeta()` 函数提供类型安全的元数据定义，不同类型的 Schema 可以使用不同的元数据字段：

*   **`label`**: 字段的中文名称（所有类型适用）
*   **`description`**: 字段的详细说明（所有类型适用）
*   **`labels`**: 为 Enum 类型的选项提供中文显示名称
*   **`unit`**: 为 String/Number 类型添加单位后缀
*   **`defaultValue`**: 为 Discriminated Union 指定默认选中的子类型

```typescript
import { z } from 'zod';
import { withMeta } from '@/lib/schema-utils';

export const MyNewComponentSchema = z.object({
  title: withMeta(z.string(), {
    label: '标题',
    description: '组件的标题文本',
  }).default('新组件'),
  description: withMeta(z.string(), {
    label: '描述',
    description: '组件的描述信息',
  }).optional(),
  theme: withMeta(z.enum(['light', 'dark']), {
    label: '主题',
    description: '组件的颜色主题',
    labels: {
      light: '明亮',
      dark: '暗黑',
    },
  }).default('light'),
  width: withMeta(z.string(), {
    label: '宽度',
    description: '组件宽度',
    unit: 'px',
  }).default('100px'),
});
```

**💡 提示：灵活的调用顺序**

`withMeta()` 支持两种调用方式：

```typescript
// ✅ 推荐：先 withMeta，后 .optional()
withMeta(z.string(), { label: '标签' }).optional()

// ✅ 也支持：先 .optional()，后 withMeta
withMeta(z.string().optional(), { label: '标签' })
```

#### 高级技巧：使用 Discriminated Union (可辨识联合)

当一个组件有多种形态，且不同形态需要完全不同的配置项时，可以使用 `z.discriminatedUnion`。我们支持**多级嵌套**的 Discriminated Union，可以实现复杂的级联配置。

**场景示例**：Image 组件既可以作为普通图片 (`content`) 展示，也可以作为背景容器 (`background`) 展示。

1.  **定义基础 Schema**：
    包含所有形态共有的字段（如 `src`, `clickUrl`）。

2.  **定义各形态的 Schema**：
    使用 `.extend()` 扩展基础 Schema，并添加一个字面量类型的 `variant` 字段作为辨识符（Discriminator）。
    **重要**：为每个 literal 添加 `label`，这样属性检查器的下拉选项会显示友好的中文名称。

    ```typescript
    import { withMeta } from '@/lib/schema-utils';
    
    // 形态 1: 普通内容
    const ContentImageSchema = BaseImageSchema.extend({
      variant: withMeta(z.literal('content'), {
        label: '普通内容图片', // label 会显示在下拉选项中
      }),
      aspectRatio: withMeta(z.enum(['16/9', '4/3']), {
        label: '宽高比',
      }).optional(), // 只有普通图片需要的字段
    });

    // 形态 2: 背景容器
    const BackgroundImageSchema = BaseImageSchema.extend({
      variant: withMeta(z.literal('background'), {
        label: '背景图片', // label 会显示在下拉选项中
      }),
      height: withMeta(z.string(), {
        label: '高度',
        unit: 'px',
      }), // 背景容器必须指定高度
      backgroundPosition: withMeta(z.enum(['center', 'top']), {
        label: '背景位置',
      }).optional(),
    });
    ```

3.  **组合 Schema**：
    可以通过 `defaultValue` 指定默认使用哪种形态。
    
    ```typescript
    export const ImageSchema = withMeta(
      z.discriminatedUnion('variant', [
        ContentImageSchema,
        BackgroundImageSchema,
      ]),
      {
        label: '图片类型',
        description: '支持内容图片和背景图片两种模式',
        defaultValue: 'content',
      }
    );
    ```

**多级级联示例**：

如果在 `BackgroundImageSchema` 中，`backgroundPosition` 本身也是一个需要根据不同模式（如预设/自定义）展示不同字段的复杂配置，你可以再次使用 `z.discriminatedUnion`：

```typescript
// 1. 定义简单的预设位置
const SimplePosition = z.object({
  mode: z.literal('preset').describe('预设位置'), // literal 描述会显示在下拉选项中
  value: z.enum(['center', 'top']).describe('位置'),
});

// 2. 定义自定义坐标位置
const CustomPosition = z.object({
  mode: z.literal('custom').describe('自定义坐标'), // literal 描述会显示在下拉选项中
  x: z.string().describe('X坐标 @unit(%)'),
  y: z.string().describe('Y坐标 @unit(%)'),
});

// 3. 在 BackgroundImageSchema 中嵌套使用
const BackgroundImageSchema = BaseImageSchema.extend({
  variant: z.literal('background').describe('背景图片'),
  height: z.string().describe('高度 @unit(px)'),
  // 嵌套的 Discriminated Union
  position: z.discriminatedUnion('mode', [SimplePosition, CustomPosition])
    .describe('背景位置 @default(preset)'),
});
```
属性检查器会自动识别这种嵌套结构，并渲染出级联的选择界面。

**组件实现**：
在组件中，通过检查 `data.variant` 来区分渲染逻辑。TypeScript 会自动推断出该分支下可用的字段。

```tsx
if (data.variant === 'content') {
  // 这里可以访问 aspectRatio, 但不能访问 height
  return <img ... />;
}

if (data.variant === 'background') {
  // 这里必须访问 height
  return <div style={{ height: data.height }} ... />;
}
```

### 3. 创建示例数据 (`mock-data.ts`)

为组件创建高质量的示例配置数据，用于生成 AI Agent 手册。这一步非常重要，因为它直接影响 AI Agent 理解和生成配置的准确性。

**文件结构**：
```typescript
import { z } from 'zod';
import { MyNewComponentSchema } from './schema';

type MyNewComponentProps = z.infer<typeof MyNewComponentSchema>;

export const MyNewComponentMockData: {
  minimal: MyNewComponentProps;
  complete: MyNewComponentProps;
} = {
  // 最小配置：只包含必填字段和默认值
  minimal: {
    title: '示例标题',
    theme: 'light'
  },
  // 完整配置：展示所有常用字段的实际使用场景
  complete: {
    title: '产品特性介绍',
    description: '这是一个功能强大的组件，支持多种主题切换',
    theme: 'dark',
    width: '800px'
  }
};
```

**最佳实践**：
*   **真实场景**：使用贴近实际业务场景的数据，而不是 "test", "example" 这样的占位符。
*   **类型安全**：利用 TypeScript 类型推导，确保示例数据符合 Schema 定义。
*   **完整性**：`complete` 示例应包含所有可选字段，展示组件的完整功能。
*   **正确的 URL**：
    *   图片使用 `.jpg`, `.png` 等图片格式
    *   视频使用 `.mp4`, `.webm` 等视频格式
    *   使用 Unsplash 等真实图片服务而不是占位符

**示例**：
```typescript
// ❌ 不好的示例
minimal: {
  src: 'https://example.com/image.jpg', // 视频组件却用了图片 URL
  title: 'test'                          // 无意义的占位符
}

// ✅ 好的示例
minimal: {
  src: 'https://example.com/videos/product-demo.mp4', // 正确的视频 URL
  poster: 'https://images.unsplash.com/photo-123',    // 正确的封面图片
  title: '产品功能演示视频'                          // 有实际意义的标题
}
```

### 4. 实现组件 (`index.tsx`)

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

### 5. 注册组件

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

### 6. 生成文档并测试

运行以下命令重新生成 Agent 手册 (`knowledge/agent-manual.md`)：

```bash
# 在 apps/hercules 目录下
pnpm gen:docs
```

或者在根目录运行：
```bash
pnpm --filter hercules gen:docs
```

该命令会：
*   解析你的 Schema 中的中文描述和元数据标签 (`@labels`, `@unit` 等)
*   从 `mock-data.ts` 中提取示例配置
*   自动生成包含最小配置和完整配置示例的文档

检查生成的文档，确保：
*   组件属性描述都正确显示为中文
*   最小配置示例包含所有必填字段和默认值
*   完整配置示例展示了组件的实际使用场景
*   URL 格式正确（图片用 `.jpg`，视频用 `.mp4`）

---

## Mock Data 最佳实践

### 为什么需要 Mock Data？

Mock Data（示例配置数据）是 AI Agent 手册的重要组成部分。当 AI Agent 需要生成组件配置时，会参考这些示例来：
1. 理解组件的实际使用场景
2. 学习正确的数据格式和值类型
3. 生成符合业务场景的配置

### 编写高质量 Mock Data 的原则

#### 1. 真实性
使用贴近实际业务的数据，而不是测试占位符。

```typescript
// ❌ 不好
{
  title: 'Test Title',
  content: 'Lorem ipsum dolor sit amet'
}

// ✅ 好
{
  title: '春季新品上市',
  content: '全新系列产品现已发布，快来选购吧！'
}
```

#### 2. URL 格式正确性
确保 URL 使用正确的文件扩展名。

```typescript
// ❌ 不好：视频组件使用图片 URL
{
  src: 'https://example.com/image.jpg',
  poster: 'example text'
}

// ✅ 好：使用正确的文件格式
{
  src: 'https://example.com/videos/product-demo.mp4',
  poster: 'https://images.unsplash.com/photo-1234567890'
}
```

#### 3. 完整性
`complete` 示例应包含所有可选字段，展示组件的完整能力。

```typescript
export const VideoMockData = {
  minimal: {
    src: 'https://example.com/video.mp4'  // 只包含必填字段
  },
  complete: {
    src: 'https://example.com/video.mp4',
    poster: 'https://example.com/cover.jpg',
    autoplay: false,
    controls: true,
    loop: false,
    muted: false,
    aspectRatio: '16/9'  // 展示所有可选字段
  }
};
```

#### 4. 类型安全
利用 TypeScript 的类型系统确保示例数据正确。

```typescript
import { z } from 'zod';
import { MyComponentSchema } from './schema';

type MyComponentProps = z.infer<typeof MyComponentSchema>;

// TypeScript 会检查这里的类型是否正确
export const MyComponentMockData: {
  minimal: MyComponentProps;
  complete: MyComponentProps;
} = {
  // ...
};
```

### Mock Data 注册流程

创建完 mock-data.ts 后，需要在 `src/widgets/mock-datas.ts` 中注册：

```typescript
// 1. 导入
import { MyNewComponentMockData } from './MyNewComponent/mock-data';

// 2. 添加到注册表
export const MockDatas = {
  // ... 其他组件
  MyNewComponent: MyNewComponentMockData,
};
```

注册后，`generate-agent-docs.ts` 脚本会自动使用这些示例生成文档。

---

## 其他最佳实践

1.  **详细的中文描述**: Agent 依赖 Schema 中的 `.describe()` 来理解每个字段的用途。描述越清晰（包括格式、单位、用途），Agent 生成的配置就越准确。
2.  **提供默认值**: 尽量为非必填项提供 `.default()` 值，这样可以减少 Agent 的负担，也能保证组件在缺少配置时能正常渲染。
3.  **错误处理**: 在组件内部检查必要的数据。如果关键数据缺失（例如图片组件缺了 `src`），请渲染一个友好的占位符或返回 `null`，避免页面崩溃。
4.  **类型安全**: 始终使用 `z.infer<typeof Schema>` 来定义组件的 props 类型，保持 Schema 和组件实现的一致性。
