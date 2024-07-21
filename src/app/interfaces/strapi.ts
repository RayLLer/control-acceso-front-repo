import { GetProp, TableColumnProps } from 'antd';
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

type FilterOperators = {
  $eq?: string | number | boolean | Date;
  $ne?: string | number | boolean | Date;
  $lt?: string | number | Date;
  $lte?: string | number | Date;
  $gt?: string | number | Date;
  $gte?: string | number | Date;
  $in?: (string | number | boolean | Date)[];
  $nin?: (string | number | boolean | Date)[];
  $notNull?: boolean;
  $null?: boolean;
  $contains?: string;
  $ncontains?: string;
  $containss?: string;
  $ncontainss?: string;
  $startsWith?: string;
  $endsWith?: string;
};

interface NestedFilter {
  [key: string]:
    | string
    | number
    | boolean
    | Date
    | FilterOperators
    | NestedFilter
    | NestedFilter[];
}

export interface StrapiFilter extends NestedFilter {}

// export type CountTVColumnsType<T> = ColumnType<T> & {
//   dataType?: 'string' | 'number' | 'date';
// };

// export type ColumnsType<T> = TableProps<T>['columns'];
export type ColumnsType<T> = TableColumnProps<T> & {
  filtrable?: boolean;
  filterType?: 'string' | 'number' | 'date' | 'boolean';
};
export type TablePaginationConfig = Exclude<
  GetProp<TableProps, 'pagination'>,
  boolean
>;

export interface TableParams {
  pagination?: TablePaginationConfig;
  sortField?: string;
  sortOrder?: string;
  filters?: StrapiFilter;
}
