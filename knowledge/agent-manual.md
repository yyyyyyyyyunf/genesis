# Hercules Component Library for Agents

Use this reference to generate the JSON configuration for the marketing page.

## Component: Text

### Properties

- **content** (Required)
  - Type: `string`
  - Description: The actual text content to display

- **align** (Optional)
  - Type: `enum`
  - Options: `left`, `center`, `right`
  - Default: `"left"`
  - Description: Text alignment

- **size** (Optional)
  - Type: `enum`
  - Options: `sm`, `base`, `lg`, `xl`, `2xl`
  - Default: `"base"`
  - Description: Font size

- **color** (Optional)
  - Type: `string`
  - Default: `"text-black"`
  - Description: Text color (hex or tailwind class)

---

## Component: Shelf

### Properties

- **layout** (Required)
  - Type: `enum`
  - Options: `grid`, `scroll`
  - Description: Layout mode: grid (2 columns) or scroll (horizontal scroll)

- **title** (Optional)
  - Type: `string`
  - Description: Optional title for the shelf

- **products** (Required)
  - Type: `array`
  - Description: List of products to display

---

## Component: Tab

### Properties

- **items** (Required)
  - Type: `array`
  - Description: List of tab items

- **defaultActiveKey** (Optional)
  - Type: `string`
  - Description: Key of the initially active tab

---

## Component: Image

### Properties

- **src** (Required)
  - Type: `string`
  - Description: Image URL

- **alt** (Optional)
  - Type: `string`
  - Default: `""`
  - Description: Alt text for accessibility

- **aspectRatio** (Optional)
  - Type: `enum`
  - Options: `16/9`, `4/3`, `1/1`, `auto`
  - Default: `"auto"`
  - Description: Aspect ratio of the image wrapper

- **objectFit** (Optional)
  - Type: `enum`
  - Options: `cover`, `contain`, `fill`
  - Default: `"cover"`
  - Description: CSS object-fit property

- **clickUrl** (Optional)
  - Type: `string`
  - Description: URL to navigate to when clicked

---

