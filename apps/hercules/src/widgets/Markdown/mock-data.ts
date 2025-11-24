import { z } from 'zod';
import { MarkdownSchema } from './schema';

type MarkdownProps = z.infer<typeof MarkdownSchema>;

export const MarkdownMockData: {
  minimal: MarkdownProps;
  complete: MarkdownProps;
} = {
  minimal: {
    content: '# 欢迎\n\n这是一个简单的 Markdown 示例。',
    className: 'prose prose-slate max-w-none'
  },
  complete: {
    content: `# 产品使用指南

欢迎使用我们的产品！本指南将帮助您快速上手。

## 快速开始

按照以下步骤开始使用：

1. 注册账号
2. 完善个人信息
3. 浏览商品目录
4. 添加商品到购物车
5. 提交订单

## 主要功能

### 商品浏览

- 支持分类筛选
- 智能搜索推荐
- 收藏喜欢的商品

### 订单管理

您可以在个人中心查看：

- 待付款订单
- 待发货订单
- 已完成订单

### 售后服务

我们提供完善的售后服务：

> 7天无理由退换货，让您购物无忧

## 联系我们

如有疑问，请联系客服：**400-123-4567**

---

*更新时间：2024年3月*`,
    className: 'prose prose-slate max-w-none'
  }
};

