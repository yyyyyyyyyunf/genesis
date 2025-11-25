# AI 质量评估体系

> 💡 **前置阅读**: 本文档假设你已了解 Genesis 的 AI Agent 集成架构，如未阅读请先查看 [AI_INTEGRATION.md](./AI_INTEGRATION.md)

## 📋 快速开始（给 AI Agent 的实施指引）

### 前置依赖检查

在开始实施前，请确认以下依赖已存在：

- ✅ `apps/hercules/src/lib/engine/validator.ts` - Schema 校验器
- ✅ `apps/hercules/src/widgets/schemas.ts` - 组件 Schema 注册表
- ✅ `apps/zeus/src/lib/store.ts` - Zeus 编辑器状态管理
- ✅ `knowledge/agent-manual.md` - AI 可读的组件文档

### 实施顺序

本文档按照实施顺序组织，建议按 Phase 顺序实现：

1. **Phase 1 (MVP)**: 数据模型 → Self-Correction → Eval SDK → 埋点
2. **Phase 2 (完善)**: 评估器 → 测试集 → 命令行工具
3. **Phase 3 (工具化)**: Dashboard → 标注界面 → 数据库迁移
4. **Phase 4 (高级)**: LLM-as-Judge → A/B 测试 → 自动化优化

### 文件清单（按实施顺序）

#### Phase 1 文件
```
apps/jarvis/src/lib/
├── eval-types.ts           # 数据模型定义
├── ai-with-correction.ts   # Self-Correction Loop
├── eval-sdk.ts             # Eval SDK 核心
└── eval-storage.ts         # JSON 文件存储

apps/jarvis/src/routes/
├── ai.ts                   # 更新：集成 Eval 埋点
└── eval.ts                 # 新增：Eval API 路由

apps/zeus/src/components/
└── ChatPanel.tsx           # 更新：用户行为埋点
```

#### Phase 2 文件
```
apps/jarvis/src/lib/evaluators/
├── correctness-evaluator.ts  # 正确性评估
├── intent-evaluator.ts        # 意图匹配评估
└── quality-evaluator.ts       # 质量评估

apps/jarvis/eval/
└── datasets/
    └── base-test-cases.json   # 基础测试集

apps/jarvis/src/cli/
└── eval-stats.ts              # 命令行统计工具
```

#### Phase 3 文件
```
apps/jarvis/src/routes/
├── eval-dashboard.ts       # Dashboard 后端
└── eval-annotation.ts      # 标注界面后端

apps/jarvis/src/views/      # Dashboard 前端页面（可选）
├── dashboard.html
└── annotation.html
```

---

## 核心理念：Self-Correction + Eval 双保险

### Self-Correction（实时质量保障）

**目的**: 在返回给用户前自动修正 Schema 错误

**机制**: AI 生成 → Validator 校验 → 发现错误反馈给 AI → 重新生成（最多 2-3 次）

**价值**: 提高单次交互的成功率，减少用户看到的错误

### Eval（系统性质量评估）

**目的**: 长期监控 AI 能力，驱动 Prompt 和模型优化

**机制**: 记录所有交互（包括 Self-Correction 过程） → 离线分析 → 发现模式 → 优化策略

**价值**: 量化 AI 表现，指导技术决策

### 为什么两者互补？

1. **Self-Correction 提高 Eval 基准**: 到达用户手上的配置质量更高
2. **Eval 优化 Self-Correction**: 通过数据分析，减少需要修正的场景
3. **成本量化**: Eval 帮助评估 Self-Correction 的 ROI（Token 消耗 vs 质量提升）

---

## 系统架构

### 整体数据流

```
┌─────────────────────────────────────────────────────────────────┐
│ 1. 用户在 Zeus 中输入指令: "添加一个红色的大标题"                 │
└─────────────────────┬───────────────────────────────────────────┘
                      ▼
┌─────────────────────────────────────────────────────────────────┐
│ 2. Zeus 调用 Jarvis API                                         │
│    POST /api/ai/generate                                        │
│    Body: { prompt, currentConfig }                              │
└─────────────────────┬───────────────────────────────────────────┘
                      ▼
┌─────────────────────────────────────────────────────────────────┐
│ 3. [Jarvis] Eval SDK 记录开始                                   │
│    evalId = recordEvalStart({ prompt, currentConfig })          │
└─────────────────────┬───────────────────────────────────────────┘
                      ▼
┌─────────────────────────────────────────────────────────────────┐
│ 4. [Jarvis] Self-Correction Loop                                │
│    ├─ 第1次: callDify(prompt) → config1                        │
│    ├─ 校验: validateConfig(config1) → 失败（color格式错误）    │
│    ├─ 构建修正 Prompt: "color 应为 hex 格式"                    │
│    ├─ 第2次: callDify(correctionPrompt) → config2              │
│    └─ 校验: validateConfig(config2) → 成功 ✓                   │
└─────────────────────┬───────────────────────────────────────────┘
                      ▼
┌─────────────────────────────────────────────────────────────────┐
│ 5. [Jarvis] Eval SDK 记录结果                                   │
│    recordEvalResult(evalId, {                                   │
│      generatedConfig: config2,                                  │
│      correctionHistory: [attempt1, attempt2],                   │
│      autoEval: { correctness, intentMatch, quality }            │
│    })                                                           │
└─────────────────────┬───────────────────────────────────────────┘
                      ▼
┌─────────────────────────────────────────────────────────────────┐
│ 6. [Jarvis] 返回给 Zeus                                         │
│    Response: { evalId, config: config2 }                        │
└─────────────────────┬───────────────────────────────────────────┘
                      ▼
┌─────────────────────────────────────────────────────────────────┐
│ 7. [Zeus] 显示 Draft State                                      │
│    - setDraftConfig(config2)                                    │
│    - 用户在预览中看到效果                                        │
│    - 顶部显示 "接受" / "拒绝" 按钮                              │
│    - 埋点: trackEvent('ai_generation_completed', { evalId })   │
└─────────────────────┬───────────────────────────────────────────┘
                      ▼
┌─────────────────────────────────────────────────────────────────┐
│ 8. [Zeus] 用户操作                                              │
│    - 点击"接受" → commitDraft()                                 │
│    - 埋点: trackEvent('ai_draft_accepted', { evalId })         │
│    OR                                                           │
│    - 点击"拒绝" → rejectDraft()                                 │
│    - 埋点: trackEvent('ai_draft_rejected', { evalId })         │
└─────────────────────┬───────────────────────────────────────────┘
                      ▼
┌─────────────────────────────────────────────────────────────────┐
│ 9. [埋点系统] 数据汇总到 Eval 数据库                             │
│    - Jarvis 的 Eval 记录 (生成过程)                             │
│    - Zeus 的埋点数据 (用户行为)                                 │
│    - 通过 evalId 关联                                           │
└─────────────────────┬───────────────────────────────────────────┘
                      ▼
┌─────────────────────────────────────────────────────────────────┐
│ 10. [Eval Dashboard] 定期分析和报告                             │
│     - 计算核心指标（接受率、原始正确率等）                       │
│     - 生成趋势图表                                              │
│     - 识别需要优化的问题                                        │
└─────────────────────────────────────────────────────────────────┘
```

### 核心组件清单

| 组件 | 文件路径 | 职责 |
|------|---------|------|
| Eval Types | `apps/jarvis/src/lib/eval-types.ts` | 数据模型定义 |
| Self-Correction | `apps/jarvis/src/lib/ai-with-correction.ts` | AI 自我修正循环 |
| Eval SDK | `apps/jarvis/src/lib/eval-sdk.ts` | 记录、评估、查询 |
| Storage Layer | `apps/jarvis/src/lib/eval-storage.ts` | JSON 文件读写 |
| Correctness Evaluator | `apps/jarvis/src/lib/evaluators/correctness-evaluator.ts` | 正确性评估 |
| Intent Evaluator | `apps/jarvis/src/lib/evaluators/intent-evaluator.ts` | 意图匹配评估 |
| Quality Evaluator | `apps/jarvis/src/lib/evaluators/quality-evaluator.ts` | 质量评估 |
| AI Routes | `apps/jarvis/src/routes/ai.ts` | AI 生成 API（集成 Eval） |
| Eval Routes | `apps/jarvis/src/routes/eval.ts` | Eval 查询 API |
| Zeus埋点 | `apps/zeus/src/components/ChatPanel.tsx` | 用户行为采集 |

---

## Phase 1: 数据模型设计

### 步骤 1.1: 定义核心数据类型

**文件**: `apps/jarvis/src/lib/eval-types.ts`

**说明**: 这是整个 Eval 系统的基础，定义了所有数据结构。

```typescript
import type { PageConfig } from '@genesis/hercules/types';

// ============================================================================
// 核心 Eval 记录
// ============================================================================

/**
 * Eval 记录 - 包含一次 AI 生成的完整信息
 */
export interface EvalRecord {
  id: string;                           // UUID，唯一标识一次生成
  timestamp: number;                    // Unix timestamp (ms)，记录创建时间
  
  // ===== 输入 =====
  prompt: string;                       // 用户输入的自然语言指令
  currentConfig: PageConfig;            // AI 修改前的页面配置
  context?: {                           // 可选的上下文信息
    conversationId?: string;            // 对话 ID（多轮对话场景）
    userId?: string;                    // 用户 ID
    sessionId?: string;                 // 会话 ID
  };
  
  // ===== 输出 =====
  generatedConfig: PageConfig;          // AI 最终生成的配置（经过 Self-Correction）
  
  // ===== Self-Correction 相关 =====
  selfCorrection?: {
    enabled: boolean;                   // 是否启用了 Self-Correction
    attempts: number;                   // 总共尝试了几次（1 = 无修正，2+ = 有修正）
    history: CorrectionAttempt[];       // 每次尝试的详细记录
    finalSuccess: boolean;              // 最终是否通过 Schema 校验
    totalTokens: number;                // 总消耗的 Token 数
    totalTime: number;                  // 总耗时（ms）
  };
  
  // ===== 用户反馈 =====
  userAction?: 'accept' | 'reject' | 'modify';  // 用户的操作
  finalConfig?: PageConfig;             // 用户修改后的最终配置（如果有）
  userFeedback?: string;                // 用户文本反馈（可选）
  reviewDuration?: number;              // 用户审查时长（ms）
  
  // ===== 自动化评估 =====
  autoEval: {
    correctness: CorrectnessScore;      // 正确性评分（基于 Validator）
    intentMatch: IntentMatchScore;      // 意图匹配评分（规则引擎/LLM）
    quality: QualityScore;              // 质量评分（启发式规则）
  };
  
  // ===== 人工评估（可选，Phase 3）=====
  humanEval?: {
    correctness: number;                // 正确性评分 1-5
    intentMatch: number;                // 意图匹配评分 1-5
    quality: number;                    // 质量评分 1-5
    comments: string;                   // 评审意见
    annotator: string;                  // 标注人
    annotatedAt: number;                // 标注时间
  };
}

/**
 * Self-Correction 的单次尝试记录
 */
export interface CorrectionAttempt {
  attemptNumber: number;                // 第几次尝试（1, 2, 3...）
  generatedConfig: PageConfig;          // 这次生成的配置
  validationResult: ValidationResult;   // 校验结果
  correctionPrompt?: string;            // 如果失败，发给 AI 的修正提示
  success: boolean;                     // 这次是否通过校验
  tokens: number;                       // 这次消耗的 Token
  duration: number;                     // 这次耗时（ms）
}

/**
 * Validator 的校验结果（来自 Hercules）
 */
export interface ValidationResult {
  success: boolean;                     // 是否通过校验
  errors: string[];                     // 错误列表
  warnings: string[];                   // 警告列表
  report: string;                       // 中文错误报告（给 AI 看的）
}

// ============================================================================
// 评估分数
// ============================================================================

/**
 * 正确性评分 - 基于 Schema 校验
 */
export interface CorrectnessScore {
  schemaValid: boolean;                 // 是否通过 Schema 校验
  validationErrors: string[];           // 校验错误列表
  errorTypes: {                         // 错误类型统计
    typeErrors: number;                 // 类型错误数量
    missingRequired: number;            // 缺少必填字段数量
    enumMismatch: number;               // 枚举不匹配数量
    formatError: number;                // 格式错误数量
    other: number;                      // 其他错误数量
  };
  autoFixable: boolean;                 // 是否可通过 Self-Correction 修复
  score: number;                        // 0-100 分
}

/**
 * 意图匹配评分 - 评估 AI 是否理解了用户意图
 */
export interface IntentMatchScore {
  method: 'rule' | 'llm' | 'human';     // 评估方法
  componentTypeMatch: boolean;          // 组件类型是否匹配意图
  propertyMatch: number;                // 属性设置的匹配度 (0-1)
  structureMatch: number;               // 结构变化的合理性 (0-1)
  confidence: number;                   // 评估置信度 (0-1)
  score: number;                        // 0-100 分
  reason?: string;                      // 评分理由（LLM 生成）
}

/**
 * 质量评分 - 评估配置的整体质量
 */
export interface QualityScore {
  completeness: number;                 // 配置完整性 (0-1)，必填字段是否都有值
  reasonableness: number;               // 数值合理性 (0-1)，如高度>0、颜色格式正确
  consistency: number;                  // 与现有配置的一致性 (0-1)
  score: number;                        // 0-100 分
  issues: string[];                     // 发现的质量问题
}

// ============================================================================
// 查询和统计
// ============================================================================

/**
 * Eval 查询条件
 */
export interface EvalQuery {
  startTime?: number;                   // 开始时间（Unix timestamp）
  endTime?: number;                     // 结束时间
  userAction?: 'accept' | 'reject' | 'modify';  // 按用户操作筛选
  minScore?: number;                    // 最低分数
  maxScore?: number;                    // 最高分数
  hasErrors?: boolean;                  // 是否有错误
  limit?: number;                       // 返回数量限制
  offset?: number;                      // 分页偏移
}

/**
 * Eval 统计结果
 */
export interface EvalStats {
  totalRecords: number;                 // 总记录数
  timeRange: {
    start: number;
    end: number;
  };
  
  // ===== 核心指标 =====
  userAcceptanceRate: number;           // 用户接受率 (0-1)
  e2eSuccessRate: number;               // 端到端成功率 (0-1)
  firstShotCorrectness: number;         // 原始正确率 (0-1)
  
  // ===== Self-Correction 分析 =====
  selfCorrection: {
    averageAttempts: number;            // 平均修正次数
    correctionSuccessRate: number;      // 修正成功率 (0-1)
    distribution: {                     // 修正次数分布
      oneAttempt: number;               // 1次成功的比例
      twoAttempts: number;              // 2次成功的比例
      threeAttempts: number;            // 3次成功的比例
      failed: number;                   // 完全失败的比例
    };
  };
  
  // ===== 评分统计 =====
  scores: {
    correctness: {
      average: number;
      distribution: { [score: number]: number };  // 分数分布
    };
    intentMatch: {
      average: number;
      distribution: { [score: number]: number };
    };
    quality: {
      average: number;
      distribution: { [score: number]: number };
    };
  };
  
  // ===== 错误分析 =====
  errorAnalysis: {
    topErrors: Array<{
      error: string;
      count: number;
      percentage: number;
    }>;
    errorTypeDistribution: {
      typeErrors: number;
      missingRequired: number;
      enumMismatch: number;
      formatError: number;
      other: number;
    };
  };
  
  // ===== 性能指标 =====
  performance: {
    averageResponseTime: number;        // 平均响应时间（ms）
    p50: number;                        // 中位数
    p90: number;                        // 90分位
    p99: number;                        // 99分位
  };
}

// ============================================================================
// 测试数据集
// ============================================================================

/**
 * 测试用例定义
 */
export interface TestCase {
  id: string;                           // 用例 ID
  category: string;                     // 分类：add_component, modify_property, etc.
  description: string;                  // 用例描述
  prompt: string;                       // 测试指令
  currentConfig: PageConfig;            // 初始配置
  expectedResult: {
    components?: string[];              // 期望包含的组件类型
    properties?: Record<string, any>;   // 期望的属性值
    changes?: Record<string, any>;      // 期望的变化
  };
  tags: string[];                       // 标签（如：basic, advanced, edge-case）
}

/**
 * 测试集定义
 */
export interface TestDataset {
  name: string;                         // 数据集名称
  version: string;                      // 版本号
  description: string;                  // 描述
  cases: TestCase[];                    // 测试用例列表
  createdAt: number;                    // 创建时间
  updatedAt: number;                    // 更新时间
}
```

### 步骤 1.2: 引用现有的类型

**说明**: 确认项目中已有的类型定义，避免重复。

**已有类型（来自 Hercules）**:
- `PageConfig`: `apps/hercules/src/lib/types.ts` - 页面配置类型（Floor 数组）
- `Floor`: `apps/hercules/src/lib/engine/types.ts` - 单个楼层定义

**使用方式**:
```typescript
// 在 eval-types.ts 中导入
import type { PageConfig } from '@genesis/hercules/types';
// 或者根据实际的导出路径调整
```

---

## Phase 1: Self-Correction Loop 实现

### 步骤 2.1: 实现 Dify 客户端（占位）

**文件**: `apps/jarvis/src/lib/dify-client.ts`

**说明**: 这个文件封装了对 Dify API 的调用。目前可以先实现一个占位版本，等真正接入 Dify 时再填充。

```typescript
import type { PageConfig } from '@genesis/hercules/types';

/**
 * Dify API 配置
 */
interface DifyConfig {
  apiUrl: string;
  apiKey: string;
  workflowId: string;
}

/**
 * Dify API 请求参数
 */
interface DifyRequest {
  prompt: string;                       // 用户指令或修正提示
  currentConfig: PageConfig;            // 当前页面配置
  conversationId?: string;              // 对话 ID（多轮对话）
}

/**
 * Dify API 响应
 */
interface DifyResponse {
  config: PageConfig;                   // 生成的配置
  tokens: number;                       // 消耗的 Token 数
  duration: number;                     // 耗时（ms）
}

/**
 * 调用 Dify API 生成配置
 * 
 * @param request - 请求参数
 * @returns 生成的配置和元信息
 */
export async function callDifyAPI(
  request: DifyRequest
): Promise<DifyResponse> {
  // TODO: 实现真实的 Dify API 调用
  // 目前返回模拟数据
  
  const startTime = Date.now();
  
  // 模拟网络延迟
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // 模拟生成配置（占位实现）
  const config: PageConfig = [
    {
      id: `floor_${Date.now()}`,
      type: 1, // Text 组件
      data: {
        content: '这是 AI 生成的占位内容',
        align: 'center',
        size: 'lg',
      },
    },
  ];
  
  const duration = Date.now() - startTime;
  
  return {
    config,
    tokens: 150, // 模拟 Token 消耗
    duration,
  };
}

/**
 * 获取 Dify 配置（从环境变量）
 */
export function getDifyConfig(): DifyConfig {
  return {
    apiUrl: process.env.DIFY_API_URL || 'https://api.dify.ai',
    apiKey: process.env.DIFY_API_KEY || '',
    workflowId: process.env.DIFY_WORKFLOW_ID || '',
  };
}
```

### 步骤 2.2: 实现 Self-Correction Loop

**文件**: `apps/jarvis/src/lib/ai-with-correction.ts`

**说明**: 核心的自我修正循环，会多次调用 Dify 直到配置通过校验或达到最大重试次数。

```typescript
import type { PageConfig } from '@genesis/hercules/types';
import type { CorrectionAttempt, ValidationResult } from './eval-types';
import { callDifyAPI } from './dify-client';
import { validatePageConfig } from './validation-helper';

/**
 * Self-Correction 配置
 */
interface CorrectionConfig {
  maxAttempts: number;                  // 最多尝试几次（默认 3）
  enabled: boolean;                     // 是否启用 Self-Correction
}

/**
 * Self-Correction 结果
 */
export interface CorrectionResult {
  config: PageConfig;                   // 最终配置
  success: boolean;                     // 是否成功（通过校验）
  attempts: number;                     // 总共尝试了几次
  history: CorrectionAttempt[];         // 每次尝试的详细记录
  totalTokens: number;                  // 总消耗 Token
  totalTime: number;                    // 总耗时（ms）
}

/**
 * 使用 Self-Correction 生成配置
 * 
 * @param prompt - 用户指令
 * @param currentConfig - 当前页面配置
 * @param config - Self-Correction 配置
 * @returns 生成结果（包含修正历史）
 */
export async function generateConfigWithCorrection(
  prompt: string,
  currentConfig: PageConfig,
  config: CorrectionConfig = { maxAttempts: 3, enabled: true }
): Promise<CorrectionResult> {
  const startTime = Date.now();
  const history: CorrectionAttempt[] = [];
  let totalTokens = 0;
  
  // 如果禁用 Self-Correction，只尝试一次
  const maxAttempts = config.enabled ? config.maxAttempts : 1;
  
  for (let i = 0; i < maxAttempts; i++) {
    const attemptNumber = i + 1;
    const attemptStartTime = Date.now();
    
    // 构建 Prompt（第一次用原始指令，后续加上错误反馈）
    const fullPrompt = attemptNumber === 1
      ? prompt
      : buildCorrectionPrompt(prompt, history[i - 1]);
    
    // 调用 Dify 生成配置
    const difyResponse = await callDifyAPI({
      prompt: fullPrompt,
      currentConfig,
    });
    
    totalTokens += difyResponse.tokens;
    
    // 校验生成的配置
    const validationResult = validatePageConfig(difyResponse.config);
    
    const attemptDuration = Date.now() - attemptStartTime;
    
    // 记录本次尝试
    const attempt: CorrectionAttempt = {
      attemptNumber,
      generatedConfig: difyResponse.config,
      validationResult,
      correctionPrompt: attemptNumber > 1 ? fullPrompt : undefined,
      success: validationResult.success,
      tokens: difyResponse.tokens,
      duration: attemptDuration,
    };
    
    history.push(attempt);
    
    // 如果成功，直接返回
    if (validationResult.success) {
      return {
        config: difyResponse.config,
        success: true,
        attempts: attemptNumber,
        history,
        totalTokens,
        totalTime: Date.now() - startTime,
      };
    }
    
    // 如果是最后一次尝试，也返回（即使失败）
    if (attemptNumber === maxAttempts) {
      console.warn(
        `[Self-Correction] 达到最大尝试次数 (${maxAttempts})，仍未通过校验`
      );
      
      return {
        config: difyResponse.config,  // 返回最后一次的结果
        success: false,
        attempts: maxAttempts,
        history,
        totalTokens,
        totalTime: Date.now() - startTime,
      };
    }
    
    // 否则继续下一次修正
    console.log(
      `[Self-Correction] 第 ${attemptNumber} 次尝试失败，准备修正...`
    );
  }
  
  // 理论上不会到这里
  throw new Error('[Self-Correction] Unexpected: loop ended without return');
}

/**
 * 构建修正 Prompt
 * 
 * 根据上一次的校验错误，构建结构化的错误反馈，让 AI 能理解并修正
 */
function buildCorrectionPrompt(
  originalPrompt: string,
  lastAttempt: CorrectionAttempt
): string {
  const { validationResult, generatedConfig } = lastAttempt;
  
  // 使用 Validator 返回的中文报告（validator.ts 中的 formatZodError）
  const errorReport = validationResult.report;
  
  return `
${originalPrompt}

【重要】上一次生成的配置有以下错误，请修正：

${errorReport}

上一次生成的配置（参考，请修正错误的部分）：
\`\`\`json
${JSON.stringify(generatedConfig, null, 2)}
\`\`\`

请重新生成完全符合 Schema 规范的配置，确保：
1. 所有字段类型正确
2. 必填字段都有值
3. 枚举值在允许范围内
4. 格式符合要求（如 URL、颜色等）

只输出 JSON 配置，不要包含其他文本。
`.trim();
}
```

### 步骤 2.3: 实现校验辅助函数

**文件**: `apps/jarvis/src/lib/validation-helper.ts`

**说明**: 封装对 Hercules Validator 的调用，统一校验整个 PageConfig。

```typescript
import type { PageConfig } from '@genesis/hercules/types';
import type { ValidationResult } from './eval-types';
import { validateFloorConfig } from '@genesis/hercules/lib/engine/validator';

/**
 * 校验整个页面配置
 * 
 * @param config - 页面配置（Floor 数组）
 * @returns 校验结果
 */
export function validatePageConfig(config: PageConfig): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const reports: string[] = [];
  
  // 校验每个 Floor
  for (const floor of config) {
    const result = validateFloorConfig(floor.type, floor.data);
    
    if (!result.success) {
      errors.push(`Floor ${floor.id} (type ${floor.type}): 校验失败`);
      reports.push(result.report);
    }
  }
  
  // 汇总报告
  const report = reports.length > 0
    ? reports.join('\n\n')
    : '所有配置均通过 Schema 校验';
  
  return {
    success: errors.length === 0,
    errors,
    warnings,
    report,
  };
}
```

---

## Phase 1: Eval SDK 实现

### 步骤 3.1: 实现存储层（JSON 文件）

**文件**: `apps/jarvis/src/lib/eval-storage.ts`

**说明**: Phase 1 使用简单的 JSON 文件存储，Phase 3 会迁移到 SQLite。

```typescript
import fs from 'node:fs/promises';
import path from 'node:path';
import type { EvalRecord, EvalQuery, EvalStats } from './eval-types';

/**
 * Eval 数据存储目录
 */
const EVAL_DATA_DIR = path.join(process.cwd(), 'eval', 'records');

/**
 * 确保数据目录存在
 */
async function ensureDataDir(): Promise<void> {
  try {
    await fs.mkdir(EVAL_DATA_DIR, { recursive: true });
  } catch (error) {
    console.error('[Eval Storage] 创建数据目录失败:', error);
  }
}

/**
 * 保存 Eval 记录
 */
export async function saveEvalRecord(record: EvalRecord): Promise<void> {
  await ensureDataDir();
  
  const filename = `${record.id}.json`;
  const filepath = path.join(EVAL_DATA_DIR, filename);
  
  await fs.writeFile(filepath, JSON.stringify(record, null, 2), 'utf-8');
}

/**
 * 读取单个 Eval 记录
 */
export async function loadEvalRecord(id: string): Promise<EvalRecord | null> {
  const filename = `${id}.json`;
  const filepath = path.join(EVAL_DATA_DIR, filename);
  
  try {
    const content = await fs.readFile(filepath, 'utf-8');
    return JSON.parse(content) as EvalRecord;
  } catch (error) {
    return null;
  }
}

/**
 * 查询 Eval 记录
 */
export async function queryEvalRecords(
  query: EvalQuery = {}
): Promise<EvalRecord[]> {
  await ensureDataDir();
  
  // 读取所有记录文件
  const files = await fs.readdir(EVAL_DATA_DIR);
  const jsonFiles = files.filter(f => f.endsWith('.json'));
  
  const records: EvalRecord[] = [];
  
  for (const file of jsonFiles) {
    const filepath = path.join(EVAL_DATA_DIR, file);
    try {
      const content = await fs.readFile(filepath, 'utf-8');
      const record = JSON.parse(content) as EvalRecord;
      
      // 应用筛选条件
      if (matchesQuery(record, query)) {
        records.push(record);
      }
    } catch (error) {
      console.error(`[Eval Storage] 读取文件失败: ${file}`, error);
    }
  }
  
  // 按时间倒序排序
  records.sort((a, b) => b.timestamp - a.timestamp);
  
  // 应用分页
  const { limit = 100, offset = 0 } = query;
  return records.slice(offset, offset + limit);
}

/**
 * 检查记录是否匹配查询条件
 */
function matchesQuery(record: EvalRecord, query: EvalQuery): boolean {
  // 时间范围筛选
  if (query.startTime && record.timestamp < query.startTime) {
    return false;
  }
  if (query.endTime && record.timestamp > query.endTime) {
    return false;
  }
  
  // 用户操作筛选
  if (query.userAction && record.userAction !== query.userAction) {
    return false;
  }
  
  // 分数筛选
  const overallScore = (
    record.autoEval.correctness.score +
    record.autoEval.intentMatch.score +
    record.autoEval.quality.score
  ) / 3;
  
  if (query.minScore && overallScore < query.minScore) {
    return false;
  }
  if (query.maxScore && overallScore > query.maxScore) {
    return false;
  }
  
  // 错误筛选
  if (query.hasErrors !== undefined) {
    const hasErrors = !record.autoEval.correctness.schemaValid;
    if (query.hasErrors !== hasErrors) {
      return false;
    }
  }
  
  return true;
}

/**
 * 计算统计数据
 */
export async function calculateStats(
  query: EvalQuery = {}
): Promise<EvalStats> {
  const records = await queryEvalRecords({ ...query, limit: 10000 });
  
  if (records.length === 0) {
    return getEmptyStats();
  }
  
  // 计算各项指标...
  // （完整实现见下面的详细代码）
  
  return {
    totalRecords: records.length,
    timeRange: {
      start: Math.min(...records.map(r => r.timestamp)),
      end: Math.max(...records.map(r => r.timestamp)),
    },
    userAcceptanceRate: calculateAcceptanceRate(records),
    e2eSuccessRate: calculateE2ESuccessRate(records),
    firstShotCorrectness: calculateFirstShotCorrectness(records),
    selfCorrection: analyzeSelfCorrection(records),
    scores: analyzeScores(records),
    errorAnalysis: analyzeErrors(records),
    performance: analyzePerformance(records),
  };
}

// 辅助函数（简化实现）

function getEmptyStats(): EvalStats {
  return {
    totalRecords: 0,
    timeRange: { start: 0, end: 0 },
    userAcceptanceRate: 0,
    e2eSuccessRate: 0,
    firstShotCorrectness: 0,
    selfCorrection: {
      averageAttempts: 0,
      correctionSuccessRate: 0,
      distribution: {
        oneAttempt: 0,
        twoAttempts: 0,
        threeAttempts: 0,
        failed: 0,
      },
    },
    scores: {
      correctness: { average: 0, distribution: {} },
      intentMatch: { average: 0, distribution: {} },
      quality: { average: 0, distribution: {} },
    },
    errorAnalysis: {
      topErrors: [],
      errorTypeDistribution: {
        typeErrors: 0,
        missingRequired: 0,
        enumMismatch: 0,
        formatError: 0,
        other: 0,
      },
    },
    performance: {
      averageResponseTime: 0,
      p50: 0,
      p90: 0,
      p99: 0,
    },
  };
}

function calculateAcceptanceRate(records: EvalRecord[]): number {
  const acceptedCount = records.filter(r => r.userAction === 'accept').length;
  return acceptedCount / records.length;
}

function calculateE2ESuccessRate(records: EvalRecord[]): number {
  const successCount = records.filter(
    r => r.autoEval.correctness.schemaValid && r.userAction === 'accept'
  ).length;
  return successCount / records.length;
}

function calculateFirstShotCorrectness(records: EvalRecord[]): number {
  const firstShotSuccessCount = records.filter(
    r => r.selfCorrection && r.selfCorrection.history[0]?.success
  ).length;
  return firstShotSuccessCount / records.length;
}

function analyzeSelfCorrection(records: EvalRecord[]) {
  const withCorrection = records.filter(r => r.selfCorrection);
  
  if (withCorrection.length === 0) {
    return {
      averageAttempts: 0,
      correctionSuccessRate: 0,
      distribution: {
        oneAttempt: 0,
        twoAttempts: 0,
        threeAttempts: 0,
        failed: 0,
      },
    };
  }
  
  const totalAttempts = withCorrection.reduce(
    (sum, r) => sum + (r.selfCorrection?.attempts || 1),
    0
  );
  
  const distribution = {
    oneAttempt: 0,
    twoAttempts: 0,
    threeAttempts: 0,
    failed: 0,
  };
  
  withCorrection.forEach(r => {
    const attempts = r.selfCorrection?.attempts || 1;
    const success = r.selfCorrection?.finalSuccess;
    
    if (attempts === 1 && success) distribution.oneAttempt++;
    else if (attempts === 2 && success) distribution.twoAttempts++;
    else if (attempts === 3 && success) distribution.threeAttempts++;
    else distribution.failed++;
  });
  
  return {
    averageAttempts: totalAttempts / withCorrection.length,
    correctionSuccessRate:
      (distribution.oneAttempt + distribution.twoAttempts + distribution.threeAttempts) /
      withCorrection.length,
    distribution: {
      oneAttempt: distribution.oneAttempt / withCorrection.length,
      twoAttempts: distribution.twoAttempts / withCorrection.length,
      threeAttempts: distribution.threeAttempts / withCorrection.length,
      failed: distribution.failed / withCorrection.length,
    },
  };
}

function analyzeScores(records: EvalRecord[]) {
  const correctnessScores = records.map(r => r.autoEval.correctness.score);
  const intentScores = records.map(r => r.autoEval.intentMatch.score);
  const qualityScores = records.map(r => r.autoEval.quality.score);
  
  return {
    correctness: {
      average: average(correctnessScores),
      distribution: buildDistribution(correctnessScores),
    },
    intentMatch: {
      average: average(intentScores),
      distribution: buildDistribution(intentScores),
    },
    quality: {
      average: average(qualityScores),
      distribution: buildDistribution(qualityScores),
    },
  };
}

function analyzeErrors(records: EvalRecord[]) {
  const allErrors: string[] = [];
  const errorTypes = {
    typeErrors: 0,
    missingRequired: 0,
    enumMismatch: 0,
    formatError: 0,
    other: 0,
  };
  
  records.forEach(r => {
    allErrors.push(...r.autoEval.correctness.validationErrors);
    
    const types = r.autoEval.correctness.errorTypes;
    errorTypes.typeErrors += types.typeErrors;
    errorTypes.missingRequired += types.missingRequired;
    errorTypes.enumMismatch += types.enumMismatch;
    errorTypes.formatError += types.formatError;
    errorTypes.other += types.other;
  });
  
  // 统计错误频率
  const errorCounts = new Map<string, number>();
  allErrors.forEach(error => {
    errorCounts.set(error, (errorCounts.get(error) || 0) + 1);
  });
  
  // Top 10 错误
  const topErrors = Array.from(errorCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([error, count]) => ({
      error,
      count,
      percentage: count / records.length,
    }));
  
  return {
    topErrors,
    errorTypeDistribution: errorTypes,
  };
}

function analyzePerformance(records: EvalRecord[]) {
  const responseTimes = records
    .map(r => r.selfCorrection?.totalTime || 0)
    .filter(t => t > 0)
    .sort((a, b) => a - b);
  
  return {
    averageResponseTime: average(responseTimes),
    p50: percentile(responseTimes, 50),
    p90: percentile(responseTimes, 90),
    p99: percentile(responseTimes, 99),
  };
}

// 数学辅助函数

function average(numbers: number[]): number {
  if (numbers.length === 0) return 0;
  return numbers.reduce((sum, n) => sum + n, 0) / numbers.length;
}

function percentile(sortedNumbers: number[], p: number): number {
  if (sortedNumbers.length === 0) return 0;
  const index = Math.ceil((sortedNumbers.length * p) / 100) - 1;
  return sortedNumbers[Math.max(0, index)];
}

function buildDistribution(scores: number[]): Record<number, number> {
  const distribution: Record<number, number> = {};
  scores.forEach(score => {
    const bucket = Math.floor(score / 10) * 10;
    distribution[bucket] = (distribution[bucket] || 0) + 1;
  });
  return distribution;
}
```

### 步骤 3.2: 实现 Eval SDK 核心

**文件**: `apps/jarvis/src/lib/eval-sdk.ts`

**说明**: Eval SDK 是整个系统的核心，提供记录、评估、查询等功能。

```typescript
import { v4 as uuidv4 } from 'uuid';
import type { PageConfig } from '@genesis/hercules/types';
import type {
  EvalRecord,
  CorrectionAttempt,
  CorrectnessScore,
  IntentMatchScore,
  QualityScore,
  EvalQuery,
  EvalStats,
} from './eval-types';
import {
  saveEvalRecord,
  loadEvalRecord,
  queryEvalRecords,
  calculateStats,
} from './eval-storage';
import { evaluateCorrectness } from './evaluators/correctness-evaluator';
import { evaluateIntentMatch } from './evaluators/intent-evaluator';
import { evaluateQuality } from './evaluators/quality-evaluator';

/**
 * Eval SDK - 核心接口
 */
export class EvalSDK {
  /**
   * 记录 Eval 开始
   * 
   * @param data - 初始数据（prompt 和 currentConfig）
   * @returns evalId - 用于后续关联
   */
  async recordEvalStart(data: {
    prompt: string;
    currentConfig: PageConfig;
    context?: {
      conversationId?: string;
      userId?: string;
      sessionId?: string;
    };
  }): Promise<string> {
    const evalId = uuidv4();
    const timestamp = Date.now();
    
    // 创建初始记录（部分字段后续填充）
    const record: Partial<EvalRecord> = {
      id: evalId,
      timestamp,
      prompt: data.prompt,
      currentConfig: data.currentConfig,
      context: data.context,
    };
    
    // 暂存（Phase 1 可以先不保存，等有完整数据再保存）
    // 或者保存一个临时版本
    
    console.log(`[Eval SDK] 开始记录: ${evalId}`);
    
    return evalId;
  }
  
  /**
   * 记录 Eval 结果
   * 
   * @param evalId - 之前返回的 evalId
   * @param result - 生成结果和评估数据
   */
  async recordEvalResult(
    evalId: string,
    result: {
      generatedConfig: PageConfig;
      correctionHistory?: CorrectionAttempt[];
      selfCorrectionEnabled?: boolean;
    }
  ): Promise<void> {
    // 读取之前的部分记录（如果有）
    const existingRecord = await loadEvalRecord(evalId);
    
    if (!existingRecord) {
      console.error(`[Eval SDK] 找不到 evalId: ${evalId}`);
      return;
    }
    
    // 自动化评估
    const correctness = await evaluateCorrectness(result.generatedConfig);
    const intentMatch = await evaluateIntentMatch(
      existingRecord.prompt,
      existingRecord.currentConfig,
      result.generatedConfig
    );
    const quality = await evaluateQuality(result.generatedConfig);
    
    // 分析 Self-Correction
    const selfCorrection = result.correctionHistory
      ? {
          enabled: result.selfCorrectionEnabled !== false,
          attempts: result.correctionHistory.length,
          history: result.correctionHistory,
          finalSuccess: result.correctionHistory[result.correctionHistory.length - 1]?.success || false,
          totalTokens: result.correctionHistory.reduce((sum, h) => sum + h.tokens, 0),
          totalTime: result.correctionHistory.reduce((sum, h) => sum + h.duration, 0),
        }
      : undefined;
    
    // 完整记录
    const completeRecord: EvalRecord = {
      ...existingRecord,
      generatedConfig: result.generatedConfig,
      selfCorrection,
      autoEval: {
        correctness,
        intentMatch,
        quality,
      },
    };
    
    // 保存
    await saveEvalRecord(completeRecord);
    
    console.log(`[Eval SDK] 记录完成: ${evalId}`);
  }
  
  /**
   * 更新用户操作
   * 
   * @param evalId - evalId
   * @param action - 用户操作（accept/reject/modify）
   * @param data - 额外数据
   */
  async recordUserAction(
    evalId: string,
    action: 'accept' | 'reject' | 'modify',
    data?: {
      finalConfig?: PageConfig;
      reviewDuration?: number;
      feedback?: string;
    }
  ): Promise<void> {
    const record = await loadEvalRecord(evalId);
    
    if (!record) {
      console.error(`[Eval SDK] 找不到 evalId: ${evalId}`);
      return;
    }
    
    // 更新用户反馈
    record.userAction = action;
    record.finalConfig = data?.finalConfig;
    record.reviewDuration = data?.reviewDuration;
    record.userFeedback = data?.feedback;
    
    // 保存
    await saveEvalRecord(record);
    
    console.log(`[Eval SDK] 用户操作记录: ${evalId} - ${action}`);
  }
  
  /**
   * 添加人工评估
   * 
   * @param evalId - evalId
   * @param humanEval - 人工评估数据
   */
  async addHumanEval(
    evalId: string,
    humanEval: {
      correctness: number;
      intentMatch: number;
      quality: number;
      comments: string;
      annotator: string;
    }
  ): Promise<void> {
    const record = await loadEvalRecord(evalId);
    
    if (!record) {
      console.error(`[Eval SDK] 找不到 evalId: ${evalId}`);
      return;
    }
    
    record.humanEval = {
      ...humanEval,
      annotatedAt: Date.now(),
    };
    
    await saveEvalRecord(record);
    
    console.log(`[Eval SDK] 人工评估记录: ${evalId}`);
  }
  
  /**
   * 查询 Eval 记录
   */
  async query(query: EvalQuery = {}): Promise<EvalRecord[]> {
    return queryEvalRecords(query);
  }
  
  /**
   * 获取统计数据
   */
  async getStats(query: EvalQuery = {}): Promise<EvalStats> {
    return calculateStats(query);
  }
  
  /**
   * 获取单条记录
   */
  async getRecord(evalId: string): Promise<EvalRecord | null> {
    return loadEvalRecord(evalId);
  }
}

// 导出单例
export const evalSdk = new EvalSDK();
```

---

## Phase 1: 评估器实现

### 步骤 4.1: 正确性评估器

**文件**: `apps/jarvis/src/lib/evaluators/correctness-evaluator.ts`

**说明**: 基于 Hercules Validator 评估 AI 生成配置的正确性。

```typescript
import type { PageConfig } from '@genesis/hercules/types';
import type { CorrectnessScore } from '../eval-types';
import { validatePageConfig } from '../validation-helper';

/**
 * 评估配置的正确性
 */
export async function evaluateCorrectness(
  config: PageConfig
): Promise<CorrectnessScore> {
  const validationResult = validatePageConfig(config);
  
  // 分析错误类型
  const errorTypes = {
    typeErrors: 0,
    missingRequired: 0,
    enumMismatch: 0,
    formatError: 0,
    other: 0,
  };
  
  validationResult.errors.forEach(error => {
    if (error.includes('type')) errorTypes.typeErrors++;
    else if (error.includes('required') || error.includes('必填')) errorTypes.missingRequired++;
    else if (error.includes('enum') || error.includes('枚举')) errorTypes.enumMismatch++;
    else if (error.includes('format') || error.includes('格式')) errorTypes.formatError++;
    else errorTypes.other++;
  });
  
  const totalErrors = validationResult.errors.length;
  const score = validationResult.success ? 100 : Math.max(0, 100 - totalErrors * 10);
  const autoFixable = totalErrors > 0 && totalErrors <= 3 && errorTypes.other === 0;
  
  return {
    schemaValid: validationResult.success,
    validationErrors: validationResult.errors,
    errorTypes,
    autoFixable,
    score,
  };
}
```

### 步骤 4.2: 意图匹配评估器

**文件**: `apps/jarvis/src/lib/evaluators/intent-evaluator.ts`

```typescript
import type { PageConfig } from '@genesis/hercules/types';
import type { IntentMatchScore } from '../eval-types';

export async function evaluateIntentMatch(
  prompt: string,
  beforeConfig: PageConfig,
  afterConfig: PageConfig
): Promise<IntentMatchScore> {
  const componentTypeMatch = checkComponentTypeMatch(prompt, afterConfig);
  const propertyMatch = checkPropertyMatch(prompt, beforeConfig, afterConfig);
  const structureMatch = checkStructureMatch(prompt, beforeConfig, afterConfig);
  
  const score = Math.round(
    (componentTypeMatch ? 40 : 0) +
    propertyMatch * 30 +
    structureMatch * 30
  );
  
  return {
    method: 'rule',
    componentTypeMatch,
    propertyMatch,
    structureMatch,
    confidence: 0.7,
    score,
  };
}

function checkComponentTypeMatch(prompt: string, config: PageConfig): boolean {
  const lowerPrompt = prompt.toLowerCase();
  const keywords: Record<string, number[]> = {
    '文字': [1], '标题': [1],
    '图片': [2], '照片': [2],
    '按钮': [5],
    '视频': [6],
  };
  
  for (const [keyword, types] of Object.entries(keywords)) {
    if (lowerPrompt.includes(keyword)) {
      return config.some(floor => types.includes(floor.type));
    }
  }
  return false;
}

function checkPropertyMatch(prompt: string, before: PageConfig, after: PageConfig): number {
  const beforeJSON = JSON.stringify(before);
  const afterJSON = JSON.stringify(after);
  
  if (beforeJSON === afterJSON) return 0;
  
  const hasColorKeyword = /颜色|color|红色|蓝色|绿色/i.test(prompt);
  const hasColorChange = !/\"color\"/.test(beforeJSON) && /\"color\"/.test(afterJSON);
  
  if (hasColorKeyword && hasColorChange) return 1.0;
  return 0.5;
}

function checkStructureMatch(prompt: string, before: PageConfig, after: PageConfig): number {
  const beforeCount = before.length;
  const afterCount = after.length;
  
  if (/添加|新增|加上/i.test(prompt)) {
    return afterCount > beforeCount ? 1.0 : 0.3;
  }
  if (/删除|移除|去掉/i.test(prompt)) {
    return afterCount < beforeCount ? 1.0 : 0.3;
  }
  if (/修改|改成|变成/i.test(prompt)) {
    return afterCount === beforeCount ? 1.0 : 0.5;
  }
  return 0.8;
}
```

### 步骤 4.3: 质量评估器

**文件**: `apps/jarvis/src/lib/evaluators/quality-evaluator.ts`

```typescript
import type { PageConfig } from '@genesis/hercules/types';
import type { QualityScore } from '../eval-types';

export async function evaluateQuality(config: PageConfig): Promise<QualityScore> {
  const issues: string[] = [];
  
  const completeness = checkCompleteness(config, issues);
  const reasonableness = checkReasonableness(config, issues);
  const consistency = checkConsistency(config, issues);
  
  const score = Math.round(completeness * 40 + reasonableness * 30 + consistency * 30);
  
  return { completeness, reasonableness, consistency, score, issues };
}

function checkCompleteness(config: PageConfig, issues: string[]): number {
  let score = 1.0;
  for (const floor of config) {
    if (!floor.id) {
      issues.push(`Floor missing id`);
      score -= 0.1;
    }
    if (!floor.data) {
      issues.push(`Floor ${floor.id} missing data`);
      score -= 0.2;
    }
  }
  return Math.max(0, score);
}

function checkReasonableness(config: PageConfig, issues: string[]): number {
  let score = 1.0;
  for (const floor of config) {
    const data = floor.data as any;
    if (data.height !== undefined && data.height <= 0) {
      issues.push(`Floor ${floor.id}: height should be > 0`);
      score -= 0.1;
    }
    if (data.color && !/^#[0-9A-Fa-f]{6}$/.test(data.color)) {
      issues.push(`Floor ${floor.id}: invalid color format`);
      score -= 0.1;
    }
  }
  return Math.max(0, score);
}

function checkConsistency(config: PageConfig, issues: string[]): number {
  const ids = new Set<string>();
  let duplicates = 0;
  for (const floor of config) {
    if (ids.has(floor.id)) {
      issues.push(`Duplicate ID: ${floor.id}`);
      duplicates++;
    }
    ids.add(floor.id);
  }
  return duplicates === 0 ? 1.0 : Math.max(0, 1 - duplicates * 0.2);
}
```

---

## 完整的量化指标体系

### 核心业务指标

| 指标 | 定义 | 目标值 |
|------|------|--------|
| 用户接受率 (UAR) | accept / total | > 70% |
| 端到端成功率 (E2E Success) | (schema_valid AND accept) / total | > 60% |
| 原始正确率 (First-Shot Correctness) | first_attempt_valid / total | > 50% |
| Self-Correction 成功率 | corrected_and_valid / (total - first_valid) | > 80% |

### 基于指标的优化决策

```
1. UAR < 70%？
   → 检查 E2E Success 和 First-Shot Correctness
   → 分析错误类型分布
   → 优化 Prompt 或增强文档

2. Self-Correction 成功率 < 80%？
   → 分析无法修正的错误类型
   → 改进 Schema 示例或主 Prompt

3. 响应时间 P90 > 5000ms？
   → 分析 Token 消耗和修正次数
   → 优化初始 Prompt 或模型降级

4. 成本过高？
   → 减少 Self-Correction 次数
   → 使用更便宜的模型
```

---

## Phase 2-4 实施计划

### Phase 2: 完善评估和测试（3-4天）

- 创建基础测试集 (20+ 用例)
- 实现批量测试脚本
- 实现统计命令行工具

### Phase 3: Dashboard 和标注界面（5-7天）

- 迁移到 SQLite
- 实现 Dashboard 后端和前端
- 实现标注界面

### Phase 4: 高级功能（长期优化）

- 实现 LLM-as-Judge
- A/B 测试框架
- 自动化优化

---

## 实施检查清单

### Phase 1 完成标准

- [ ] 数据模型定义完整 (`eval-types.ts`)
- [ ] Self-Correction Loop 可运行 (`ai-with-correction.ts`)
- [ ] Eval SDK 核心功能实现 (`eval-sdk.ts`)
- [ ] JSON 文件存储可用 (`eval-storage.ts`)
- [ ] Validator 辅助函数封装 (`validation-helper.ts`)
- [ ] Dify 客户端占位实现 (`dify-client.ts`)
- [ ] 三个评估器实现 (`evaluators/*.ts`)
- [ ] Zeus 前端埋点完成 (`ChatPanel.tsx`)
- [ ] Jarvis AI 路由集成 Eval (`routes/ai.ts`)
- [ ] Jarvis Eval 路由实现 (`routes/eval.ts`)
- [ ] 手动测试：生成配置 → 查看 Eval 记录 → 验证数据完整

---

## 快速参考

### 关键文件位置

```
apps/jarvis/src/lib/
├── eval-types.ts           # ⭐ 所有类型定义
├── eval-sdk.ts             # ⭐ 核心 SDK
├── eval-storage.ts         # 存储层
├── ai-with-correction.ts   # Self-Correction
├── validation-helper.ts    # Validator 封装
├── dify-client.ts          # Dify API 客户端
└── evaluators/
    ├── correctness-evaluator.ts
    ├── intent-evaluator.ts
    └── quality-evaluator.ts

apps/hercules/src/lib/engine/
└── validator.ts            # ⭐ 已有的 Schema 校验器
```

### 数据流总结

```
用户指令
  → Zeus ChatPanel
    → POST /api/ai/generate (Jarvis)
      → evalSdk.recordEvalStart()
      → generateConfigWithCorrection()
      → evalSdk.recordEvalResult()
      → 返回 { evalId, config }
  → Zeus 展示 Draft
  → 用户操作
    → POST /api/eval/user-action
      → evalSdk.recordUserAction()
```

---

## 结语

这套 Eval 系统的设计目标：

1. **实用优先**: Phase 1 MVP 即可投入使用
2. **AI-Friendly**: 文档结构清晰，代码示例完整
3. **渐进增强**: 从简单到复杂，逐步迭代
4. **数据驱动**: 完整的量化指标体系

**下一步行动**:
1. 按照 Phase 1 的步骤顺序，逐个文件实现
2. 每完成一个模块，运行手动测试验证
3. Phase 1 稳定后，开始 Phase 2 测试集建设

祝实施顺利！🚀
