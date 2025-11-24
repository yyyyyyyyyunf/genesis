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
  - 描述: 文本对齐方式 @labels({"left":"左对齐", "center":"居中", "right":"右对齐"})

- **size** (可选)
  - **中文名**: 字体大小
  - 类型: `enum`
  - 选项: `sm`, `base`, `lg`, `xl`, `2xl`
  - 默认值: `"base"`
  - 描述: 字体大小 @labels({"sm":"小", "base":"标准", "lg":"大", "xl":"超大", "2xl":"特大"})

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
  - 描述: 显示模式 @labels({"simple":"标准模式", "with-locale":"多语言模式"})

### 配置示例

#### 最小配置

```json
{
  "id": "floor_text_example",
  "type": 1,
  "data": {
    "content": "这是一段示例文本",
    "align": "left",
    "size": "base",
    "color": "text-black",
    "mode": "simple"
  }
}
```

#### 完整配置

```json
{
  "id": "floor_text_example",
  "type": 1,
  "alias": "示例文本",
  "data": {
    "content": "欢迎来到我们的电商平台，这里有最优质的商品和服务",
    "align": "center",
    "size": "xl",
    "color": "text-gray-800",
    "mode": "simple"
  }
}
```

---

## 组件: Shelf - 货架 (Type ID: 3)

### 属性 (Properties)

- **layout** (必填)
  - **中文名**: 布局模式
  - 类型: `enum`
  - 选项: `grid`, `scroll`
  - 描述: 布局模式：grid (双列网格) 或 scroll (横向滚动) @labels({"grid":"网格", "scroll":"滚动"})

- **title** (可选)
  - **中文名**: 标题
  - 类型: `string`
  - 描述: 货架的可选标题

- **products** (必填)
  - **中文名**: 商品列表
  - 类型: `array`
  - 描述: 要展示的商品列表
  - **列表项属性**:
    - **id** (必填)
      - 类型: `string`

    - **name** (必填)
      - 类型: `string`

    - **price** (必填)
      - 类型: `string`

    - **imageUrl** (可选)
      - 类型: `string`



### 配置示例

#### 最小配置

```json
{
  "id": "floor_shelf_example",
  "type": 3,
  "data": {
    "layout": "grid",
    "products": [
      {
        "id": "prod_001",
        "name": "经典款运动鞋",
        "price": "¥299",
        "imageUrl": "https://images.unsplash.com/photo-1542291026-7eec264c27ff"
      },
      {
        "id": "prod_002",
        "name": "时尚休闲包",
        "price": "¥199",
        "imageUrl": "https://images.unsplash.com/photo-1553062407-98eeb64c6a62"
      }
    ]
  }
}
```

#### 完整配置

```json
{
  "id": "floor_shelf_example",
  "type": 3,
  "alias": "示例货架",
  "data": {
    "layout": "scroll",
    "title": "热门推荐",
    "products": [
      {
        "id": "prod_001",
        "name": "经典款运动鞋",
        "price": "¥299",
        "imageUrl": "https://images.unsplash.com/photo-1542291026-7eec264c27ff"
      },
      {
        "id": "prod_002",
        "name": "时尚休闲包",
        "price": "¥199",
        "imageUrl": "https://images.unsplash.com/photo-1553062407-98eeb64c6a62"
      },
      {
        "id": "prod_003",
        "name": "蓝牙耳机",
        "price": "¥399",
        "imageUrl": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e"
      },
      {
        "id": "prod_004",
        "name": "智能手表",
        "price": "¥899",
        "imageUrl": "https://images.unsplash.com/photo-1523275335684-37898b6baf30"
      }
    ]
  }
}
```

---

## 组件: Tab - 标签页 (Type ID: 4)

### 属性 (Properties)

- **items** (必填)
  - **中文名**: 标签项
  - 类型: `array`
  - 描述: Tab 列表项
  - **列表项属性**:
    - **label** (必填)
      - **中文名**: 标签名
      - 类型: `string`
      - 描述: Tab 标签 (例如：韩国、中国)

    - **key** (必填)
      - **中文名**: 键值
      - 类型: `string`
      - 描述: Tab 的唯一标识 Key

    - **children** (可选)
      - **中文名**: 子组件
      - 类型: `array`
      - 默认值: `[]`
      - 描述: 该 Tab 下要渲染的组件列表



- **defaultActiveKey** (可选)
  - **中文名**: 默认选中
  - 类型: `string`
  - 描述: 默认激活的 Tab Key

### 配置示例

#### 最小配置

```json
{
  "id": "floor_tab_example",
  "type": 4,
  "data": {
    "items": [
      {
        "label": "推荐",
        "key": "recommend",
        "children": []
      },
      {
        "label": "新品",
        "key": "new",
        "children": []
      }
    ]
  }
}
```

#### 完整配置

```json
{
  "id": "floor_tab_example",
  "type": 4,
  "alias": "示例标签页",
  "data": {
    "items": [
      {
        "label": "热门商品",
        "key": "hot",
        "children": [
          {
            "id": "floor_text_001",
            "type": 1,
            "data": {
              "content": "这是热门商品分类",
              "align": "center"
            }
          }
        ]
      },
      {
        "label": "新品上架",
        "key": "new",
        "children": [
          {
            "id": "floor_text_002",
            "type": 1,
            "data": {
              "content": "这是新品分类",
              "align": "center"
            }
          }
        ]
      },
      {
        "label": "特价促销",
        "key": "sale",
        "children": []
      }
    ],
    "defaultActiveKey": "hot"
  }
}
```

---

## 组件: Image - 图片 (Type ID: 2)

### 属性 (Properties)

支持内容图片和背景图片两种模式

> 默认类型: `content`

**支持的类型 (variant)**:

#### 类型: `content` - 普通内容图片
- **src** (必填)
  - **中文名**: 图片链接
  - 类型: `string`
  - 描述: 图片链接地址

- **clickUrl** (可选)
  - **中文名**: 跳转链接
  - 类型: `string`
  - 描述: 点击跳转链接

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
  - 描述: CSS object-fit 属性 @labels({"cover":"覆盖", "contain":"包含", "fill":"拉伸"})


#### 类型: `background` - 背景图片
- **src** (必填)
  - **中文名**: 图片链接
  - 类型: `string`
  - 描述: 图片链接地址

- **clickUrl** (可选)
  - **中文名**: 跳转链接
  - 类型: `string`
  - 描述: 点击跳转链接

- **alt** (可选)
  - **中文名**: 替代文本
  - 类型: `string`
  - 默认值: `""`
  - 描述: 无障碍替代文本

- **height** (必填)
  - **中文名**: 高度
  - 类型: `string`
  - 描述: 容器高度 (如 300px, 20rem) (单位: px)

- **backgroundPosition** (可选)
  - **中文名**: 背景位置
  - 类型: `enum`
  - 选项: `center`, `top`, `bottom`, `left`, `right`
  - 默认值: `"center"`
  - 描述: 在容器内的位置

- **backgroundSize** (可选)
  - **中文名**: 背景大小
  - 类型: `enum`
  - 选项: `cover`, `contain`
  - 默认值: `"cover"`
  - 描述: CSS background-size 属性

### 配置示例

#### 最小配置

```json
{
  "id": "floor_image_example",
  "type": 2,
  "data": {
    "variant": "content",
    "src": "https://images.unsplash.com/photo-1523275335684-37898b6baf30",
    "alt": "",
    "aspectRatio": "auto",
    "objectFit": "cover"
  }
}
```

#### 完整配置

```json
{
  "id": "floor_image_example",
  "type": 2,
  "alias": "示例图片",
  "data": {
    "variant": "content",
    "src": "https://images.unsplash.com/photo-1523275335684-37898b6baf30",
    "clickUrl": "https://example.com/product/watch",
    "alt": "精美手表产品图",
    "aspectRatio": "16/9",
    "objectFit": "cover"
  }
}
```

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
  - 描述: 点击按钮后的跳转地址 (优先级高于点击提示)

- **clickMessage** (可选)
  - **中文名**: 点击提示
  - 类型: `string`
  - 描述: 点击按钮时弹出的提示文字 (仅在无跳转链接时生效)

- **variant** (可选)
  - **中文名**: 样式变体
  - 类型: `enum`
  - 选项: `solid`, `outline`, `ghost`, `link`
  - 默认值: `"solid"`
  - 描述: 样式变体 @labels({"solid":"实心", "outline":"描边", "ghost":"幽灵", "link":"链接"})

- **size** (可选)
  - **中文名**: 尺寸
  - 类型: `enum`
  - 选项: `sm`, `base`, `lg`
  - 默认值: `"base"`
  - 描述: 按钮的大小 @labels({"sm":"小", "base":"中", "lg":"大"})

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
  - 描述: 按钮的圆角大小 @labels({"none":"无", "sm":"小", "md":"中", "lg":"大", "full":"全圆"})

- **fullWidth** (可选)
  - **中文名**: 全宽
  - 类型: `boolean`
  - 默认值: `false`
  - 描述: 是否占满容器宽度

- **showArrow** (可选)
  - **中文名**: 显示箭头
  - 类型: `boolean`
  - 默认值: `false`
  - 描述: 是否在文字后显示箭头图标

### 配置示例

#### 最小配置

```json
{
  "id": "floor_button_example",
  "type": 5,
  "data": {
    "text": "立即购买"
  }
}
```

#### 完整配置

```json
{
  "id": "floor_button_example",
  "type": 5,
  "alias": "示例按钮",
  "data": {
    "text": "立即购买",
    "link": "https://example.com/products",
    "variant": "solid",
    "size": "lg",
    "color": "bg-blue-600",
    "radius": "md",
    "fullWidth": false,
    "showArrow": true
  }
}
```

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
  - 描述: 视频容器的宽高比 @labels({"16/9":"宽屏", "4/3":"标准", "1/1":"方形", "auto":"自适应"})

### 配置示例

#### 最小配置

```json
{
  "id": "floor_video_example",
  "type": 6,
  "data": {
    "src": "https://example.com/videos/product-demo.mp4"
  }
}
```

#### 完整配置

```json
{
  "id": "floor_video_example",
  "type": 6,
  "alias": "示例视频",
  "data": {
    "src": "https://example.com/videos/product-intro.mp4",
    "poster": "https://images.unsplash.com/photo-1492619375914-88005aa9e8fb",
    "autoplay": false,
    "controls": true,
    "loop": false,
    "muted": false,
    "aspectRatio": "16/9"
  }
}
```

---

## 组件: Carousel - 轮播图 (Type ID: 7)

### 属性 (Properties)

- **items** (必填)
  - **中文名**: 轮播项
  - 类型: `array`
  - 描述: 轮播图列表
  - **列表项属性**:
    - **image** (必填)
      - **中文名**: 图片链接
      - 类型: `string`
      - 描述: 轮播图片的 URL

    - **link** (可选)
      - **中文名**: 跳转链接
      - 类型: `string`
      - 描述: 点击图片的跳转地址

    - **alt** (可选)
      - **中文名**: 替代文本
      - 类型: `string`
      - 描述: 图片的替代文本



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
  - 描述: 轮播容器的宽高比 @labels({"16/9":"宽屏", "4/3":"标准", "3/1":"全景", "auto":"自适应"})

### 配置示例

#### 最小配置

```json
{
  "id": "floor_carousel_example",
  "type": 7,
  "data": {
    "items": [
      {
        "image": "https://images.unsplash.com/photo-1441986300917-64674bd600d8",
        "link": "https://example.com/sale1"
      },
      {
        "image": "https://images.unsplash.com/photo-1483985988355-763728e1935b",
        "link": "https://example.com/sale2"
      }
    ]
  }
}
```

#### 完整配置

```json
{
  "id": "floor_carousel_example",
  "type": 7,
  "alias": "示例轮播图",
  "data": {
    "items": [
      {
        "image": "https://images.unsplash.com/photo-1441986300917-64674bd600d8",
        "link": "https://example.com/promotion/summer-sale",
        "alt": "夏季大促销"
      },
      {
        "image": "https://images.unsplash.com/photo-1483985988355-763728e1935b",
        "link": "https://example.com/promotion/new-arrival",
        "alt": "新品上市"
      },
      {
        "image": "https://images.unsplash.com/photo-1445205170230-053b83016050",
        "link": "https://example.com/promotion/clearance",
        "alt": "清仓特惠"
      }
    ],
    "autoplay": true,
    "interval": 3000,
    "showArrows": true,
    "showDots": true,
    "aspectRatio": "16/9"
  }
}
```

---

## 组件: Spacer - 间距 (Type ID: 8)

### 属性 (Properties)

- **height** (可选)
  - **中文名**: 高度
  - 类型: `number`
  - 默认值: `20`
  - 描述: 间距的高度 (px) (单位: px)

- **backgroundColor** (可选)
  - **中文名**: 背景颜色
  - 类型: `string`
  - 默认值: `"bg-transparent"`
  - 描述: 间距的背景颜色 (Hex 或 Tailwind 类)

### 配置示例

#### 最小配置

```json
{
  "id": "floor_spacer_example",
  "type": 8,
  "data": {
    "height": 20
  }
}
```

#### 完整配置

```json
{
  "id": "floor_spacer_example",
  "type": 8,
  "alias": "示例间距",
  "data": {
    "height": 40,
    "backgroundColor": "bg-gray-100"
  }
}
```

---

## 组件: Feed - 信息流 (Type ID: 9)

### 属性 (Properties)

- **items** (必填)
  - **中文名**: 内容列表
  - 类型: `array`
  - 描述: 信息流中的内容项列表
  - **列表项属性**:
    - **title** (必填)
      - **中文名**: 标题
      - 类型: `string`
      - 描述: 内容的标题

    - **summary** (必填)
      - **中文名**: 摘要
      - 类型: `string`
      - 描述: 内容的简短描述

    - **image** (可选)
      - **中文名**: 封面图
      - 类型: `string`
      - 描述: 内容的封面图片 URL

    - **date** (可选)
      - **中文名**: 日期
      - 类型: `string`
      - 描述: 发布日期 (例如 "2023-10-01")

    - **tag** (可选)
      - **中文名**: 标签
      - 类型: `string`
      - 描述: 内容的分类标签 (例如 "新闻", "博客")

    - **link** (可选)
      - **中文名**: 跳转链接
      - 类型: `string`
      - 描述: 点击内容后的跳转地址



- **layout** (可选)
  - **中文名**: 布局模式
  - 类型: `enum`
  - 选项: `list`, `card`
  - 默认值: `"list"`
  - 描述: 展示方式，list (列表) 或 card (卡片) @labels({"list":"列表", "card":"卡片"})

- **columns** (可选)
  - **中文名**: 列数
  - 类型: `number`
  - 默认值: `2`
  - 描述: 卡片布局下的列数 (仅在 layout="card" 时生效)

### 配置示例

#### 最小配置

```json
{
  "id": "floor_feed_example",
  "type": 9,
  "data": {
    "items": [
      {
        "title": "春季新品发布",
        "summary": "全新系列产品即将上市，敬请期待"
      },
      {
        "title": "限时优惠活动",
        "summary": "全场五折起，优惠多多"
      }
    ],
    "layout": "list"
  }
}
```

#### 完整配置

```json
{
  "id": "floor_feed_example",
  "type": 9,
  "alias": "示例信息流",
  "data": {
    "items": [
      {
        "title": "2024春季新品发布会",
        "summary": "全新系列产品即将上市，包含服装、配饰等多个品类，敬请期待",
        "image": "https://images.unsplash.com/photo-1441986300917-64674bd600d8",
        "date": "2024-03-15",
        "tag": "新品",
        "link": "https://example.com/news/spring-collection"
      },
      {
        "title": "周年庆限时优惠",
        "summary": "全场五折起，优惠多多，精选商品低至3折",
        "image": "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da",
        "date": "2024-03-10",
        "tag": "促销",
        "link": "https://example.com/promotion/anniversary"
      },
      {
        "title": "品牌故事分享",
        "summary": "了解我们的品牌理念和发展历程",
        "image": "https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1",
        "date": "2024-03-05",
        "tag": "品牌",
        "link": "https://example.com/about/story"
      }
    ],
    "layout": "card",
    "columns": 3
  }
}
```

---

## 组件: Accordion - 折叠面板 (Type ID: 10)

### 属性 (Properties)

- **items** (可选)
  - 类型: `array`
  - 默认值: `[{"title":"FAQ 1","content":"Answer to FAQ 1"}]`
  - 描述: 折叠项列表

- **allowMultiple** (可选)
  - 类型: `boolean`
  - 默认值: `false`
  - 描述: 允许多个展开

### 配置示例

#### 最小配置

```json
{
  "id": "floor_accordion_example",
  "type": 10,
  "data": {
    "items": [
      {
        "title": "如何下单购买？",
        "content": "您可以浏览商品页面，点击\"加入购物车\"按钮，然后进入购物车结算。"
      }
    ],
    "allowMultiple": false
  }
}
```

#### 完整配置

```json
{
  "id": "floor_accordion_example",
  "type": 10,
  "alias": "示例折叠面板",
  "data": {
    "items": [
      {
        "title": "如何下单购买？",
        "content": "您可以浏览商品页面，点击\"加入购物车\"按钮，然后进入购物车结算。支持多种支付方式。"
      },
      {
        "title": "配送时间需要多久？",
        "content": "一般情况下，订单会在1-3个工作日内发货，具体配送时间取决于您所在的地区。"
      },
      {
        "title": "支持哪些支付方式？",
        "content": "我们支持支付宝、微信支付、银行卡等多种支付方式，您可以根据自己的需求选择。"
      },
      {
        "title": "如何申请退换货？",
        "content": "商品签收后7天内，如有质量问题可申请退换货。请在个人中心的订单页面提交申请。"
      }
    ],
    "allowMultiple": true
  }
}
```

---

## 组件: Form - 表单 (Type ID: 11)

### 属性 (Properties)

- **title** (可选)
  - 类型: `string`
  - 默认值: `"联系我们"`
  - 描述: 表单标题

- **description** (可选)
  - 类型: `string`
  - 描述: 表单描述

- **fields** (可选)
  - 类型: `array`
  - 默认值: `[{"label":"姓名","name":"name","type":"text","placeholder":"请输入您的姓名","required":true},{"label":"邮箱","name":"email","type":"email","placeholder":"请输入您的邮箱","required":true}]`
  - 描述: 字段列表

- **submitText** (可选)
  - 类型: `string`
  - 默认值: `"提交"`
  - 描述: 提交按钮文案

- **successMessage** (可选)
  - 类型: `string`
  - 默认值: `"提交成功！我们会尽快联系您。"`
  - 描述: 提交成功提示

### 配置示例

#### 最小配置

```json
{
  "id": "floor_form_example",
  "type": 11,
  "data": {
    "title": "联系我们",
    "submitText": "提交",
    "successMessage": "提交成功！我们会尽快联系您。"
  }
}
```

#### 完整配置

```json
{
  "id": "floor_form_example",
  "type": 11,
  "alias": "示例表单",
  "data": {
    "title": "预约咨询",
    "description": "请填写以下信息，我们的客服将在24小时内与您联系",
    "fields": [
      {
        "label": "姓名",
        "name": "name",
        "type": "text",
        "placeholder": "请输入您的姓名",
        "required": true
      },
      {
        "label": "手机号",
        "name": "phone",
        "type": "tel",
        "placeholder": "请输入您的手机号",
        "required": true
      },
      {
        "label": "邮箱",
        "name": "email",
        "type": "email",
        "placeholder": "请输入您的邮箱",
        "required": false
      },
      {
        "label": "咨询内容",
        "name": "message",
        "type": "textarea",
        "placeholder": "请描述您的需求",
        "required": true
      }
    ],
    "submitText": "立即预约",
    "successMessage": "预约成功！我们会在24小时内与您联系。"
  }
}
```

---

## 组件: Countdown - 倒计时 (Type ID: 12)

### 属性 (Properties)

- **targetDate** (可选)
  - 类型: `string`
  - 默认值: `"2025-11-25T11:53:31.999Z"`
  - 描述: 目标时间 (ISO格式)

- **textColor** (可选)
  - 类型: `string`
  - 默认值: `"text-gray-900"`
  - 描述: 文字颜色 (Tailwind 类)

- **backgroundColor** (可选)
  - 类型: `string`
  - 默认值: `"bg-white"`
  - 描述: 背景颜色 (Tailwind 类)

- **endMessage** (可选)
  - 类型: `string`
  - 默认值: `"活动已结束"`
  - 描述: 结束文案

### 配置示例

#### 最小配置

```json
{
  "id": "floor_countdown_example",
  "type": 12,
  "data": {
    "targetDate": "2025-11-25T11:53:32.030Z",
    "textColor": "text-gray-900",
    "backgroundColor": "bg-white",
    "endMessage": "活动已结束"
  }
}
```

#### 完整配置

```json
{
  "id": "floor_countdown_example",
  "type": 12,
  "alias": "示例倒计时",
  "data": {
    "targetDate": "2025-11-27T11:53:32.030Z",
    "textColor": "text-white",
    "backgroundColor": "bg-gradient-to-r from-red-500 to-pink-500",
    "endMessage": "限时抢购已结束，敬请期待下次活动！"
  }
}
```

---

## 组件: AvatarGroup - 头像组 (Type ID: 13)

### 属性 (Properties)

- **images** (可选)
  - 类型: `array`
  - 默认值: `["https://api.dicebear.com/7.x/avataaars/svg?seed=Felix","https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka","https://api.dicebear.com/7.x/avataaars/svg?seed=Bob"]`
  - 描述: 头像链接列表

- **size** (可选)
  - 类型: `enum`
  - 选项: `sm`, `md`, `lg`
  - 默认值: `"md"`
  - 描述: 尺寸 @labels({"sm":"小", "md":"中", "lg":"大"})

- **max** (可选)
  - 类型: `number`
  - 默认值: `5`
  - 描述: 最大显示数量

### 配置示例

#### 最小配置

```json
{
  "id": "floor_avatargroup_example",
  "type": 13,
  "data": {
    "images": [
      "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
      "https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka",
      "https://api.dicebear.com/7.x/avataaars/svg?seed=Bob"
    ],
    "size": "md",
    "max": 5
  }
}
```

#### 完整配置

```json
{
  "id": "floor_avatargroup_example",
  "type": 13,
  "alias": "示例头像组",
  "data": {
    "images": [
      "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
      "https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka",
      "https://api.dicebear.com/7.x/avataaars/svg?seed=Bob",
      "https://api.dicebear.com/7.x/avataaars/svg?seed=Alice",
      "https://api.dicebear.com/7.x/avataaars/svg?seed=David",
      "https://api.dicebear.com/7.x/avataaars/svg?seed=Emma",
      "https://api.dicebear.com/7.x/avataaars/svg?seed=Frank"
    ],
    "size": "lg",
    "max": 5
  }
}
```

---

## 组件: Divider - 分割线 (Type ID: 14)

### 属性 (Properties)

- **style** (可选)
  - **中文名**: 样式
  - 类型: `enum`
  - 选项: `solid`, `dashed`, `dotted`
  - 默认值: `"solid"`
  - 描述: 分割线样式 @labels({"solid":"实线", "dashed":"虚线", "dotted":"点线"})

- **color** (可选)
  - 类型: `string`
  - 默认值: `"border-gray-200"`
  - 描述: 颜色 (Tailwind 类)

- **thickness** (可选)
  - 类型: `number`
  - 默认值: `1`
  - 描述: 粗细 (px) (单位: px)

- **margin** (可选)
  - 类型: `number`
  - 默认值: `20`
  - 描述: 上下间距 (px) (单位: px)

### 配置示例

#### 最小配置

```json
{
  "id": "floor_divider_example",
  "type": 14,
  "data": {
    "style": "solid",
    "color": "border-gray-200",
    "thickness": 1,
    "margin": 20
  }
}
```

#### 完整配置

```json
{
  "id": "floor_divider_example",
  "type": 14,
  "alias": "示例分割线",
  "data": {
    "style": "dashed",
    "color": "border-gray-300",
    "thickness": 2,
    "margin": 40
  }
}
```

---

## 组件: Markdown - Markdown (Type ID: 15)

### 属性 (Properties)

- **content** (可选)
  - **中文名**: 内容
  - 类型: `string`
  - 默认值: `"# 你好\n这是一个 Markdown 组件示例。"`
  - 描述: Markdown 格式的文本内容

- **className** (可选)
  - **中文名**: 样式类名
  - 类型: `string`
  - 默认值: `"prose prose-slate max-w-none"`
  - 描述: 额外的 CSS 类名

### 配置示例

#### 最小配置

```json
{
  "id": "floor_markdown_example",
  "type": 15,
  "data": {
    "content": "# 欢迎\n\n这是一个简单的 Markdown 示例。",
    "className": "prose prose-slate max-w-none"
  }
}
```

#### 完整配置

```json
{
  "id": "floor_markdown_example",
  "type": 15,
  "alias": "示例Markdown",
  "data": {
    "content": "# 产品使用指南\n\n欢迎使用我们的产品！本指南将帮助您快速上手。\n\n## 快速开始\n\n按照以下步骤开始使用：\n\n1. 注册账号\n2. 完善个人信息\n3. 浏览商品目录\n4. 添加商品到购物车\n5. 提交订单\n\n## 主要功能\n\n### 商品浏览\n\n- 支持分类筛选\n- 智能搜索推荐\n- 收藏喜欢的商品\n\n### 订单管理\n\n您可以在个人中心查看：\n\n- 待付款订单\n- 待发货订单\n- 已完成订单\n\n### 售后服务\n\n我们提供完善的售后服务：\n\n> 7天无理由退换货，让您购物无忧\n\n## 联系我们\n\n如有疑问，请联系客服：**400-123-4567**\n\n---\n\n*更新时间：2024年3月*",
    "className": "prose prose-slate max-w-none"
  }
}
```

---

## 组件: CodeBlock - 代码块 (Type ID: 16)

### 属性 (Properties)

- **code** (可选)
  - **中文名**: 代码
  - 类型: `string`
  - 默认值: `"console.log(\"Hello World\");"`
  - 描述: 需要高亮的代码内容

- **language** (可选)
  - **中文名**: 语言
  - 类型: `string`
  - 默认值: `"typescript"`
  - 描述: 代码语言 (如 typescript, python, html)

- **theme** (可选)
  - **中文名**: 主题
  - 类型: `string`
  - 默认值: `"github-dark"`
  - 描述: 代码高亮主题 (如 github-dark, dracula)

### 配置示例

#### 最小配置

```json
{
  "id": "floor_codeblock_example",
  "type": 16,
  "data": {
    "code": "console.log(\"Hello World\");",
    "language": "typescript",
    "theme": "github-dark"
  }
}
```

#### 完整配置

```json
{
  "id": "floor_codeblock_example",
  "type": 16,
  "alias": "示例代码块",
  "data": {
    "code": "interface Product {\n  id: string;\n  name: string;\n  price: number;\n  description: string;\n}\n\nasync function fetchProducts(): Promise<Product[]> {\n  const response = await fetch('/api/products');\n  const data = await response.json();\n  return data;\n}\n\n// 使用示例\nconst products = await fetchProducts();\nconsole.log('商品列表:', products);",
    "language": "typescript",
    "theme": "github-dark"
  }
}
```

---

## 组件: StaticChart - 静态图表 (Type ID: 17)

### 属性 (Properties)

- **title** (可选)
  - **中文名**: 标题
  - 类型: `string`
  - 默认值: `"月度数据"`
  - 描述: 图表标题

- **type** (可选)
  - **中文名**: 类型
  - 类型: `enum`
  - 选项: `bar`, `line`
  - 默认值: `"bar"`
  - 描述: 图表类型 (柱状图/折线图) @labels({"bar":"柱状图", "line":"折线图"})

- **data** (可选)
  - **中文名**: 数据
  - 类型: `array`
  - 默认值: `[10,25,15,30,45,20]`
  - 描述: 数值数组

- **labels** (可选)
  - **中文名**: 标签
  - 类型: `array`
  - 默认值: `["1月","2月","3月","4月","5月","6月"]`
  - 描述: X轴标签数组

- **color** (可选)
  - **中文名**: 颜色
  - 类型: `string`
  - 默认值: `"#3b82f6"`
  - 描述: 图表颜色 (Hex)

- **height** (可选)
  - **中文名**: 高度
  - 类型: `number`
  - 默认值: `200`
  - 描述: 图表高度 (px) (单位: px)

### 配置示例

#### 最小配置

```json
{
  "id": "floor_staticchart_example",
  "type": 17,
  "data": {
    "type": "bar",
    "data": [
      10,
      25,
      15,
      30,
      45,
      20
    ]
  }
}
```

#### 完整配置

```json
{
  "id": "floor_staticchart_example",
  "type": 17,
  "alias": "示例静态图表",
  "data": {
    "title": "2024年销售业绩",
    "type": "line",
    "data": [
      120,
      250,
      180,
      320,
      450,
      280,
      390,
      510,
      420,
      560,
      620,
      700
    ],
    "labels": [
      "1月",
      "2月",
      "3月",
      "4月",
      "5月",
      "6月",
      "7月",
      "8月",
      "9月",
      "10月",
      "11月",
      "12月"
    ],
    "color": "#3b82f6",
    "height": 300
  }
}
```

---

## 组件: BottomNavigation - 底部导航 (Type ID: 18)

### 属性 (Properties)

- **items** (必填)
  - **中文名**: 导航项
  - 类型: `array`
  - 描述: 底部导航按钮列表
  - **列表项属性**:
    - **label** (必填)
      - **中文名**: 标签
      - 类型: `string`
      - 描述: 按钮文字

    - **icon** (可选)
      - **中文名**: 图标
      - 类型: `string`
      - 默认值: `"Home"`
      - 描述: Lucide图标名称

    - **link** (可选)
      - **中文名**: 链接
      - 类型: `string`
      - 描述: 跳转地址

    - **activeIcon** (可选)
      - **中文名**: 选中图标
      - 类型: `string`
      - 描述: 选中状态的图标



- **activeColor** (可选)
  - **中文名**: 选中颜色
  - 类型: `string`
  - 默认值: `"text-blue-600"`
  - 描述: 选中状态的颜色 (Tailwind类)

- **backgroundColor** (可选)
  - **中文名**: 背景颜色
  - 类型: `string`
  - 默认值: `"bg-white"`
  - 描述: 导航栏背景颜色 (Tailwind类)

### 配置示例

#### 最小配置

```json
{
  "id": "floor_bottomnavigation_example",
  "type": 18,
  "data": {
    "items": [
      {
        "label": "首页",
        "icon": "Home",
        "link": "/"
      },
      {
        "label": "分类",
        "icon": "Grid",
        "link": "/categories"
      },
      {
        "label": "我的",
        "icon": "User",
        "link": "/profile"
      }
    ],
    "activeColor": "text-blue-600",
    "backgroundColor": "bg-white"
  }
}
```

#### 完整配置

```json
{
  "id": "floor_bottomnavigation_example",
  "type": 18,
  "alias": "示例底部导航",
  "data": {
    "items": [
      {
        "label": "首页",
        "icon": "Home",
        "activeIcon": "Home",
        "link": "/"
      },
      {
        "label": "分类",
        "icon": "Grid",
        "activeIcon": "Grid",
        "link": "/categories"
      },
      {
        "label": "购物车",
        "icon": "ShoppingCart",
        "activeIcon": "ShoppingCart",
        "link": "/cart"
      },
      {
        "label": "消息",
        "icon": "Bell",
        "activeIcon": "Bell",
        "link": "/notifications"
      },
      {
        "label": "我的",
        "icon": "User",
        "activeIcon": "User",
        "link": "/profile"
      }
    ],
    "activeColor": "text-blue-600",
    "backgroundColor": "bg-white"
  }
}
```

---

## 组件: FloatButton - 悬浮按钮 (Type ID: 19)

### 属性 (Properties)

- **icon** (可选)
  - **中文名**: 图标
  - 类型: `string`
  - 默认值: `"ArrowUp"`
  - 描述: Lucide图标名称

- **action** (可选)
  - **中文名**: 动作
  - 类型: `enum`
  - 选项: `backToTop`, `link`, `custom`
  - 默认值: `"backToTop"`
  - 描述: 点击按钮触发的行为 @labels({"backToTop":"回到顶部", "link":"跳转链接", "custom":"自定义"})

- **link** (可选)
  - **中文名**: 链接
  - 类型: `string`
  - 描述: 跳转地址 (仅action=link时生效)

- **position** (可选)
  - **中文名**: 位置
  - 类型: `enum`
  - 选项: `bottom-right`, `bottom-left`
  - 默认值: `"bottom-right"`
  - 描述: 按钮位置 @labels({"bottom-right":"右下角", "bottom-left":"左下角"})

- **bottomOffset** (可选)
  - **中文名**: 底部偏移
  - 类型: `number`
  - 默认值: `100`
  - 描述: 距离底部的距离 (px) (单位: px)

- **color** (可选)
  - **中文名**: 颜色
  - 类型: `string`
  - 默认值: `"bg-blue-600 text-white"`
  - 描述: 按钮颜色 (Tailwind类)

### 配置示例

#### 最小配置

```json
{
  "id": "floor_floatbutton_example",
  "type": 19,
  "data": {
    "icon": "ArrowUp",
    "action": "backToTop"
  }
}
```

#### 完整配置

```json
{
  "id": "floor_floatbutton_example",
  "type": 19,
  "alias": "示例悬浮按钮",
  "data": {
    "icon": "MessageCircle",
    "action": "link",
    "link": "https://example.com/contact",
    "position": "bottom-right",
    "bottomOffset": 100,
    "color": "bg-green-600 text-white"
  }
}
```

---

