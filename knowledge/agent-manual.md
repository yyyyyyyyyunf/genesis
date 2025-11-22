# Hercules Agent 组件库手册

请参考此文档来生成营销页面的 JSON 配置。

## 组件: Text

### 属性 (Properties)

- **content** (必填)
  - 类型: `string`
  - 描述: 要显示的实际文本内容

- **align** (可选)
  - 类型: `enum`
  - 选项: `left`, `center`, `right`
  - 默认值: `"left"`
  - 描述: 文本对齐方式

- **size** (可选)
  - 类型: `enum`
  - 选项: `sm`, `base`, `lg`, `xl`, `2xl`
  - 默认值: `"base"`
  - 描述: 字体大小

- **color** (可选)
  - 类型: `string`
  - 默认值: `"text-black"`
  - 描述: 文本颜色 (Hex 或 Tailwind 类)

---

## 组件: Shelf

### 属性 (Properties)

- **layout** (必填)
  - 类型: `enum`
  - 选项: `grid`, `scroll`
  - 描述: 布局模式：grid (双列网格) 或 scroll (横向滚动)

- **title** (可选)
  - 类型: `string`
  - 描述: 货架的可选标题

- **products** (必填)
  - 类型: `array`
  - 描述: 要展示的商品列表

---

## 组件: Tab

### 属性 (Properties)

- **items** (必填)
  - 类型: `array`
  - 描述: Tab 列表项

- **defaultActiveKey** (可选)
  - 类型: `string`
  - 描述: 默认激活的 Tab Key

---

## 组件: Image

### 属性 (Properties)

- **src** (必填)
  - 类型: `string`
  - 描述: 图片链接地址

- **alt** (可选)
  - 类型: `string`
  - 默认值: `""`
  - 描述: 无障碍替代文本

- **aspectRatio** (可选)
  - 类型: `enum`
  - 选项: `16/9`, `4/3`, `1/1`, `auto`
  - 默认值: `"auto"`
  - 描述: 图片容器的宽高比

- **objectFit** (可选)
  - 类型: `enum`
  - 选项: `cover`, `contain`, `fill`
  - 默认值: `"cover"`
  - 描述: CSS object-fit 属性

- **clickUrl** (可选)
  - 类型: `string`
  - 描述: 点击跳转链接

---

