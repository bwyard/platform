// ============================================================
// Pagination — standard cursor + offset patterns
// ============================================================

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface CursorParams {
  cursor: string | null;
  limit: number;
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface CursorResult<T> {
  items: T[];
  nextCursor: string | null;
  hasNextPage: boolean;
}
