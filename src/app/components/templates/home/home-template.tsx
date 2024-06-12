/* eslint-disable react-hooks/exhaustive-deps */
'use client'
import { themeService } from '@/app/services/themes.service';
import { convertParams } from '@/utils/table';
import { GetProp, Table, TableProps } from 'antd';
import { useEffect, useState } from 'react';
import { theme_columns } from './theme-columns';
import { IThemeResponse } from '@/app/interfaces/theme';
import { SorterResult } from 'antd/es/table/interface';

type ColumnsType<T> = TableProps<T>['columns'];
type TablePaginationConfig = Exclude<
  GetProp<TableProps, 'pagination'>,
  boolean
>;

interface TableParams {
  pagination?: TablePaginationConfig;
  sortField?: string;
  sortOrder?: string;
  filters?: Parameters<GetProp<TableProps, 'onChange'>>[1];
}

const HomeTemplate = () => {
  const [data, setData] = useState<IThemeResponse[]>();
  const [loading, setLoading] = useState(false);
  const [tableParams, setTableParams] = useState<TableParams>({
    pagination: {
      current: 1,
      pageSize: 10,
    },
  });

  const fetchData = () => {
    setLoading(true);
    themeService.get(tableParams).then((res)=>{
      setLoading(false);
      setData(res.data.data)
    })
  };

  useEffect(() => {
    fetchData();
  }, [tableParams.pagination?.current, tableParams.pagination?.pageSize, tableParams.sortField, tableParams.sortOrder, tableParams.filters]);

  const convertSortOptions = (sorter: any) => {
    if (!sorter.order) return {};
    const field = sorter.field.filter((f: string) => (f !== 'attributes' && f !== 'data')).join('.');
    return {
      sortField: field,
      sortOrder: sorter.order === 'ascend' ? 'asc' : 'desc',
    };
  }

  const handleTableChange: TableProps['onChange'] = (
    pagination,
    filters,
    sorter
  ) => {
    console.log(convertSortOptions(sorter));
    setTableParams({
      pagination,
      filters,
      ...convertSortOptions(sorter),
    });

    // `dataSource` is useless since `pageSize` changed
    if (pagination.pageSize !== tableParams.pagination?.pageSize) {
      setData([]);
    }
  };
  
  return (
    <Table
      columns={theme_columns}
      rowKey={(record) => record.id}
      dataSource={data}
      pagination={tableParams.pagination}
      loading={loading}
      onChange={handleTableChange}
      bordered
    />
  );
}

export default HomeTemplate