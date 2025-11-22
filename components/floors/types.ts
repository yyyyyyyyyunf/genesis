// Define a generic props interface for all floor components
export interface FloorComponentProps<T = unknown> {
  data: T;
}

export interface Floor {
  id: string;
  type: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;
}
