# 部署指南 (Deployment Guide)

本指南介绍了如何将 Genesis 平台的三个应用部署到线上环境（推荐使用 Vercel）。

## 1. 环境变量配置

在部署之前，你需要为每个应用配置相应的环境变量，以确保它们能够相互通信。

### Zeus (编辑器) 环境变量
*   `NEXT_PUBLIC_HERCULES_URL`: Hercules (渲染端) 的线上地址。
    *   示例: `https://genesis-hercules.vercel.app`
*   `NEXT_PUBLIC_API_BASE_URL`: Jarvis (后端) 的线上地址。
    *   示例: `https://genesis-jarvis.vercel.app` (如果是 Serverless 部署) 或其他 API 服务地址。

### Hercules (渲染端) 环境变量
*   `NEXT_PUBLIC_API_BASE_URL`: Jarvis (后端) 的线上地址。
    *   示例: `https://genesis-jarvis.vercel.app`

### Jarvis (后端) 环境变量
*   `ALLOWED_ORIGINS`: 允许跨域访问的域名列表（逗号分隔）。
    *   示例: `https://genesis-zeus.vercel.app,https://genesis-hercules.vercel.app`
*   `PORT`: (可选) 服务运行端口，Vercel Serverless 环境下会自动处理，无需配置。

---

## 2. Vercel 部署步骤 (推荐)

由于本项目是 Monorepo 结构，你可以在 Vercel 中创建三个项目，分别指向同一个 Git 仓库的不同目录。

### 第一步：部署 Jarvis (后端)
1.  在 Vercel控制台点击 **"Add New..."** -> **"Project"**。
2.  导入 Genesis 代码仓库。
3.  **重要配置**:
    *   **Root Directory**: 选择 `apps/jarvis`。
    *   **Framework Preset**: 选择 `Other` (如果部署为 Node Server) 或根据实际情况配置。
        *   *注意*: 如果 `jarvis` 是基于 Hono 且要部署为 Vercel Edge/Serverless Function，可能需要调整 `api/index.ts` 适配器。如果是标准 Node 服务，可以使用 Render.com，或者在 Vercel 中配置 Serverless Function 适配。
4.  点击 **Deploy**。
5.  获取分配的域名 (例如 `genesis-jarvis.vercel.app`)。

### 第二步：部署 Hercules (渲染端)
1.  新建 Vercel 项目。
2.  **Root Directory**: 选择 `apps/hercules`。
3.  **Framework Preset**: Next.js。
4.  **Environment Variables**:
    *   `NEXT_PUBLIC_API_BASE_URL`: 填入 Jarvis 的域名。
5.  点击 **Deploy**。
6.  获取分配的域名 (例如 `genesis-hercules.vercel.app`)。

### 第三步：部署 Zeus (编辑器)
1.  新建 Vercel 项目。
2.  **Root Directory**: 选择 `apps/zeus`。
3.  **Framework Preset**: Next.js。
4.  **Environment Variables**:
    *   `NEXT_PUBLIC_HERCULES_URL`: 填入 Hercules 的域名。
    *   `NEXT_PUBLIC_API_BASE_URL`: 填入 Jarvis 的域名。
5.  点击 **Deploy**。

### 第四步：配置回填
回到 Jarvis 的 Vercel 项目设置中，添加环境变量 `ALLOWED_ORIGINS`，填入 Zeus 和 Hercules 的域名，然后重新部署 Jarvis。

---

## 3. 本地开发

本地开发不需要配置环境变量，系统会默认使用以下地址：
*   Zeus: `http://localhost:3000`
*   Hercules: `http://localhost:3001`
*   Jarvis: `http://localhost:3002`

