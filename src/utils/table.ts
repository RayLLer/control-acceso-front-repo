import { TablePaginationConfig } from 'antd';
import { FilterValue } from 'antd/es/table/interface';

export interface TableParams {
  pagination?: TablePaginationConfig & {limit?: number};
  sortField?: string;
  sortOrder?: string;
  filters?: Record<string, any>;
}

export const convertParams = (params: TableParams) => ({
  ...params,
  pagination: {
    page: params.pagination?.current,
    pageSize: params.pagination?.pageSize,
    limit: params.pagination?.limit,
  },
  filters: params.filters,
});
