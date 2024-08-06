/* eslint-disable react-hooks/exhaustive-deps */
'use client';
import { ColumnsType, TableParams } from '@/app/interfaces/strapi';
import { AUTHENTICATED, PUBLIC } from '@/app/pages/roles/roles.reducer';
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
  Tooltip,
  theme as antdTheme,
  notification,
} from 'antd';
import type { FilterDropdownProps } from 'antd/es/table/interface';
import axios from 'axios';
import React, {
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';
import FilterComponent from './filter';

type ParametersType = {
  populate?: any;
  filters?: any;
};

type ActionType<T> = {
  icon: React.ReactNode;
  onClick: (record?: T) => void;
  tooltip: string;
};

type Props<T, R> = TableProps & {
  columns: ColumnsType<T>;
  url: string;
  onAdd: () => void;
  onEdit: (id: number) => void;
  onDelete?: (id: number) => Promise<void | boolean | string>;
  crud?: boolean;
  defaultParameters?: ParametersType;
  refetch?: boolean;
  deleteEntry?: boolean;
  setRefetch?: (value: boolean) => void;
  moreActions?: ActionType<T>[];
  topActions?: ActionType<T>[];
};

const MagicTable = <T, R>({
  columns,
  url,
  crud,
  onEdit,
  onAdd,
  defaultParameters,
  moreActions,
  topActions,
  refetch,
  deleteEntry,
  setRefetch,
  onDelete,
  ...others
}: Props<T, R>) => {
  const [data, setData] = useState<T[]>();
  const { modal } = App.useApp();
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
    const newParams = { ...params } as TableParams & ParametersType;
    newParams.filters = { ...params.filters, ...defaultParameters?.filters };
    newParams.populate = defaultParameters?.populate
      ? { ...defaultParameters?.populate }
      : undefined;
    baseService
      .get(newParams)
      .then((res: any) => {
        setLoading(false);
        switch (url) {
          case 'users':
            setData(res.data as any);
            break;
          case 'users-permissions/roles':
            setData(
              res.data.roles.filter(
                (rol: any) => rol.type !== AUTHENTICATED && rol.type !== PUBLIC
              ) as any
            );
            break;

          default:
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
            break;
        }
      })
      .catch((error: any) => {
        setLoading(false);
      });
  };

  const handleDelete = (id: number) => {
    modal.confirm({
      title: '¿Estás seguro de eliminar este registro?',
      onOk: async () => {
        try {
          if (onDelete) {
            const canDelete = await onDelete(id);
            if (typeof canDelete === 'string') {
              notification.error({
                message: canDelete,
              });
              return;
            }
            if (!canDelete) {
              notification.error({
                message: 'No se puede eliminar el registro',
              });
              return;
            }
          }
          !deleteEntry
            ? baseService.put(id, { deleted: true } as any).then(() => {
                notification.success({
                  message: 'Registro eliminado correctamente',
                });
                fetchData(tableParams);
              })
            : baseService.delete(id).then(() => {
                notification.success({
                  message: 'Registro eliminado correctamente',
                });
                fetchData(tableParams);
              });
        } catch (error) {
          if (axios.isAxiosError(error)) {
            notification.error({
              message: error.response?.data.message,
            });
          }
        }
      },
    });
  };

  useEffect(() => {
    !data && fetchData(tableParams);
  }, []);

  useEffect(() => {
    if (refetch && setRefetch) {
      fetchData(tableParams);
      setRefetch(false);
    }
  }, [refetch]);

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

  const getColumnSearchProps = (
    dataIndex: string,
    title: string,
    filterType: 'string' | 'number' | 'date' | 'boolean'
  ): TableColumnType<T> => ({
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
        title={title}
        handleSearch={handleSearch}
        handleReset={handleReset}
        type={filterType}
      />
    ),
    filterIcon: (filtered: boolean) => (
      <SearchOutlined
        style={{
          color: isColumnFiltered(dataIndex) ? token.colorPrimary : undefined,
        }}
      />
    ),
  });

  const table_columns: ColumnsType<T>[] = useMemo(() => {
    const newColumns =
      columns?.map((column: any) => {
        return column.filtrable
          ? {
              ...column,
              ...getColumnSearchProps(
                column.dataIndex
                  .filter((f: string) => f !== 'attributes' && f !== 'data')
                  .join('.'),
                column.title,
                column.filterType
              ),
            }
          : column;
      }) ?? [];
    if (crud) {
      newColumns.push({
        title: 'Acciones',
        key: 'action',
        render: (record: T) => {
          const more = moreActions?.map((action, index) => {
            return (
              <Tooltip title={action.tooltip} key={`index-${index}`}>
                <Button
                  key={`index-${index}`}
                  type='text'
                  shape='circle'
                  icon={action.icon}
                  size='large'
                  onClick={() => action.onClick(record)}
                />
              </Tooltip>
            );
          });
          return (
            <Space size='small'>
              <Tooltip title='Editar'>
                <Button
                  type='text'
                  shape='circle'
                  icon={<EditOutlined style={{ fontSize: 20 }} />}
                  size='large'
                  onClick={() => onEdit((record as any).id as number)}
                />
              </Tooltip>
              <Tooltip title='Eliminar'>
                <Button
                  type='text'
                  danger
                  size='large'
                  shape='circle'
                  icon={<DeleteOutlined style={{ fontSize: 20 }} />}
                  onClick={() => handleDelete((record as any).id as number)}
                />
              </Tooltip>
              {more}
            </Space>
          );
        },
      });
    } else {
      if (moreActions) {
        newColumns.push({
          title: 'Acciones',
          key: 'action',
          render: (record: T) => {
            const more = moreActions?.map((action, index) => {
              return (
                <Tooltip title={action.tooltip} key={`index-${index}`}>
                  <Button
                    key={`index-${index}`}
                    type='text'
                    shape='circle'
                    icon={action.icon}
                    size='large'
                    onClick={() => action.onClick(record)}
                  />
                </Tooltip>
              );
            });
            return <Space size='small'>{more}</Space>;
          },
        });
      }
    }

    return newColumns;
  }, [columns]);

  return (
    <>
      {crud && (
        <Row justify='end' style={{ marginBottom: 16 }}>
          <Button type='primary' onClick={onAdd} style={{ marginBottom: 16 }}>
            Agregar
          </Button>
          {topActions?.map((action, index) => {
            return (
              <Tooltip title={action.tooltip} key={`index-${index}`}>
                <Button
                  key={`index-${index}`}
                  type='primary'
                  // icon={action.icon}
                  onClick={() => action.onClick()}
                  style={{ marginLeft: 8, marginBottom: 16 }}
                >
                  {action.tooltip}
                </Button>
              </Tooltip>
            );
          })}
        </Row>
      )}
      <Table
        columns={table_columns}
        rowKey={(record) => record.id}
        dataSource={data}
        pagination={tableParams.pagination}
        loading={loading}
        onChange={handleTableChange}
        bordered
        style={{ height: '100%' }}
        scroll={{ x: 700 }}
        {...others}
      />
    </>
  );
};

export default MagicTable;
