/* eslint-disable react-hooks/exhaustive-deps */
'use client';
import { ColumnsType, TableParams } from '@/app/interfaces/strapi';
import { BaseApi } from '@/utils/baseApi';
import { convertStringToObject } from '@/utils/filter-transformer';
import {
  DeleteOutlined,
  EditOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import {
  App,
  Button,
  Row,
  Space,
  Table,
  TableColumnType,
  TableProps,
  theme as antdTheme
} from 'antd';
import type { FilterDropdownProps } from 'antd/es/table/interface';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import FilterComponent from './filter';

type Props<T, R> = TableProps & {
  columns: ColumnsType<T>;
  url: string;
  onAdd: () => void;
  onEdit: (id: number) => void;
  crud?: boolean;
  defaultParameters?: any
};

const MagicTable = <T, R>({
  columns,
  url,
  crud,
  onEdit,
  onAdd,
  defaultParameters,
  ...others
}: Props<T, R>) => {
  const [data, setData] = useState<T[]>();
  const {modal} = App.useApp()
  const token = antdTheme.useToken().token;
  const [loading, setLoading] = useState(false);
  const [tableParams, setTableParams] = useState<TableParams>({
    pagination: {
      current: 1,
      pageSize: 10,
    },
  });

  const filteredColumnsRef = useRef<Set<string>>(new Set());

  const addItemsToFilter = (dataIndex: string) => {
    filteredColumnsRef.current.add(dataIndex);
  };

  const removeItemsFromFilter = (dataIndex: string) => {
    filteredColumnsRef.current.delete(dataIndex);
  };

  const clearFilters = () => {
    filteredColumnsRef.current.clear();
  };

  const isColumnFiltered = (dataIndex: string) => {
    return filteredColumnsRef.current.has(dataIndex);
  };

  const tableParamsRef = React.useRef<TableParams>(tableParams);

  const baseService = new BaseApi<T, R>(url);

  const fetchData = (params: TableParams) => {
    setLoading(true);
    baseService
      .get({...defaultParameters, ...params})
      .then((res) => {
        setLoading(false);
        setData(res.data.data);
        setTableParams({
          ...params,
          pagination: {
            current: res.data.meta.pagination?.page,
            pageSize: res.data.meta.pagination?.pageSize,
            total: res.data.meta.pagination?.total,
          },
        });
        tableParamsRef.current = {
          ...params,
          pagination: {
            current: res.data.meta.pagination?.page,
            pageSize: res.data.meta.pagination?.pageSize,
            total: res.data.meta.pagination?.total,
          },
        };
      })
      .catch(() => {
        setLoading(false);
      });
  };

  const handleDelete = (id: number) => {
    modal.confirm({
      title: '¿Estás seguro de eliminar este registro?',
      onOk: () => {
        baseService.delete(id).then(() => {
          fetchData(tableParams);
        });
      },
    });
  }

  

  useEffect(() => {
    !data && fetchData(tableParams);
  }, []);

  const convertSortOptions = (sorter: any) => {
    if (!sorter.order) return {};
    const field = sorter.field
      .filter((f: string) => f !== 'attributes' && f !== 'data')
      .join('.');
    return {
      sortField: field,
      sortOrder: sorter.order === 'ascend' ? 'asc' : 'desc',
    };
  };

  const handleTableChange: TableProps['onChange'] = (
    pagination,
    filters,
    sorter
  ) => {
    const tempParams = {
      pagination,
      filters: tableParamsRef.current.filters,
      ...convertSortOptions(sorter),
    };
    setTableParams(() => ({
      ...tempParams,
    }));
    tableParamsRef.current = { ...tempParams };

    fetchData(tempParams);
  };

  const handleSearch = (
    selectedKeys: string,
    confirm: FilterDropdownProps['confirm'],
    dataIndex: string,
    filterOperator: string
  ) => {
    addItemsToFilter(dataIndex);
    const filter = convertStringToObject(
      dataIndex + '.' + filterOperator,
      selectedKeys
    );
    const newTableParams = { ...tableParamsRef.current };
    newTableParams.filters = {
      ...tableParamsRef.current.filters,
      ...filter,
    };
    fetchData(newTableParams);
    setTableParams(() => ({ ...newTableParams }));
    tableParamsRef.current = { ...newTableParams };
    confirm();
  };

  const handleReset = (index?: string) => {
    const newTableParams = { ...tableParams };
    if (index === undefined) {
      newTableParams.filters = undefined;
      clearFilters();
    } else {
      newTableParams.filters = {
        ...tableParams.filters,
        [index.split('.')[0] as any]: undefined,
      };
      removeItemsFromFilter(index);
    }
    fetchData(newTableParams);
    setTableParams(() => ({ ...newTableParams }));
  };

  const getColumnSearchProps = (dataIndex: string): TableColumnType<T> => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
    }) => (
      <FilterComponent
        close={close}
        confirm={confirm}
        selectedKeys={selectedKeys}
        setSelectedKeys={setSelectedKeys}
        clearFilters={clearFilters}
        visible={true}
        prefixCls='ant-table-filter-dropdown'
        dataIndex={dataIndex}
        handleSearch={handleSearch}
        handleReset={handleReset}
      />
    ),
    filterIcon: (filtered: boolean) => (
      <SearchOutlined
        style={{
          color: isColumnFiltered(dataIndex) ? token.colorPrimary : undefined,
        }}
      />
    ),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        // setTimeout(() => searchInput.current?.select(), 100);
      }
    },
  });

  const table_columns: ColumnsType<T> = useMemo(() => {
    const newColumns =
      columns?.map((column: any) => {
        return {
          ...column,
          ...getColumnSearchProps(
            column.dataIndex
              .filter((f: string) => f !== 'attributes' && f !== 'data')
              .join('.')
          ),
        };
      }) ?? [];
    if (crud) {
      newColumns.push({
        title: 'Acciones',
        key: 'action',
        render: (record: T) => (
          <Space size='small'>
            <Button
              type='text'
              shape='circle'
              icon={<EditOutlined style={{ fontSize: 20 }} />}
              size='large'
              onClick={() => onEdit((record as any).id as number)}
            />
            <Button
              type='text'
              danger
              size='large'
              shape='circle'
              icon={<DeleteOutlined style={{ fontSize: 20 }} />}
              onClick={() =>handleDelete((record as any).id as number)}
            />
          </Space>
        ),
      });
    }
    return newColumns;
  }, [columns]);

  return (
    <>
      <Row justify='end' style={{ marginBottom: 16 }}>
        <Button type='primary' onClick={onAdd} style={{ marginBottom: 16 }}>
          Agregar
        </Button>
      </Row>
      <Table
        columns={table_columns}
        rowKey={(record) => record.id}
        dataSource={data}
        pagination={tableParams.pagination}
        loading={loading}
        onChange={handleTableChange}
        bordered
        style={{ height: '100%' }}
        scroll={{ x: 700}}
        {...others}
      />
    </>
  );
};

export default MagicTable;
