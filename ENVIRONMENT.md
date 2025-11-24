# 环境变量配置说明

本文档详细说明了 Genesis 平台各个应用所需的环境变量配置。

## 📋 环境变量概述

Genesis 采用 Monorepo 架构，包含三个独立应用，每个应用都有各自的环境变量配置需求：

- **Zeus (编辑器)**: 需要知道 Hercules 和 Jarvis 的地址
- **Hercules (渲染引擎)**: 需要知道 Jarvis 的地址
- **Jarvis (后端服务)**: 需要配置 CORS 和端口

---

## 🔧 开发环境配置

在本地开发时，大部分环境变量都有默认值，无需手动配置。但了解这些变量有助于理解系统如何运作。

### Zeus 环境变量

**文件位置**: `apps/zeus/.env.local` (可选创建)

| 变量名 | 说明 | 默认值 | 必需 |
|--------|------|--------|------|
| `NEXT_PUBLIC_HERCULES_URL` | Hercules 渲染引擎的地址 | `http://localhost:3001` | 否 |
| `NEXT_PUBLIC_API_BASE_URL` | Jarvis 后端服务的地址 | `http://localhost:3002` | 否 |

**配置示例** (`apps/zeus/.env.local`):

```bash
# Zeus 开发环境变量（可选）
NEXT_PUBLIC_HERCULES_URL=http://localhost:3001
NEXT_PUBLIC_API_BASE_URL=http://localhost:3002
```

**代码引用**: `apps/zeus/src/config.ts`

```typescript
export const HERCULES_URL = process.env.NEXT_PUBLIC_HERCULES_URL || 'http://localhost:3001';
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3002';
```

---

### Hercules 环境变量

**文件位置**: `apps/hercules/.env.local` (可选创建)

| 变量名 | 说明 | 默认值 | 必需 |
|--------|------|--------|------|
| `NEXT_PUBLIC_API_BASE_URL` | Jarvis 后端服务的地址 | `http://localhost:3002` | 否 |

**配置示例** (`apps/hercules/.env.local`):

```bash
# Hercules 开发环境变量（可选）
NEXT_PUBLIC_API_BASE_URL=http://localhost:3002
```

**代码引用**: `apps/hercules/src/config.ts`

```typescript
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3002';
```

---

### Jarvis 环境变量

**文件位置**: `apps/jarvis/.env` (可选创建)

| 变量名 | 说明 | 默认值 | 必需 |
|--------|------|--------|------|
| `PORT` | 服务运行端口 | `3002` | 否 |
| `ALLOWED_ORIGINS` | 允许跨域的域名列表（逗号分隔） | `http://localhost:3000,http://localhost:3001` | 否 |

**配置示例** (`apps/jarvis/.env`):

```bash
# Jarvis 开发环境变量（可选）
PORT=3002
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001
```

**代码引用**: `apps/jarvis/src/index.ts`

```typescript
const allowedOrigins = process.env.ALLOWED_ORIGINS 
  ? process.env.ALLOWED_ORIGINS.split(',') 
  : ['http://localhost:3000', 'http://localhost:3001'];

const port = Number(process.env.PORT) || 3002;
```

---

## 🚀 生产环境配置

在生产环境（如 Vercel）部署时，**必须**正确配置环境变量，否则各应用之间无法正常通信。

### 部署流程

推荐按照以下顺序部署：

1. **部署 Jarvis** → 获取 Jarvis 的线上地址
2. **部署 Hercules** → 配置 Jarvis 地址，获取 Hercules 的线上地址
3. **部署 Zeus** → 配置 Hercules 和 Jarvis 地址
4. **回填 Jarvis CORS** → 将 Zeus 和 Hercules 的地址添加到 Jarvis 的 `ALLOWED_ORIGINS`

---

### Zeus 生产环境变量

**配置位置**: Vercel 项目设置 → Environment Variables

| 变量名 | 示例值 | 说明 |
|--------|--------|------|
| `NEXT_PUBLIC_HERCULES_URL` | `https://genesis-hercules.vercel.app` | Hercules 的线上地址 |
| `NEXT_PUBLIC_API_BASE_URL` | `https://genesis-jarvis.vercel.app` | Jarvis 的线上地址 |

**Vercel 配置步骤**:

1. 进入 Zeus 项目的 Vercel 控制台
2. 导航到 **Settings** → **Environment Variables**
3. 添加以下变量（针对 Production、Preview、Development 环境）:
   - `NEXT_PUBLIC_HERCULES_URL`
   - `NEXT_PUBLIC_API_BASE_URL`
4. 点击 **Save** 并重新部署

---

### Hercules 生产环境变量

**配置位置**: Vercel 项目设置 → Environment Variables

| 变量名 | 示例值 | 说明 |
|--------|--------|------|
| `NEXT_PUBLIC_API_BASE_URL` | `https://genesis-jarvis.vercel.app` | Jarvis 的线上地址 |

**Vercel 配置步骤**:

1. 进入 Hercules 项目的 Vercel 控制台
2. 导航到 **Settings** → **Environment Variables**
3. 添加 `NEXT_PUBLIC_API_BASE_URL`
4. 点击 **Save** 并重新部署

---

### Jarvis 生产环境变量

**配置位置**: Vercel 项目设置 → Environment Variables

| 变量名 | 示例值 | 说明 |
|--------|--------|------|
| `ALLOWED_ORIGINS` | `https://genesis-zeus.vercel.app,https://genesis-hercules.vercel.app` | Zeus 和 Hercules 的线上地址（逗号分隔） |
| `PORT` | （无需配置） | Vercel 自动管理 |

**Vercel 配置步骤**:

1. 进入 Jarvis 项目的 Vercel 控制台
2. 导航到 **Settings** → **Environment Variables**
3. 添加 `ALLOWED_ORIGINS`，值为 Zeus 和 Hercules 的域名（逗号分隔，无空格）
4. 点击 **Save** 并重新部署

**重要提示**: `ALLOWED_ORIGINS` 必须包含所有需要访问 Jarvis API 的前端应用域名，否则会遇到 CORS 错误。

---

## ✅ 配置验证

### 如何检查配置是否正确

#### 1. 检查 Zeus 编辑器

访问 Zeus 编辑器，打开浏览器开发者工具：

1. 打开 **Console** 标签页
2. 查看是否有网络错误（如 CORS 错误、404 错误）
3. 打开 **Network** 标签页，查看对 Jarvis API 的请求是否成功

**正常情况**: 
- 预览区域能正常加载 Hercules 页面
- 保存按钮能成功保存配置

**异常情况**:
- CORS 错误：`ALLOWED_ORIGINS` 配置不正确
- 404 错误：`NEXT_PUBLIC_API_BASE_URL` 或 `NEXT_PUBLIC_HERCULES_URL` 配置错误

#### 2. 检查 Hercules 渲染引擎

访问 Hercules 应用：

1. 页面应该能正常显示组件
2. 打开开发者工具 **Console**，查看是否有 API 请求错误

**正常情况**: 页面正常渲染，无控制台错误

**异常情况**: 
- API 请求失败：`NEXT_PUBLIC_API_BASE_URL` 配置错误

#### 3. 检查 Jarvis 后端服务

直接访问 Jarvis 的根路径（如 `https://genesis-jarvis.vercel.app/`）:

**预期结果**: 显示 "Jarvis 后端服务正在运行!"

测试 API 端点：
```bash
curl https://genesis-jarvis.vercel.app/api/page-config
```

**预期结果**: 返回 JSON 格式的页面配置

---

## 🐛 常见问题

### 问题 1: CORS 错误

**错误信息**:
```
Access to fetch at 'https://genesis-jarvis.vercel.app/api/page-config' 
from origin 'https://genesis-zeus.vercel.app' has been blocked by CORS policy
```

**原因**: Jarvis 的 `ALLOWED_ORIGINS` 没有包含请求来源的域名

**解决方案**:
1. 检查 Jarvis 的 `ALLOWED_ORIGINS` 环境变量
2. 确保包含 Zeus 和 Hercules 的完整域名（包括 `https://`）
3. 多个域名用逗号分隔，**不要有空格**
4. 重新部署 Jarvis

---

### 问题 2: 预览区域无法加载

**错误信息**: Zeus 编辑器中间的预览区域空白

**原因**: `NEXT_PUBLIC_HERCULES_URL` 配置错误或 Hercules 未部署

**解决方案**:
1. 检查 Zeus 的 `NEXT_PUBLIC_HERCULES_URL` 是否正确
2. 确认 Hercules 应用已成功部署且可访问
3. 重新部署 Zeus

---

### 问题 3: 保存失败

**错误信息**: 点击保存按钮后显示错误提示

**原因**: `NEXT_PUBLIC_API_BASE_URL` 配置错误或 Jarvis 未运行

**解决方案**:
1. 检查 Zeus 和 Hercules 的 `NEXT_PUBLIC_API_BASE_URL` 是否正确
2. 确认 Jarvis 应用已成功部署且可访问
3. 检查 Jarvis 的 `ALLOWED_ORIGINS` 配置
4. 重新部署相关应用

---

### 问题 4: 环境变量修改后不生效

**原因**: Next.js 的环境变量在构建时注入，需要重新部署

**解决方案**:
1. 在 Vercel 控制台修改环境变量后
2. 点击 **Deployments** 标签页
3. 找到最新的部署，点击 **...** → **Redeploy**
4. 或者推送新的代码触发自动部署

---

## 📚 相关文档

- **[部署指南 (DEPLOYMENT.md)](./DEPLOYMENT.md)**: 完整的 Vercel 部署流程
- **[常见问题 (FAQ.md)](./FAQ.md)**: 更多开发和部署问题排查
- **[用户使用指南 (USER_GUIDE.md)](./USER_GUIDE.md)**: 了解如何使用 Genesis 平台

---

## 💡 最佳实践

### 1. 使用 .env.local 文件

在本地开发时，如果需要自定义端口或地址，建议创建 `.env.local` 文件：

```bash
# apps/zeus/.env.local
NEXT_PUBLIC_HERCULES_URL=http://localhost:3001
NEXT_PUBLIC_API_BASE_URL=http://localhost:3002
```

**注意**: `.env.local` 文件不应提交到 Git 仓库（已在 `.gitignore` 中配置）。

### 2. 环境变量命名规范

- Next.js 中暴露给浏览器的变量必须以 `NEXT_PUBLIC_` 开头
- 不以此开头的变量仅在服务端可用

### 3. 生产环境分离

为不同的部署环境（Production / Preview / Development）配置不同的环境变量值：

- **Production**: 正式环境的地址
- **Preview**: 预览分支的临时地址
- **Development**: 本地开发地址

### 4. 定期检查配置

在每次部署新应用或更改域名后，务必：
1. 更新相关应用的环境变量
2. 重新部署所有依赖该变量的应用
3. 进行完整的功能测试

---

如有其他环境配置相关问题，请参阅 [FAQ.md](./FAQ.md) 或联系技术支持团队。

