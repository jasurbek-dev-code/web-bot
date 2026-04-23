interface IListResponse<T> {
  count: number;
  num_pages: number;
  totalPages: number;
  results: T;
  totals: Record<string, number> | Record<string, number>[];
}

export type { IListResponse };
