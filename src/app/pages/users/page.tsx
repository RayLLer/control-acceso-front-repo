'use client';
import { Button, Modal, Row, Table, Tooltip } from 'antd';
import { FC, ReactElement, use, useEffect, useState } from 'react';

import type { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import type { FilterValue, SorterResult } from 'antd/es/table/interface';
import {
  EditOutlined,
  UserAddOutlined,
  DeleteOutlined,
} from '@ant-design/icons';

import { IUser } from './users.interface';
import { UsersService } from './users.service';
import Link from 'next/link';
import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import {
  SelectAllUsers,
  deleteUser,
  getUsers,
  selectLoading,
  selectLoggedUser,
} from './users.reducer';
import { convertParams } from '@/utils/table';
import { useRouter } from 'next/navigation';
import { PermissionsEnum, validatePermissionName } from '@/utils/permissions';

const usersService = new UsersService();

interface TableParams {
  pagination?: TablePaginationConfig;
  sortField?: string;
  sortOrder?: string;
  filters?: Record<string, FilterValue>;
}

const User: FC = (): ReactElement => {
  const [data, setData] = useState<IUser[]>();
  const [tableParams, setTableParams] = useState<TableParams>({
    pagination: {
      current: 1,
      pageSize: 5,
    },
  });
  const loading = useAppSelector(selectLoading);
  const users = useAppSelector(SelectAllUsers);
  const loggedUser = useAppSelector(selectLoggedUser);
  const dispatch = useAppDispatch();
  const router = useRouter();

  const showConfirmDelete = (user: IUser) => {
    const modal = Modal.confirm({
      title: 'Eliminar',
      content: `¿Está seguro de eliminar el usuario ${user.username}?`,
      onOk: () => dispatch(deleteUser(user.id)),
    });
  };

  const renderUserNameOrLastName = (user: IUser ) =>{
    let fullName = '';
    switch (user.role.name) {
      case 'Cliente':
        fullName = user.client?.fullName ?? '';
        break;
      case 'Conductor':
        fullName = user.driver?.fullName ?? '';
        break;
      case 'Funcionario':
        fullName = user.official?.fullName ?? '';
        break;
      default:
        fullName = user?.fullName ?? '';
        break;
    }
    return fullName;
  }

  const columns: ColumnsType<IUser> = [
    {
      title: 'Usuario',
      dataIndex: '',
      key: 'username',
      render: (user: IUser) => user.username,
    },
    {
      title: 'Correo',
      dataIndex: '',
      key: 'email',
      render: (user: IUser) => user.email,
    },
    {
      title: 'Nombre Completo',
      dataIndex: '',
      key: 'name',
      render: (user: IUser) => renderUserNameOrLastName(user),
    },
    {
      title: 'Rol',
      dataIndex: '',
      key: 'role',
      render: (user: IUser) => user.role.name,
    },
    {
      title: 'Bloqueado',
      dataIndex: '',
      key: 'blocked',
      render: (user: IUser) => (user.blocked ? 'Bloqueado' : 'No bloqueado'),
    },
    {
      title: 'Acciones',
      dataIndex: '',
      key: 'actions',
      render: (user) => {
        return (
          <Row wrap={false} justify={'space-evenly'}>
            <Link
              href={{
                pathname: '/pages/users/form',
                query: { userId: user.id },
              }}
            >
              <Tooltip title={'Editar'}>
                <Button
                  type='primary'
                  icon={<EditOutlined style={{ fontSize: 'large' }} />}
                />
              </Tooltip>
            </Link>
            <Tooltip title={'Eliminar'}>
              <Button
                type='primary'
                danger
                icon={<DeleteOutlined style={{ fontSize: 'large' }} />}
                onClick={() => showConfirmDelete(user)}
              />
            </Tooltip>
          </Row>
        );
      },
    },
  ];

  useEffect(() => {
    // !validatePermissionName(
    //   PermissionsEnum.USERS,
    //   loggedUser.role.permissions
    // ) && router.replace('/pages/dashboard');
  }, []);

  useEffect(() => {
    dispatch(getUsers(convertParams(tableParams)));
  }, [JSON.stringify(tableParams)]);

  const handleTableChange = (
    pagination: TablePaginationConfig,
    filters: Record<string, FilterValue>,
    sorter: SorterResult<any>
  ) => {
    setTableParams({
      pagination,
      filters,
      ...sorter,
    });
    // if (pagination.pageSize !== tableParams.pagination?.pageSize) {
    //   setData([]);
    // }
  };

  return (
    <>
      <Row style={{ marginBottom: 15 }} justify={'end'}>
        <Link href={{ pathname: '/pages/users/form' }}>
          <Button type='primary' icon={<UserAddOutlined />}>
            Crear usuario
          </Button>
        </Link>
      </Row>

      <Table
        columns={columns}
        dataSource={users}
        // pagination={tableParams.pagination}
        pagination={{ pageSize: 10 }}
        loading={loading}
        rowKey={(record: IUser) => record.id}
        scroll={{ x: 500 }}
        // onChange={(pagination, filters, sorter) => {
        //   handleTableChange;
        // }}
      />
    </>
  );
};

export default User;
