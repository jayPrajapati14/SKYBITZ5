declare global {
  export type PaginatedResponse<T, K extends string = "items"> = Promise<
    Record<K, T[]> & {
      totalCount: number;
    }
  >;
}
