# Hercules Agent 组件库手册

请参考此文档来生成营销页面的 JSON 配置。

> **注意**: `type` 字段现在使用数字 ID (Type ID)。请务必使用对应的数字。

## 页面结构 (Page Structure)

一个标准的楼层 (Floor) 对象包含以下字段：
- `id`: (string) 楼层的唯一标识符
- `type`: (number) 组件的数字 Type ID
- `alias`: (string, 可选) 楼层的别名，用于在对话中指代该楼层 (例如 "主标题", "活动 Banner")
- `data`: (object) 组件的具体配置数据，详见下方各组件定义

---

## 组件: Text - 文本 (Type ID: 1)

### 属性 (Properties)

- **content** (必填)
  - **中文名**: 文本内容
  - 类型: `string`
  - 描述: 要显示的实际文本内容

- **align** (可选)
  - **中文名**: 对齐方式
  - 类型: `enum`
  - 选项: `left`, `center`, `right`
  - 默认值: `"left"`
  - 描述: 文本对齐方式

- **size** (可选)
  - **中文名**: 字体大小
  - 类型: `enum`
  - 选项: `sm`, `base`, `lg`, `xl`, `2xl`
  - 默认值: `"base"`
  - 描述: 字体大小

- **color** (可选)
  - **中文名**: 文本颜色
  - 类型: `string`
  - 默认值: `"text-black"`
  - 描述: 文本颜色 (Hex 或 Tailwind 类)

- **mode** (可选)
  - **中文名**: 显示模式
  - 类型: `enum`
  - 选项: `simple`, `with-locale`
  - 默认值: `"simple"`
  - 描述: 显示模式

---

## 组件: Shelf - 货架 (Type ID: 3)

### 属性 (Properties)

- **layout** (必填)
  - **中文名**: 布局模式
  - 类型: `enum`
  - 选项: `grid`, `scroll`
  - 描述: 布局模式：grid (双列网格) 或 scroll (横向滚动)

- **title** (可选)
  - **中文名**: 标题
  - 类型: `string`
  - 描述: 货架的可选标题

- **products** (必填)
  - **中文名**: 商品列表
  - 类型: `array`
  - 描述: 要展示的商品列表

---

## 组件: Tab - 标签页 (Type ID: 4)

### 属性 (Properties)

- **items** (必填)
  - **中文名**: 标签项
  - 类型: `array`
  - 描述: Tab 列表项

- **defaultActiveKey** (可选)
  - **中文名**: 默认选中
  - 类型: `string`
  - 描述: 默认激活的 Tab Key

---

## 组件: Image - 图片 (Type ID: 2)

### 属性 (Properties)

- **src** (必填)
  - **中文名**: 图片链接
  - 类型: `string`
  - 描述: 图片链接地址

- **alt** (可选)
  - **中文名**: 替代文本
  - 类型: `string`
  - 默认值: `""`
  - 描述: 无障碍替代文本

- **aspectRatio** (可选)
  - **中文名**: 宽高比
  - 类型: `enum`
  - 选项: `16/9`, `4/3`, `1/1`, `auto`
  - 默认值: `"auto"`
  - 描述: 图片容器的宽高比

- **objectFit** (可选)
  - **中文名**: 填充模式
  - 类型: `enum`
  - 选项: `cover`, `contain`, `fill`
  - 默认值: `"cover"`
  - 描述: CSS object-fit 属性

- **clickUrl** (可选)
  - **中文名**: 跳转链接
  - 类型: `string`
  - 描述: 点击跳转链接

---

## 组件: Button - 按钮 (Type ID: 5)

### 属性 (Properties)

- **text** (可选)
  - **中文名**: 按钮文本
  - 类型: `string`
  - 默认值: `"点击我"`
  - 描述: 按钮上显示的文字

- **link** (可选)
  - **中文名**: 跳转链接
  - 类型: `string`
  - 描述: 点击按钮后的跳转地址

- **variant** (可选)
  - **中文名**: 样式变体
  - 类型: `enum`
  - 选项: `solid`, `outline`, `ghost`
  - 默认值: `"solid"`
  - 描述: 按钮的视觉样式

- **size** (可选)
  - **中文名**: 尺寸
  - 类型: `enum`
  - 选项: `sm`, `base`, `lg`
  - 默认值: `"base"`
  - 描述: 按钮的大小

- **color** (可选)
  - **中文名**: 颜色主题
  - 类型: `string`
  - 默认值: `"bg-blue-600"`
  - 描述: 按钮的主题颜色 (Tailwind 类或 Hex)

- **radius** (可选)
  - **中文名**: 圆角
  - 类型: `enum`
  - 选项: `none`, `sm`, `md`, `lg`, `full`
  - 默认值: `"md"`
  - 描述: 按钮的圆角大小

- **fullWidth** (可选)
  - **中文名**: 全宽
  - 类型: `boolean`
  - 默认值: `false`
  - 描述: 是否占满容器宽度

---

## 组件: Video - 视频 (Type ID: 6)

### 属性 (Properties)

- **src** (必填)
  - **中文名**: 视频链接
  - 类型: `string`
  - 描述: 视频文件的 URL 地址

- **poster** (可选)
  - **中文名**: 封面图
  - 类型: `string`
  - 描述: 视频未播放时显示的封面图片

- **autoplay** (可选)
  - **中文名**: 自动播放
  - 类型: `boolean`
  - 默认值: `false`
  - 描述: 是否自动播放 (通常需要静音)

- **controls** (可选)
  - **中文名**: 显示控制条
  - 类型: `boolean`
  - 默认值: `true`
  - 描述: 是否显示播放控制条

- **loop** (可选)
  - **中文名**: 循环播放
  - 类型: `boolean`
  - 默认值: `false`
  - 描述: 是否循环播放

- **muted** (可选)
  - **中文名**: 静音
  - 类型: `boolean`
  - 默认值: `false`
  - 描述: 是否默认静音 (自动播放通常需要)

- **aspectRatio** (可选)
  - **中文名**: 宽高比
  - 类型: `enum`
  - 选项: `16/9`, `4/3`, `1/1`, `auto`
  - 默认值: `"16/9"`
  - 描述: 视频容器的宽高比

---

## 组件: Carousel - 轮播图 (Type ID: 7)

### 属性 (Properties)

- **items** (必填)
  - **中文名**: 轮播项
  - 类型: `array`
  - 描述: 轮播图列表

- **autoplay** (可选)
  - **中文名**: 自动播放
  - 类型: `boolean`
  - 默认值: `true`
  - 描述: 是否开启自动轮播

- **interval** (可选)
  - **中文名**: 轮播间隔
  - 类型: `number`
  - 默认值: `3000`
  - 描述: 自动轮播的时间间隔 (毫秒)

- **showArrows** (可选)
  - **中文名**: 显示箭头
  - 类型: `boolean`
  - 默认值: `true`
  - 描述: 是否显示左右切换箭头

- **showDots** (可选)
  - **中文名**: 显示指示点
  - 类型: `boolean`
  - 默认值: `true`
  - 描述: 是否显示底部指示点

- **aspectRatio** (可选)
  - **中文名**: 宽高比
  - 类型: `enum`
  - 选项: `16/9`, `4/3`, `3/1`, `auto`
  - 默认值: `"16/9"`
  - 描述: 轮播容器的宽高比

---

## 组件: Spacer - 间距 (Type ID: 8)

### 属性 (Properties)

- **height** (可选)
  - **中文名**: 高度
  - 类型: `number`
  - 默认值: `20`
  - 描述: 间距的高度 (px)

- **backgroundColor** (可选)
  - **中文名**: 背景颜色
  - 类型: `string`
  - 默认值: `"bg-transparent"`
  - 描述: 间距的背景颜色 (Hex 或 Tailwind 类)

---

