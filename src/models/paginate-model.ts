export class PaginateModel {
  pageIndex: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  indexFrom: number;
  items: any[];
  hasPreviousPage: boolean;
  hasNextPage: boolean
}
