export const COMPONENT_MAP: Record<number, { name: string; label: string }> = {
  1: { name: 'Text', label: '文本' },
  2: { name: 'Image', label: '图片' },
  3: { name: 'Shelf', label: '货架' },
  4: { name: 'Tab', label: '标签页' },
  5: { name: 'Button', label: '按钮' },
  6: { name: 'Video', label: '视频' },
  7: { name: 'Carousel', label: '轮播图' },
  8: { name: 'Spacer', label: '间距' },
  9: { name: 'Feed', label: '信息流' },
  10: { name: 'Accordion', label: '折叠面板' },
  11: { name: 'Form', label: '表单' },
  12: { name: 'Countdown', label: '倒计时' },
  13: { name: 'AvatarGroup', label: '头像组' },
  14: { name: 'Divider', label: '分割线' },
};

export const COMPONENT_CODES: Record<number, string> = Object.entries(COMPONENT_MAP).reduce((acc, [code, { name }]) => {
  acc[Number(code)] = name;
  return acc;
}, {} as Record<number, string>);

export const COMPONENT_LABELS: Record<string, string> = Object.values(COMPONENT_MAP).reduce((acc, { name, label }) => {
  acc[name] = label;
  return acc;
}, {} as Record<string, string>);

export const COMPONENT_NAMES: Record<string, number> = Object.entries(COMPONENT_MAP).reduce((acc, [code, { name }]) => {
  acc[name] = Number(code);
  return acc;
}, {} as Record<string, number>);

export function getComponentKey(code: number): string | undefined {
  return COMPONENT_MAP[code]?.name;
}

export function getComponentCode(name: string): number | undefined {
  return COMPONENT_NAMES[name];
}

export function getComponentLabel(code: number): string | undefined {
  return COMPONENT_MAP[code]?.label;
}
