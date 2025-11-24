# Jarvis (后端服务)

Jarvis 是 Genesis 平台的后端服务，提供数据存储和 API 接口支持。

## 核心职责

1. **页面配置存储**: 提供页面配置 (Page Config) 的读写 API。
2. **文件存储**: (规划中) 处理图片上传和文件管理。
3. **AI 代理**: (规划中) 集成 Dify，支持自然语言生成页面配置。

## 快速开始

```bash
pnpm --filter jarvis dev
```

服务默认运行在 http://localhost:3002

## 详细文档

- **[AI 集成规划](./AI_INTEGRATION.md)**: 未来的 AI Agent 集成方案
- **[环境变量配置](../../ENVIRONMENT.md)**: 了解必要的环境变量
- **[部署指南](../../DEPLOYMENT.md)**: 生产环境部署说明

## 技术栈

- **Framework**: Hono
- **Database**: JSON 文件存储 (开发阶段)
- **规划**: SQLite/PostgreSQL

## API 接口

- `GET /api/page-config`: 获取页面配置
- `POST /api/page-config`: 保存页面配置
