# Genesis 常见问题

本文档整理了 Genesis 平台开发和使用过程中的常见问题及解决方案。

## 📑 目录

- [环境搭建问题](#环境搭建问题)
- [开发调试问题](#开发调试问题)
- [组件开发问题](#组件开发问题)
- [部署问题](#部署问题)
- [性能优化问题](#性能优化问题)
- [AI 助手问题](#ai-助手问题)

---

## 环境搭建问题

### Q1: `pnpm install` 失败，提示依赖解析错误？

**症状**:
```
ERR_PNPM_PEER_DEP_ISSUES  Unmet peer dependencies
```

**原因**: pnpm 严格的依赖管理机制检测到peer依赖冲突

**解决方案**:

1. 检查 pnpm 版本（项目要求 >= 8.0）:
```bash
pnpm -v
```

2. 如果版本过低，升级 pnpm:
```bash
npm install -g pnpm@latest
```

3. 清理依赖缓存并重新安装:
```bash
rm -rf node_modules
rm pnpm-lock.yaml
pnpm install
```

4. 如果问题持续，检查 `.npmrc` 配置（已在项目中配置 `shamefully-hoist=true`）

---

### Q2: 启动项目时端口被占用？

**症状**:
```
Error: listen EADDRINUSE: address already in use :::3000
```

**原因**: 默认端口已被其他进程占用

**解决方案**:

**选项1: 关闭占用端口的进程**
```bash
# macOS/Linux: 查找占用 3000 端口的进程
lsof -ti:3000 | xargs kill

# Windows: 查找并结束进程
netstat -ano | findstr :3000
taskkill /PID <PID号> /F
```

**选项2: 更改项目端口**

修改对应应用的启动脚本或创建 `.env.local`:
```bash
# apps/zeus/.env.local
PORT=3003
```

---

### Q3: M1/M2 Mac 上依赖安装失败？

**症状**:
```
gyp ERR! stack Error: Could not find expected Python (searching for 'python3')
```

**原因**: 某些 Node.js 原生模块在 ARM 架构上需要额外配置

**解决方案**:

1. 安装 Xcode Command Line Tools:
```bash
xcode-select --install
```

2. 安装 Python 3（如果未安装）:
```bash
brew install python3
```

3. 清理并重新安装:
```bash
pnpm clean
pnpm install
```

---

## 开发调试问题

### Q4: Zeus 编辑器的预览区域空白？

**症状**: 中间的 iframe 预览区域不显示任何内容，或者显示"无法访问"错误

**可能原因**:
1. Hercules 未启动
2. 环境变量配置错误
3. CORS 问题

**解决方案**:

**步骤1**: 确认 Hercules 已启动
```bash
pnpm --filter hercules dev
```
访问 http://localhost:3001 确认 Hercules 可访问

**步骤2**: 检查环境变量（`apps/zeus/src/config.ts`）
```typescript
export const HERCULES_URL = process.env.NEXT_PUBLIC_HERCULES_URL || 'http://localhost:3001';
```

**步骤3**: 检查浏览器控制台是否有 iframe 加载错误

**步骤4**: 清除浏览器缓存并刷新页面

---

### Q5: 修改组件代码后预览不更新？

**症状**: 代码已保存，但 Zeus 编辑器中的预览未反映更改

**原因**: Next.js 热更新缓存问题

**解决方案**:

1. **检查是否是 Server Component**:
   - Server Components 的更改可能需要手动刷新 iframe

2. **强制刷新** iframe:
   - 在预览区域右键 → 重新加载框架
   - 或者刷新整个 Zeus 页面

3. **重启 Hercules** (如果问题持续):
```bash
# 停止 Hercules 的开发服务器 (Ctrl+C)
pnpm --filter hercules dev
```

4. **清除 Next.js 缓存**:
```bash
pnpm --filter hercules clean
```

---

### Q6: TypeScript 报错但代码运行正常？

**症状**: VSCode 显示 TypeScript 错误，但 `pnpm dev` 正常运行

**原因**: VSCode 使用的 TypeScript 版本与项目不一致

**解决方案**:

1. 使用项目的 TypeScript 版本:
   - 打开任意 `.ts` 文件
   - 点击右下角的 TypeScript 版本号
   - 选择 "Use Workspace Version"

2. 重启 TypeScript 服务器:
   - VSCode 命令面板 (Cmd/Ctrl + Shift + P)
   - 输入 "TypeScript: Restart TS Server"

3. 如果问题持续，检查 `tsconfig.json` 配置

---

## 组件开发问题

### Q7: AutoForm 不显示新增的 Schema 字段？

**症状**: 在组件的 Schema 中添加了新字段，但属性面板没有显示

**可能原因**:
1. 缓存问题
2. Schema 未正确导出
3. 注册表未更新

**解决方案**:

**步骤1**: 确认 Schema 已导出到 `src/widgets/schemas.ts`:
```typescript
export { YourComponentSchema } from './YourComponent/schema';
```

**步骤2**: 检查组件是否在 `component-map.ts` 中注册:
```typescript
import YourComponent from './YourComponent';
// ...
YourComponent: YourComponent,
```

**步骤3**: 重启开发服务器:
```bash
# Zeus
pnpm --filter zeus dev

# Hercules
pnpm --filter hercules dev
```

**步骤4**: 清除浏览器缓存并刷新页面

---

### Q8: Schema 元数据注解 (@labels, @unit) 不生效？

**症状**: 在 Schema 中添加了 `@labels` 或 `@unit`，但 AutoForm 没有显示

**可能原因**:
1. 注解语法错误
2. 解析逻辑问题

**解决方案**:

**检查注解语法**（参考 [SCHEMA_GUIDE.md](./SCHEMA_GUIDE.md)）:
```typescript
// ✅ 正确
z.string().describe('图片地址 @unit(px)')

// ✅ 正确
z.enum(['left', 'center', 'right']).describe('对齐方式 @labels({"left":"左对齐","center":"居中","right":"右对齐"})')

// ❌ 错误 (缺少空格)
z.string().describe('图片地址@unit(px)')

// ❌ 错误 (JSON 格式错误)
z.enum(...).describe('@labels({left:"左对齐"})')  // 键名需要双引号
```

**调试技巧**:

1. 在 `apps/zeus/src/lib/utils.ts` 的 `getSchemaMeta` 函数中添加 `console.log` 查看解析结果:
```typescript
export function getSchemaMeta(schema: ZodType): SchemaMetadata {
  const meta = // ...
  console.log('Schema Meta:', meta); // 调试日志
  return meta;
}
```

2. 检查浏览器控制台输出

---

### Q9: 组件在 Zeus 中显示正常，但在 Hercules 中报错？

**症状**: 组件在编辑器中可以编辑，但渲染时抛出异常

**可能原因**:
1. 使用了浏览器专属 API（如 `window`, `document`）在 Server Component 中
2. 数据格式不符合 Schema 定义
3. 缺少错误边界

**解决方案**:

**步骤1**: 检查是否在 Server Component 中使用了浏览器 API

错误示例:
```typescript
// ❌ 错误：Server Component 中使用 window
export default function MyComponent({ data }: Props) {
  const width = window.innerWidth; // 报错！
  return <div>...</div>;
}
```

正确做法:
```typescript
// ✅ 添加 "use client" 指令
"use client";

export default function MyComponent({ data }: Props) {
  const width = window.innerWidth;
  return <div>...</div>;
}
```

**步骤2**: 检查数据格式

在组件内部添加类型检查:
```typescript
export default function MyComponent({ data }: Props) {
  // 添加运行时校验
  const parsed = YourSchema.safeParse(data);
  if (!parsed.success) {
    console.error('Invalid data:', parsed.error);
    return <div>数据格式错误</div>;
  }
  return <div>...</div>;
}
```

**步骤3**: 使用 Error Boundary

Hercules 已经配置了全局 Error Boundary，但可以在具体组件中添加更细粒度的边界。

---

## 部署问题

### Q10: Vercel 部署后环境变量不生效？

**症状**: 本地开发正常，但部署到 Vercel 后出现 API 请求失败或 CORS 错误

**原因**: Vercel 环境变量未正确配置

**解决方案**:

**步骤1**: 进入 Vercel 项目设置
- 选择对应的项目
- 导航到 **Settings** → **Environment Variables**

**步骤2**: 添加环境变量（针对 Production、Preview、Development 环境）

对于 Zeus:
```
NEXT_PUBLIC_HERCULES_URL=https://your-hercules-app.vercel.app
NEXT_PUBLIC_API_BASE_URL=https://your-jarvis-app.vercel.app
```

对于 Hercules:
```
NEXT_PUBLIC_API_BASE_URL=https://your-jarvis-app.vercel.app
```

对于 Jarvis:
```
ALLOWED_ORIGINS=https://your-zeus-app.vercel.app,https://your-hercules-app.vercel.app
```

**步骤3**: **重新部署**

**重要**: 修改环境变量后必须重新部署，因为 Next.js 的环境变量在构建时注入。

- 导航到 **Deployments**
- 找到最新的部署，点击 **...** → **Redeploy**

---

### Q11: 部署后出现 CORS 错误？

**症状**:
```
Access to fetch at 'https://jarvis.vercel.app/api/...' 
from origin 'https://zeus.vercel.app' has been blocked by CORS policy
```

**原因**: Jarvis 的 `ALLOWED_ORIGINS` 未包含 Zeus 和 Hercules 的域名

**解决方案**:

**步骤1**: 确认所有应用的部署域名
- Zeus: `https://genesis-zeus.vercel.app`
- Hercules: `https://genesis-hercules.vercel.app`
- Jarvis: `https://genesis-jarvis.vercel.app`

**步骤2**: 在 Jarvis 的 Vercel 环境变量中配置 `ALLOWED_ORIGINS`

```
ALLOWED_ORIGINS=https://genesis-zeus.vercel.app,https://genesis-hercules.vercel.app
```

**注意**: 
- 多个域名用逗号分隔，**不要有空格**
- 包含完整协议 (`https://`)
- 不要在末尾添加斜杠

**步骤3**: 重新部署 Jarvis

---

### Q12: Vercel 部署失败，提示 "command not found: pnpm"？

**症状**: 部署日志显示找不到 `pnpm` 命令

**原因**: Vercel 未检测到项目使用 pnpm

**解决方案**:

**选项1: 确保 `pnpm-lock.yaml` 已提交到 Git**
```bash
git add pnpm-lock.yaml
git commit -m "Add pnpm-lock.yaml"
git push
```

**选项2: 在 Vercel 项目设置中手动指定**
- **Settings** → **General** → **Build & Development Settings**
- **Install Command**: 设置为 `pnpm install`

---

## 性能优化问题

### Q13: 页面加载速度慢？

**症状**: Hercules 渲染的页面首屏加载时间超过 3 秒

**可能原因**:
1. 图片未优化
2. 组件包过大
3. API 请求慢

**解决方案**:

**优化1: 使用 Next.js Image 组件**

将普通 `<img>` 替换为 Next.js 的 `<Image>`:
```typescript
import Image from 'next/image';

// ❌ 原始写法
<img src={data.src} alt={data.alt} />

// ✅ 优化后
<Image 
  src={data.src} 
  alt={data.alt} 
  width={800} 
  height={600}
  loading="lazy"
/>
```

**优化2: 代码分割**

对于大型组件，使用 `dynamic` 实现懒加载:
```typescript
import dynamic from 'next/dynamic';

const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <p>加载中...</p>,
  ssr: false // 如果不需要 SSR
});
```

**优化3: 缓存 API 请求**

在 Jarvis 中配置缓存头:
```typescript
c.header('Cache-Control', 'public, max-age=60, stale-while-revalidate=300');
```

---

### Q14: AutoForm 卡顿，输入延迟？

**症状**: 在属性面板中输入文字时有明显延迟

**原因**: 频繁的状态更新和重新渲染

**解决方案**:

**优化1: 添加防抖**

在 `AutoForm.tsx` 中对输入框添加防抖:
```typescript
import { useDebouncedCallback } from 'use-debounce';

const handleChange = useDebouncedCallback((value) => {
  onChange(value);
}, 300);
```

**优化2: 使用 React.memo**

对子组件进行 memo 优化:
```typescript
const InputField = React.memo(({ value, onChange }: Props) => {
  // ...
});
```

---

## AI 助手问题

### Q15: AI 助手无响应？

**症状**: 在 Zeus 的 Chat Panel 中发送指令后没有任何反应

**原因**: 当前 AI 助手是演示模式，不会调用真实 LLM API

**当前行为**（`apps/zeus/src/components/ChatPanel.tsx`）:
```typescript
// 模拟 Agent 响应：随机打乱配置
setTimeout(() => {
    setDraftConfig([...mockPageConfig].reverse()); 
}, 1000);
```

**未来计划**: 集成 Dify，实现真实的 AI 配置生成

**临时解决方案**:
- 确认延迟 1 秒后是否出现"Agent 提议的更改"提示条
- 如果仍无响应，检查浏览器控制台是否有JavaScript 错误

---

### Q16: AI 生成的配置不正确，如何调试？

**症状**: AI 生成的配置与预期不符，或者导致页面渲染错误

**原因**:
1. Agent 生成的 JSON 不符合 Schema
2. Validator 未拦截错误配置

**解决方案**:

**步骤1**: 检查 Draft Config

在 `ChatPanel.tsx` 中添加调试日志:
```typescript
setDraftConfig((config) => {
  console.log('AI 生成的配置:', config);
  return config;
});
```

**步骤2**: 运行 Validator

手动测试 Validator 逻辑（`apps/hercules/src/lib/validator.ts`）:
```typescript
import { validateConfig } from '@/lib/validator';

const result = validateConfig(aiGeneratedConfig);
if (!result.success) {
  console.error('校验失败:', result.errors);
}
```

**步骤3**: 优化 AI Prompt

未来接入 Dify 后，可以在 Agent Manual (`knowledge/agent-manual.md`) 中调整提示词，帮助 AI 生成更准确的配置。

---

## 其他常见问题

### Q17: 如何重置项目到初始状态？

**症状**: 项目出现不可恢复的错误，想要从头开始

**解决方案**:

```bash
# 1. 清理所有依赖和构建缓存
pnpm clean

# 2. 删除所有 node_modules 和 lock 文件
rm -rf node_modules pnpm-lock.yaml
find . -name "node_modules" -type d -prune -exec rm -rf '{}' +

# 3. 重新安装依赖
pnpm install

# 4. 重新启动开发服务器
pnpm dev
```

---

### Q18: 如何查看项目的依赖关系？

**症状**: 想了解 Monorepo 中各应用之间的依赖关系

**解决方案**:

使用 pnpm 的内置命令:
```bash
# 查看依赖树
pnpm list --depth=1

# 查看特定包的依赖
pnpm list --filter zeus --depth=2

# 检查为什么某个包被安装
pnpm why <package-name>
```

---

### Q19: 如何贡献代码？

**流程**:

1. Fork 项目
2. 创建功能分支:
```bash
git checkout -b feature/your-feature-name
```

3. 提交代码并遵循规范:
```bash
git commit -m "feat: add new component"
```

4. 推送到远程分支:
```bash
git push origin feature/your-feature-name
```

5. 创建 Pull Request

**注意事项**:
- 遵循项目的代码风格（使用 ESLint 和 Prettier）
- 为新组件编写 Schema 和 mock-data
- 更新相关文档（如 COMPONENT_GUIDE.md）
- 确保所有测试通过

---

### Q20: 如何报告 Bug？

当遇到问题时，请提供以下信息：

1. **环境信息**:
   - 操作系统和版本
   - Node.js 版本 (`node -v`)
   - pnpm 版本 (`pnpm -v`)

2. **问题描述**:
   - 预期行为
   - 实际行为
   - 复现步骤

3. **错误信息**:
   - 完整的错误堆栈
   - 浏览器控制台日志
   - 终端输出

4. **相关代码** (如果适用):
   - 组件代码
   - Schema 定义
   - 配置文件

---

## 📚 相关文档

- **[用户使用指南 (USER_GUIDE.md)](./USER_GUIDE.md)**: 了解如何使用 Genesis 平台
- **[环境变量配置 (ENVIRONMENT.md)](./ENVIRONMENT.md)**: 环境变量详细说明
- **[部署指南 (DEPLOYMENT.md)](./DEPLOYMENT.md)**: Vercel 部署流程
- **[组件开发指南 (COMPONENT_GUIDE.md)](./apps/hercules/COMPONENT_GUIDE.md)**: 如何创建新组件

---

## 🆘 仍需帮助？

如果以上 FAQ 没有解决你的问题，请：

1. 查阅相关文档（见上方链接）
2. 搜索 GitHub Issues
3. 创建新的 Issue 并提供详细信息
4. 联系技术支持团队

祝你使用愉快！🎉

