// 定义所有楼层组件的通用 Props 接口
export interface FloorComponentProps<T = unknown> {
  data: T;
}

export interface Floor {
  id: string;
  type: number; // 从字符串改为数字
  alias?: string; // 用户定义的楼层别名，用于标识楼层
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;
}
