# Schema 元数据规范指南

## 目录

- [概述](#概述)
- [设计理念](#设计理念)
- [元数据注解详解](#元数据注解详解)
  - [@labels - 中文标签映射](#labels---中文标签映射)
  - [@unit - 单位显示](#unit---单位显示)
  - [@default - 默认选中项](#default---默认选中项)
- [解析流程与实现](#解析流程与实现)
- [错误处理与 Fallback](#错误处理与-fallback)
- [实际示例](#实际示例)
- [最佳实践](#最佳实践)

---

## 概述

Genesis 平台采用 **Zod Schema** 作为组件的数据结构定义标准。为了提升编辑器 (Zeus) 的用户体验，并为 AI Agent 提供更丰富的语义信息，我们在 Schema 的 `.describe()` 描述字符串中嵌入了**元数据注解**。

这些元数据注解会被自动解析，并应用于：

1. **属性编辑面板 (Property Inspector)**: 在 Zeus 编辑器中，AutoForm 会根据元数据渲染更友好的表单控件（如中文下拉选项、带单位的输入框）。
2. **AI 操作手册 (agent-manual.md)**: 文档生成脚本会保留这些元数据，帮助 AI 更好地理解组件的配置选项。

---

## 设计理念

### 为什么需要元数据？

Zod Schema 本身只能定义数据的**结构和类型**，但无法传达**语义和展示细节**。例如：

```typescript
// ❌ 没有元数据：用户看到的是 'left' | 'center' | 'right'
align: z.enum(['left', 'center', 'right'])

// ✅ 有元数据：用户看到的是 '左对齐' | '居中' | '右对齐'
align: z.enum(['left', 'center', 'right']).describe(
  '对齐方式: 文本对齐方式 @labels({"left":"左对齐", "center":"居中", "right":"右对齐"})'
)
```

### 单一事实来源 (Single Source of Truth)

元数据直接嵌入 Schema 描述中，确保了**组件定义、编辑器 UI 和 AI 文档**始终保持同步。你只需维护一份 Schema，无需在多处重复定义标签或单位。

### Schema-Driven Everything

这是 Genesis 架构的核心哲学之一："**Schema 驱动一切**"。通过在 Schema 中声明元数据，我们实现了：

- **零样板代码**: 无需手写表单控件，AutoForm 自动生成。
- **AI 友好**: 元数据成为 AI Prompt 的一部分，提升生成准确率。
- **可维护性**: 修改 Schema 即可更新 UI 和文档，无需改动多个文件。

---

## 元数据注解详解

### @labels - 中文标签映射

#### 作用

为 `z.enum()` 枚举值和 `z.literal()` 字面量提供人类可读的中文显示名称。

#### 语法

```
@labels({"key1":"标签1", "key2":"标签2", ...})
```

- **必须是合法的 JSON 格式**（使用双引号）。
- 键名对应枚举或字面量的实际值。
- 值为显示给用户的中文标签。

#### 适用场景

##### 1. 枚举 (z.enum)

```typescript
import { z } from 'zod';

export const TextSchema = z.object({
  align: z.enum(['left', 'center', 'right']).describe(
    '对齐方式: 文本对齐方式 @labels({"left":"左对齐", "center":"居中", "right":"右对齐"})'
  ),
  size: z.enum(['sm', 'base', 'lg', 'xl', '2xl']).describe(
    '字体大小: 字体大小 @labels({"sm":"小", "base":"标准", "lg":"大", "xl":"超大", "2xl":"特大"})'
  ),
});
```

**编辑器效果**：下拉选项显示为 "左对齐"、"居中"、"右对齐"，而实际保存的值仍是 `'left'`、`'center'`、`'right'`。

##### 2. Discriminated Union 的字面量 (z.literal)

```typescript
import { z } from 'zod';

const ContentImageSchema = z.object({
  variant: z.literal('content').describe('普通内容图片'),
  // ... 其他字段
});

const BackgroundImageSchema = z.object({
  variant: z.literal('background').describe('背景图片'),
  // ... 其他字段
});

export const ImageSchema = z.discriminatedUnion('variant', [
  ContentImageSchema,
  BackgroundImageSchema,
]).describe('图片类型: 支持内容图片和背景图片两种模式 @default(content)');
```

**编辑器效果**：类型选择器显示 "普通内容图片" 和 "背景图片"，而不是 `'content'` 和 `'background'`。

#### 解析原理

在 Zeus 编辑器中，`getSchemaMeta()` 函数（位于 `apps/zeus/src/lib/utils.ts`）会使用正则表达式提取 `@labels` 注解：

```typescript
const labelsMatch = description?.match(/@labels\(([^)]+)\)/);
if (labelsMatch) {
  try {
    const jsonStr = labelsMatch[1].replace(/'/g, '"');
    enumLabels = JSON.parse(jsonStr);
  } catch {
    console.warn('无法解析 @labels 元数据:', labelsMatch[1]);
  }
}
```

AutoForm 组件会使用这些标签来渲染下拉选项：

```typescript
<option key={opt} value={opt}>
  {enumLabels[opt] || opt}
</option>
```

---

### @unit - 单位显示

#### 作用

为数值或字符串输入框添加单位后缀（如 `px`、`rem`、`%`），在编辑器中显示为带单位提示的输入框。

#### 语法

```
@unit(单位名称)
```

例如：`@unit(px)`、`@unit(rem)`、`@unit(%)`

#### 适用场景

##### 1. ZodNumber（数值）

```typescript
export const SpacerSchema = z.object({
  height: z.number().describe('高度: 间距的高度 (px) @unit(px)').default(20),
});
```

**编辑器效果**：

```
┌──────────────┐
│      100  px │  ← 右侧显示 "px" 单位
└──────────────┘
```

##### 2. ZodString（字符串）

某些 CSS 属性需要带单位的字符串值（如 `"300px"`）：

```typescript
const BackgroundImageSchema = z.object({
  height: z.string().describe('高度: 容器高度 (如 300px, 20rem) @unit(px)'),
});
```

**编辑器效果**：AutoForm 会在输入框右侧显示单位提示，但值存储为完整字符串 `"300px"`。

#### 解析原理

`getSchemaMeta()` 提取 `@unit` 注解：

```typescript
const unitMatch = description?.match(/@unit\(([^)]+)\)/);
if (unitMatch) {
  unit = unitMatch[1];
}
```

AutoForm 根据 Schema 类型渲染不同的输入控件：

**ZodNumber 的处理**：

```typescript
if (unwrappedSchema instanceof ZodNumber) {
  if (unit) {
    return (
      <div className="relative">
        <input
          type="number"
          value={data ?? 0}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full p-2 border rounded text-sm pr-8"
        />
        <span className="absolute right-2 top-2 text-gray-500 text-sm pointer-events-none">
          {unit}
        </span>
      </div>
    );
  }
  // ... 无单位的默认渲染
}
```

**ZodString 的处理**：类似逻辑，但存储为字符串。

---

### @default - 默认选中项

#### 作用

为 **Discriminated Union** 指定默认选中的类型（discriminator 的默认值）。

#### 语法

```
@default(默认值)
```

例如：`@default(content)`、`@default(simple)`

#### 适用场景

仅用于 `z.discriminatedUnion()` 的顶层 Schema 描述中：

```typescript
export const ImageSchema = z.discriminatedUnion('variant', [
  ContentImageSchema,
  BackgroundImageSchema,
]).describe('图片类型: 支持内容图片和背景图片两种模式 @default(content)');
```

**编辑器效果**：

- 当用户首次添加 Image 组件时，类型选择器默认选中 `'content'`（普通内容图片），而不是联合的第一个选项。
- 如果数据中没有 `variant` 字段或值非法，自动回退到 `'content'`。

#### 解析原理

`getSchemaMeta()` 提取 `@default` 注解：

```typescript
const defaultMatch = description?.match(/@default\(([^)]+)\)/);
if (defaultMatch) {
  defaultValue = defaultMatch[1];
}
```

AutoForm 在处理 Discriminated Union 时使用：

```typescript
let activeValue = currentDiscriminatorValue;
if (!options.includes(activeValue)) {
  if (defaultValue && options.includes(defaultValue)) {
    activeValue = defaultValue; // 使用元数据中的默认值
  } else {
    activeValue = options[0]; // 回退到第一个选项
  }
}
```

---

## 解析流程与实现

### 元数据解析函数：getSchemaMeta

位于：`apps/zeus/src/lib/utils.ts`

```typescript
export function getSchemaMeta(schema: ZodType, defaultLabel?: string): SchemaMetadata {
  // 1. 解包 ZodOptional 和 ZodDefault，找到实际的描述
  let current: ZodType | null = schema;
  let fullDescription: string | undefined;
  
  while (current) {
    if (current.description) {
      fullDescription = current.description;
      break;
    }
    // 逐层解包
    if (current instanceof ZodOptional) {
      current = current.unwrap() as ZodType;
    } else if (current instanceof ZodDefault) {
      current = current.removeDefault() as ZodType;
    } else {
      current = null;
    }
  }

  // 2. 解析描述字符串的格式："标签: 描述 @元数据"
  const parts = fullDescription.split(': ');
  let label = parts[0]; // 冒号前是标签
  let description = parts.slice(1).join(': '); // 冒号后是描述

  // 3. 依次提取元数据注解
  const unitMatch = description?.match(/@unit\(([^)]+)\)/);
  const labelsMatch = description?.match(/@labels\(([^)]+)\)/);
  const defaultMatch = description?.match(/@default\(([^)]+)\)/);

  // 4. 返回解析结果
  return {
    label,
    description,
    unit: unitMatch?.[1],
    enumLabels: labelsMatch ? JSON.parse(labelsMatch[1]) : undefined,
    defaultValue: defaultMatch?.[1],
  };
}
```

### 在 AutoForm 中的应用

位于：`apps/zeus/src/components/PropertyInspector/AutoForm.tsx`

```typescript
export function AutoForm({ schema, data, onChange }: AutoFormProps) {
  const unwrappedSchema = unwrapSchema(schema);
  const { label, enumLabels, unit, defaultValue } = getSchemaMeta(schema);

  // 根据 Schema 类型和元数据渲染不同的表单控件
  if (unwrappedSchema instanceof ZodEnum) {
    return (
      <select>
        {options.map(opt => (
          <option key={opt} value={opt}>
            {enumLabels?.[opt] || opt}  {/* 使用中文标签 */}
          </option>
        ))}
      </select>
    );
  }

  if (unwrappedSchema instanceof ZodNumber && unit) {
    return (
      <div className="relative">
        <input type="number" />
        <span>{unit}</span>  {/* 显示单位 */}
      </div>
    );
  }

  // ... 其他类型
}
```

### 在 AI 文档生成中的应用

位于：`apps/hercules/scripts/generate-agent-docs.ts`

文档生成脚本会**保留**（而不是移除）`@labels` 和 `@unit`，让 AI 能够理解这些语义信息：

```typescript
function cleanDescription(rawDesc: string) {
  // ❌ 不要移除 @labels
  // description = description.replace(/@labels\([^)]+\)/g, '');
  
  // ✅ 保留 @labels，AI 可以学习标签映射
  return { description: rawDesc };
}
```

---

## 错误处理与 Fallback

### 元数据解析失败

如果 `@labels` 的 JSON 格式错误，系统会：

1. 在浏览器控制台输出警告：`无法解析 @labels 元数据: ...`
2. **回退到原始值**：下拉选项显示 `'left'` 而非 "左对齐"。
3. **不会导致页面崩溃**：表单仍可正常使用。

### 缺少元数据

如果 Schema 没有元数据注解：

- `label` 回退到字段名（如 `'align'`）。
- `enumLabels` 为 `undefined`，显示原始枚举值。
- `unit` 为 `undefined`，不显示单位后缀。

### 兼容性保障

所有元数据都是**可选的**。即使完全不写元数据注解，Schema 仍可正常工作，只是编辑器体验会下降。

---

## 实际示例

### 示例 1：Text 组件（完整元数据）

**文件**：`apps/hercules/src/widgets/Text/schema.ts`

```typescript
import { z } from 'zod';

export const TextSchema = z.object({
  content: z.string().describe('文本内容: 要显示的实际文本内容'),
  
  align: z.enum(['left', 'center', 'right']).optional().describe(
    '对齐方式: 文本对齐方式 @labels({"left":"左对齐", "center":"居中", "right":"右对齐"})'
  ).default('left'),
  
  size: z.enum(['sm', 'base', 'lg', 'xl', '2xl']).optional().describe(
    '字体大小: 字体大小 @labels({"sm":"小", "base":"标准", "lg":"大", "xl":"超大", "2xl":"特大"})'
  ).default('base'),
  
  color: z.string().optional().describe(
    '文本颜色: 文本颜色 (Hex 或 Tailwind 类)'
  ).default('text-black'),
  
  mode: z.enum(['simple', 'with-locale']).optional().describe(
    '显示模式: 显示模式 @labels({"simple":"标准模式", "with-locale":"多语言模式"})'
  ).default('simple'),
});
```

**编辑器效果**：

- `align` 字段显示为下拉框，选项为 "左对齐"、"居中"、"右对齐"。
- `size` 字段显示为下拉框，选项为 "小"、"标准"、"大"、"超大"、"特大"。
- `mode` 字段显示为下拉框，选项为 "标准模式"、"多语言模式"。

---

### 示例 2：Image 组件（Discriminated Union + @default）

**文件**：`apps/hercules/src/widgets/Image/schema.ts`

```typescript
import { z } from 'zod';

const BaseImageSchema = z.object({
  src: z.string().describe('图片链接: 图片链接地址'),
  clickUrl: z.string().optional().describe('跳转链接: 点击跳转链接'),
});

const ContentImageSchema = BaseImageSchema.extend({
  variant: z.literal('content').describe('普通内容图片'),
  aspectRatio: z.enum(['16/9', '4/3', '1/1', 'auto']).optional().describe(
    '宽高比: 图片容器的宽高比'
  ).default('auto'),
  objectFit: z.enum(['cover', 'contain', 'fill']).optional().describe(
    '填充模式: CSS object-fit 属性 @labels({"cover":"覆盖", "contain":"包含", "fill":"拉伸"})'
  ).default('cover'),
});

const BackgroundImageSchema = BaseImageSchema.extend({
  variant: z.literal('background').describe('背景图片'),
  height: z.string().describe('高度: 容器高度 (如 300px, 20rem) @unit(px)'),
  backgroundPosition: z.enum(['center', 'top', 'bottom', 'left', 'right']).optional().describe(
    '背景位置: 在容器内的位置'
  ).default('center'),
});

export const ImageSchema = z.discriminatedUnion('variant', [
  ContentImageSchema,
  BackgroundImageSchema,
]).describe('图片类型: 支持内容图片和背景图片两种模式 @default(content)');
```

**编辑器效果**：

- 类型选择器默认选中 "普通内容图片" (`@default(content)`)。
- 切换到 "背景图片" 时，`height` 输入框右侧显示 "px" 单位。
- `objectFit` 下拉选项显示为 "覆盖"、"包含"、"拉伸"（而非 `'cover'`、`'contain'`、`'fill'`）。

---

### 示例 3：Spacer 组件（ZodNumber + @unit）

**文件**：`apps/hercules/src/widgets/Spacer/schema.ts`

```typescript
import { z } from 'zod';

export const SpacerSchema = z.object({
  height: z.number().describe('高度: 间距的高度 (px) @unit(px)').default(20),
  backgroundColor: z.string().optional().describe(
    '背景颜色: 间距的背景颜色 (Hex 或 Tailwind 类)'
  ).default('bg-transparent'),
});
```

**编辑器效果**：

- `height` 字段渲染为数字输入框，右侧显示 "px" 单位后缀。
- 用户输入 `100`，实际保存的值为数字 `100`（而非字符串 `"100px"`）。

---

## 最佳实践

### 1. 描述字符串格式规范

**推荐格式**：`标签: 详细描述 @元数据1 @元数据2`

```typescript
// ✅ 好的格式
height: z.number().describe('高度: 间距的高度 (px) @unit(px)')

// ❌ 不好的格式（缺少冒号分隔）
height: z.number().describe('高度 @unit(px)')
```

**为什么**：`getSchemaMeta()` 使用 `: ` 分割标签和描述。缺少冒号会导致标签为整个字符串。

---

### 2. @labels 必须使用双引号

```typescript
// ✅ 正确（双引号）
@labels({"left":"左对齐", "center":"居中"})

// ❌ 错误（单引号会导致 JSON 解析失败）
@labels({'left':'左对齐', 'center':'居中'})
```

**原因**：JSON 规范要求使用双引号。虽然代码中有 `.replace(/'/g, '"')` 的兼容处理，但直接用双引号更规范。

---

### 3. 优先使用元数据，而非硬编码

```typescript
// ❌ 不好：在组件代码中硬编码中文
if (align === 'left') return '左对齐';

// ✅ 好：在 Schema 中声明元数据
align: z.enum(['left', 'center', 'right']).describe(
  '对齐方式: 文本对齐方式 @labels({"left":"左对齐", "center":"居中", "right":"右对齐"})'
)
```

**好处**：

- 编辑器和 AI 文档自动同步。
- 未来支持国际化时，只需修改 Schema。

---

### 4. @unit 仅用于 CSS 单位

适合：`px`、`rem`、`em`、`%`、`vh`、`vw`

不适合：`个`、`次`、`件`（这些是业务单位，不是 CSS 单位）

```typescript
// ✅ 合适的用法
height: z.number().describe('高度: 容器高度 @unit(px)')

// ❌ 不合适的用法
quantity: z.number().describe('数量: 商品数量 @unit(个)')
```

**原因**：`@unit` 的设计初衷是为 CSS 属性提供单位提示。业务单位应在描述文本中说明。

---

### 5. 为 Discriminated Union 的字面量添加描述

```typescript
// ✅ 好：每个字面量都有清晰的中文描述
const ContentImageSchema = z.object({
  variant: z.literal('content').describe('普通内容图片'),
  // ...
});

const BackgroundImageSchema = z.object({
  variant: z.literal('background').describe('背景图片'),
  // ...
});

// ❌ 不好：缺少描述，编辑器显示原始值
const ContentImageSchema = z.object({
  variant: z.literal('content'),
  // ...
});
```

**编辑器效果**：有描述时，类型选择器显示 "普通内容图片"；无描述时显示 `'content'`。

---

### 6. 使用 @default 改善初始体验

对于 Discriminated Union，建议添加 `@default` 注解：

```typescript
export const ImageSchema = z.discriminatedUnion('variant', [
  ContentImageSchema,
  BackgroundImageSchema,
]).describe('图片类型: 支持内容图片和背景图片两种模式 @default(content)');
```

**好处**：

- 用户添加组件时，默认选中最常用的类型。
- 减少不必要的类型切换操作。

---

### 7. 保持元数据简洁

避免在描述中堆砌过多信息：

```typescript
// ❌ 过于冗长
align: z.enum(['left', 'center', 'right']).describe(
  '对齐方式: 这是一个用于控制文本水平对齐的属性，支持左对齐、居中和右对齐三种模式，默认为左对齐，适用于大多数场景 @labels({"left":"左对齐", "center":"居中", "right":"右对齐"})'
)

// ✅ 简洁明了
align: z.enum(['left', 'center', 'right']).describe(
  '对齐方式: 文本对齐方式 @labels({"left":"左对齐", "center":"居中", "right":"右对齐"})'
)
```

**原因**：

- 编辑器 UI 空间有限，过长的描述会影响阅读。
- AI 文档中会原样显示，冗长的描述降低可读性。

---

### 8. 修改 Schema 后更新文档

每次修改组件的 Schema（包括元数据）后，记得运行：

```bash
pnpm gen:docs
```

这会更新 `knowledge/agent-manual.md`，确保 AI 操作手册与代码保持同步。

---

## 总结

Genesis 的 Schema 元数据系统是 **"Schema 驱动一切"** 理念的重要体现。通过简单的注解语法，我们实现了：

1. **编辑器 UI 自动生成**：无需手写表单代码，AutoForm 根据元数据渲染友好的控件。
2. **AI 文档自动同步**：元数据成为 AI Prompt 的一部分，提升生成准确率。
3. **单一事实来源**：一处修改，全局生效，降低维护成本。

在开发新组件时，请务必遵循本规范，为 Schema 添加完整的元数据注解，提升整个平台的用户体验和 AI 友好性。

---

## 相关文档

- [组件开发指南 (COMPONENT_GUIDE.md)](./apps/hercules/COMPONENT_GUIDE.md)
- [Zeus 编辑器架构 (apps/zeus/ARCHITECTURE.md)](./apps/zeus/ARCHITECTURE.md)
- [AutoForm 源码 (apps/zeus/src/components/PropertyInspector/AutoForm.tsx)](./apps/zeus/src/components/PropertyInspector/AutoForm.tsx)
- [元数据解析工具 (apps/zeus/src/lib/utils.ts)](./apps/zeus/src/lib/utils.ts)

