# AI Agent 集成设计文档

本文档详细说明 Genesis 平台的 AI Agent 集成架构、当前实现和未来规划。

## 📋 目录

- [设计理念](#设计理念)
- [当前实现（演示模式）](#当前实现演示模式)
- [未来规划（Dify 集成）](#未来规划dify-集成)
- [技术实现细节](#技术实现细节)
- [开发指南](#开发指南)

---

## 设计理念

Genesis 的 AI Agent 集成遵循以下核心原则：

### 1. AI-Friendly by Design

- **Schema 即 Prompt**: 组件的 Zod Schema 既是数据校验规则，也是 AI 理解组件结构的文档
- **元数据注解**: `@labels`, `@unit`, `@defaultValue` 帮助 AI 理解字段含义
- **JSON 示例**: 通过 `mock-data.ts` 提供具体的使用示例，降低 AI 理解成本

### 2. Draft/Commit 工作流

- **安全性优先**: AI 的修改不会直接生效，而是进入 Draft 状态
- **人工审查**: 用户可以预览 AI 的更改，选择接受或拒绝
- **可回滚**: 拒绝后页面配置恢复到 AI 修改前的状态

### 3. 智能校验

- **运行时拦截**: Validator 在渲染前拦截 AI 生成的非法配置
- **错误修复**: 自动修复常见错误（如类型转换）
- **优雅降级**: 无法修复的配置会被标记，渲染时使用默认值

---

## 当前实现（演示模式）

### 概述

当前版本的 AI 助手是一个 **演示模式**，用于展示 Draft/Commit 工作流和用户界面交互，**不会**调用真实的 LLM API。

### 实现位置

**文件**: `apps/zeus/src/components/ChatPanel.tsx`

### 核心逻辑

```typescript
const handleSend = async () => {
  if (!input.trim()) return;
  
  console.log('发送指令给 Agent:', input);
  
  // 模拟网络延迟
  setTimeout(() => {
      // 演示目的：反转配置数组作为"更改"
      setDraftConfig([...mockPageConfig].reverse()); 
  }, 1000);
  
  setInput('');
};
```

### 用户体验

1. **输入指令**: 用户在聊天框中输入自然语言指令
2. **模拟响应**: 1 秒后，系统将当前配置反转作为"AI 建议的修改"
3. **Draft 状态**: 顶部出现黄色提示条，显示"Agent 提议的更改"
4. **审查决策**: 
   - **接受**: 调用 `commitDraft()`，将 Draft Config 应用到主配置
   - **拒绝**: 调用 `rejectDraft()`，清除 Draft Config，恢复原配置

### 状态管理

**文件**: `apps/zeus/src/lib/store.ts`

```typescript
interface EditorState {
  config: FloorConfig[];           // 当前生效的配置
  draftConfig: FloorConfig[] | null; // AI 建议的配置（Draft 状态）
  
  setDraftConfig: (config: FloorConfig[]) => void;
  commitDraft: () => void;        // 接受 Draft
  rejectDraft: () => void;        // 拒绝 Draft
}

// Draft/Commit 实现
commitDraft: () => {
  const { draftConfig } = get();
  if (draftConfig) {
    set({ config: draftConfig, draftConfig: null });
  }
},

rejectDraft: () => {
  set({ draftConfig: null });
},
```

### 限制

- 无实际 AI 能力，只能演示工作流
- 无法理解用户指令
- 配置更改是随机的（反转数组）

---

## 未来规划（Dify 集成）

### 为什么选择 Dify？

Dify 是一个开源的 LLM 应用开发平台，提供：

1. **可视化编排**: 拖拽式工作流设计
2. **Prompt 管理**: 版本控制和 A/B 测试
3. **API 封装**: 统一的接口调用方式
4. **成本控制**: 支持多种 LLM 提供商（OpenAI、Claude、国产模型等）
5. **监控与调试**: 日志记录和性能分析

### 架构设计

```
┌─────────────┐         ┌──────────────┐         ┌───────────────┐
│             │  REST   │              │  Dify   │               │
│   Zeus      │────────▶│   Jarvis     │────────▶│     Dify      │
│  (编辑器)    │  API    │  (后端代理)   │  API    │   (LLM平台)    │
│             │◀────────│              │◀────────│               │
└─────────────┘         └──────────────┘         └───────────────┘
                                │
                                │ 校验
                                ▼
                        ┌──────────────┐
                        │  Validator   │
                        │  (Hercules)  │
                        └──────────────┘
```

### 数据流

1. **用户输入**: Zeus Chat Panel 中输入自然语言指令
2. **发送请求**: Zeus 调用 Jarvis 的 `/api/ai/generate` 端点
3. **代理转发**: Jarvis 将请求转发给 Dify API，附带上下文信息：
   - 当前页面配置
   - 组件 Schema 文档（agent-manual.md）
   - 历史对话记录
4. **LLM 生成**: Dify 调用 LLM 生成新的页面配置 JSON
5. **响应返回**: Dify 返回生成的配置，Jarvis 转发给 Zeus
6. **校验过滤**: Zeus 调用 Validator 校验配置合法性
7. **Draft 状态**: 将校验后的配置设为 Draft Config
8. **用户审查**: 用户预览并决定接受或拒绝

### API 设计

#### Zeus 请求 (前端)

```typescript
// apps/zeus/src/lib/ai-client.ts
export async function generateConfig(
  prompt: string,
  currentConfig: FloorConfig[]
): Promise<FloorConfig[]> {
  const response = await fetch(`${API_BASE_URL}/api/ai/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      prompt,
      currentConfig,
      history: [], // 可选：历史对话
    }),
  });
  
  if (!response.ok) {
    throw new Error('AI 生成失败');
  }
  
  return response.json();
}
```

#### Jarvis 端点 (后端代理)

```typescript
// apps/jarvis/src/routes/ai.ts
app.post('/api/ai/generate', async (c) => {
  const { prompt, currentConfig, history } = await c.req.json();
  
  // 1. 构建 Dify 请求
  const difyResponse = await fetch(DIFY_API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${DIFY_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      inputs: {
        prompt,
        current_config: JSON.stringify(currentConfig),
      },
      query: prompt,
      response_mode: 'blocking', // 同步模式
      conversation_id: '', // 可选：会话 ID
      user: 'user-id', // 用户标识
    }),
  });
  
  const data = await difyResponse.json();
  
  // 2. 解析 Dify 返回的 JSON
  const generatedConfig = JSON.parse(data.answer);
  
  // 3. 基础校验（可选，主要校验在 Zeus）
  // ...
  
  return c.json(generatedConfig);
});
```

#### Dify 配置

**Workflow 节点**:

1. **输入节点**: 接收 `prompt` 和 `current_config`
2. **LLM 节点**: 调用 LLM（如 Claude Sonnet）
   - **System Prompt**: 加载 `knowledge/agent-manual.md` 作为上下文
   - **User Prompt**: 构建提示词模板
3. **代码节点** (可选): JSON 格式化和基础校验
4. **输出节点**: 返回生成的配置 JSON

**Prompt 模板示例**:

```
你是一个专业的页面配置生成助手。根据用户的需求，修改或生成页面的 JSON 配置。

## 当前页面配置：
```json
{{current_config}}
```

## 用户需求：
{{prompt}}

## 要求：
1. 输出完整的页面配置 JSON（FloorConfig[] 类型）
2. 严格遵守 Schema 定义（参考 Agent Manual）
3. 只输出 JSON，不要包含其他文本
4. 确保所有必填字段都有值
5. 使用有意义的示例数据（如图片 URL、文本内容）

请生成新的页面配置：
```

---

## 技术实现细节

### Validator 集成

**文件**: `apps/hercules/src/lib/validator.ts`

Validator 负责拦截和修复 AI 生成的错误配置：

```typescript
export function validateConfig(config: FloorConfig[]): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const fixedConfig: FloorConfig[] = [];
  
  for (const floor of config) {
    // 1. 检查 typeId 是否有效
    if (!isValidTypeId(floor.typeId)) {
      errors.push(`无效的 typeId: ${floor.typeId}`);
      continue;
    }
    
    // 2. 获取对应的 Schema
    const schema = getSchemaByTypeId(floor.typeId);
    
    // 3. 校验数据
    const result = schema.safeParse(floor.data);
    
    if (result.success) {
      fixedConfig.push(floor);
    } else {
      // 4. 尝试自动修复
      const fixed = attemptFix(floor, result.error);
      if (fixed) {
        fixedConfig.push(fixed);
        warnings.push(`已自动修复 ${floor.typeId} 的数据格式错误`);
      } else {
        errors.push(`无法修复 ${floor.typeId}: ${result.error.message}`);
      }
    }
  }
  
  return {
    success: errors.length === 0,
    errors,
    warnings,
    config: fixedConfig,
  };
}
```

### Agent Manual 生成

**文件**: `apps/hercules/scripts/generate-agent-docs.ts`

这个脚本自动从 Zod Schema 生成 AI 可读的文档：

**输入**:
- `src/widgets/*/schema.ts` - 所有组件的 Schema 定义
- `src/widgets/*/mock-data.ts` - 组件的示例配置

**输出**:
- `knowledge/agent-manual.md` - 完整的 AI 文档

**生成内容**:
- 组件列表和说明
- 每个组件的属性详解
- 最小配置和完整配置示例
- 枚举类型的可选值和中文标签

**运行命令**:
```bash
pnpm gen:docs
```

---

## 开发指南

### 如何添加新的 AI 功能？

#### 步骤1: 扩展 Agent Manual

确保新组件有完整的 Schema 和 mock-data：

```typescript
// apps/hercules/src/widgets/NewComponent/schema.ts
export const NewComponentSchema = z.object({
  title: z.string().describe('标题'),
  type: z.enum(['A', 'B']).describe('类型 @labels({"A":"选项A","B":"选项B"})'),
});

// apps/hercules/src/widgets/NewComponent/mock-data.ts
export const NewComponentMockData = {
  minimal: { title: '示例标题', type: 'A' },
  complete: { title: '完整示例', type: 'B' },
};
```

重新生成文档：
```bash
pnpm gen:docs
```

#### 步骤2: 更新 Dify Prompt (未来)

在 Dify 平台中，将新生成的 `agent-manual.md` 上传到知识库。

#### 步骤3: 测试生成效果

在 Zeus 中输入测试指令，查看 AI 是否能正确生成新组件的配置。

---

### 如何优化 AI 生成质量？

#### 方法1: 改进 Schema 描述

```typescript
// ❌ 不好的描述
z.string().describe('URL')

// ✅ 好的描述
z.string().describe('图片地址，需要是有效的 HTTPS URL，推荐使用 CDN 图片')
```

#### 方法2: 提供更多示例

在 `mock-data.ts` 中提供多种典型场景的配置：

```typescript
export const ImageMockData = {
  minimal: { src: '...', variant: 'content' },
  complete: { src: '...', variant: 'background', height: 400, ... },
  // 可以添加更多场景
  scenarios: {
    hero: { src: '...', variant: 'background', height: 600 },
    thumbnail: { src: '...', variant: 'content', aspectRatio: '1/1' },
  }
};
```

#### 方法3: 调整 Dify Prompt

在 Dify 平台中调整 System Prompt，增加约束条件或示例。

---

### 如何调试 AI 生成问题？

#### 步骤1: 启用日志

在 Zeus 的 `ai-client.ts` 中添加调试日志：

```typescript
console.log('发送给 AI 的上下文:', {
  prompt,
  currentConfig: JSON.stringify(currentConfig, null, 2),
});

const result = await generateConfig(prompt, currentConfig);
console.log('AI 返回的配置:', result);
```

#### 步骤2: 检查 Validator 输出

在 Validator 中查看校验结果：

```typescript
const validation = validateConfig(aiGeneratedConfig);
console.log('校验结果:', validation);
if (!validation.success) {
  console.error('校验错误:', validation.errors);
}
```

#### 步骤3: 查看 Dify 日志 (未来)

在 Dify 平台的"日志与标注"中，查看：
- 完整的输入输出
- Token 使用量
- 响应时间
- 错误信息

---

## 安全与成本考虑

### 安全性

1. **API Key 保护**: 
   - Dify API Key 只存储在 Jarvis 后端（环境变量）
   - 前端（Zeus）无法直接访问 LLM

2. **输入过滤**:
   - 限制 Prompt 长度（如最多 1000 字符）
   - 过滤敏感词和恶意注入

3. **输出校验**:
   - Validator 强制校验所有 AI 生成的配置
   - 无效配置不会到达渲染层

### 成本控制

1. **请求限制**:
   - 限制单用户每分钟的 AI 请求次数（Rate Limit）
   - 避免恶意调用

2. **Token 优化**:
   - 压缩 Agent Manual 长度
   - 只传递当前页面配置，不传递历史记录（可选）

3. **缓存机制**:
   - 对相同 Prompt + Config 的结果进行缓存
   - 减少重复调用

---

## 未来扩展

### 1. 多轮对话

支持连续对话，AI 可以基于上下文进行迭代修改：

```
用户: 添加一个 Banner
AI: [生成配置]
用户: 把 Banner 的高度改大一点
AI: [基于上一轮的配置修改]
```

**实现方式**: 在 Dify 中维护 `conversation_id`，保留对话历史。

### 2. 自然语言查询

支持用户查询页面信息：

```
用户: 当前页面有几个组件？
AI: 当前页面有 5 个组件：Text、Image、Button、Spacer、Video。
```

### 3. 批量生成

支持一次性生成整个页面：

```
用户: 帮我生成一个产品介绍页，包括 Banner、特性列表和购买按钮
AI: [生成完整的多组件配置]
```

### 4. 模板市场

- 用户可以分享自己的页面配置为"模板"
- AI 学习这些模板，生成更符合实际场景的配置

---

## 📚 相关文档

- **[Agent Manual (agent-manual.md)](./knowledge/agent-manual.md)**: AI 可读的组件文档
- **[Schema 元数据规范 (SCHEMA_GUIDE.md)](./SCHEMA_GUIDE.md)**: 了解 @labels 等注解
- **[用户使用指南 (USER_GUIDE.md)](./USER_GUIDE.md)**: AI 助手使用说明
- **[常见问题 (FAQ.md)](./FAQ.md)**: AI 相关问题排查

---

## 质量保障

Genesis 的 AI 系统包含两层质量保障机制：

1. **Self-Correction（实时修正）**: AI 生成后自动校验和重试
2. **Eval（系统评估）**: 记录和分析所有交互，持续优化

详细设计和实施方案请查看 **[AI_EVAL.md](./AI_EVAL.md)**

---

## 🤝 贡献

如果你有 AI 集成的想法或优化建议，欢迎：

1. 提交 Issue 讨论
2. 创建 Pull Request
3. 在社区分享你的实践经验

让我们一起打造更智能的低代码平台！🚀

