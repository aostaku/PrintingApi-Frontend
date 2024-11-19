export interface PageableCollection<T> {
  data: T[];
  pageIndex: number;
  totalPages: number;
}
