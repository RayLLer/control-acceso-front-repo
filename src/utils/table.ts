import { TablePaginationConfig } from 'antd';

export interface TableParams {
  pagination?: TablePaginationConfig & {limit?: number};
  sortField?: string;
  sortOrder?: string;
  filters?: Record<string, any>;
  populate?: any
  fields?: any
}

export const convertParams = (params: TableParams) => ({
  populate: params?.populate ?? '*',
  pagination: {
    page: params.pagination?.current,
    pageSize: params.pagination?.pageSize,
    limit: params.pagination?.limit,
  },
  filters: params.filters,
  fields: params.fields,
  sort: params.sortField ? [`${params.sortField}:${params.sortOrder}`] : [{ createdAt: 'desc' }],
});
