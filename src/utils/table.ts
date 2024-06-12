import { TablePaginationConfig } from 'antd';

export interface TableParams {
  pagination?: TablePaginationConfig & {limit?: number};
  sortField?: string;
  sortOrder?: string;
  filters?: Record<string, any>;
}

export const convertParams = (params: TableParams) => ({
  pagination: {
    page: params.pagination?.current,
    pageSize: params.pagination?.pageSize,
    limit: params.pagination?.limit,
  },
  filters: params.filters,
  sort: params.sortField ? {0:`${params.sortField}:${params.sortOrder}`} : undefined,
});
