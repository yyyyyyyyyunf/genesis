# Jarvis (Backend Service)

Jarvis 是 Genesis 平台的后端服务，提供数据存储和 API 接口支持。

## 功能特性

- **页面配置存储**: 提供页面配置 (Page Config) 的读写 API。
- **文件存储**: (规划中) 处理图片上传和文件管理。
- **AI 代理**: (规划中) 集成 LLM 能力，支持自然语言生成页面配置。

## 技术栈

- **Runtime**: Node.js
- **Framework**: Hono
- **Database**: JSON 文件存储 (开发阶段), 规划迁移至 SQLite/PostgreSQL

## 快速开始

### 安装依赖

在根目录下运行：

```bash
pnpm install
```

### 启动服务

单独启动 Jarvis：

```bash
pnpm --filter jarvis dev
```

或者在根目录启动所有服务：

```bash
pnpm dev:all
```

服务默认运行在 `http://localhost:3002`。

## API 接口

### GET /api/page-config

获取当前的页面配置。

- **Response**: `PageConfig` (JSON)

### POST /api/page-config

保存页面配置。

- **Body**: `PageConfig` (JSON)
- **Response**: `{ success: boolean, message: string }`

