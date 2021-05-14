export type uuid = string;

export interface CrudListResponse<T = Record<string, any>> {
  count: number;
  data: T[];
  page: number;
  pageCount: number;
  total: number;
}
