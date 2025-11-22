export const COMPONENT_CODES: Record<number, string> = {
  1: 'Text',
  2: 'Image',
  3: 'Shelf',
  4: 'Tab',
};

export const COMPONENT_NAMES: Record<string, number> = Object.entries(COMPONENT_CODES).reduce((acc, [code, name]) => {
  acc[name] = Number(code);
  return acc;
}, {} as Record<string, number>);

export function getComponentKey(code: number): string | undefined {
  return COMPONENT_CODES[code];
}

export function getComponentCode(name: string): number | undefined {
  return COMPONENT_NAMES[name];
}

