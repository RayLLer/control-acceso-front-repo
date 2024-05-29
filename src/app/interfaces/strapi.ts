import { ColumnType } from 'antd/es/table';

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

export type CountTVColumnsType<T> = ColumnType<T> & {
  dataType?: 'string' | 'number' | 'date';
};
