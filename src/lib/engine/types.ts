// 定义所有楼层组件的通用 Props 接口
export interface FloorComponentProps<T = unknown> {
  data: T;
}

export interface Floor {
  id: string;
  type: number; // Changed from string to number
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;
}
