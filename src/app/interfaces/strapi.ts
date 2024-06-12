import { GetProp } from 'antd';
import { ColumnType, TableProps } from 'antd/es/table';

export interface StrapiResponse<T> {
  data: T[];
  meta: IMeta;
}
export interface IMeta {
  pagination?: {
    page: number;
    pageSize: number;
    pageCount: number;
    total: number;
  };
}

// export type CountTVColumnsType<T> = ColumnType<T> & {
//   dataType?: 'string' | 'number' | 'date';
// };

export type ColumnsType<T> = TableProps<T>['columns'];
export type TablePaginationConfig = Exclude<
  GetProp<TableProps, 'pagination'>,
  boolean
>;

export interface TableParams {
  pagination?: TablePaginationConfig;
  sortField?: string;
  sortOrder?: string;
  filters?: Parameters<GetProp<TableProps, 'onChange'>>[1];
}
