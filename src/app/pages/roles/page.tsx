'use client';
import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import { TableParams, convertParams } from '@/utils/table';
import {
  Button,
  Modal,
  Row,
  Table,
  TablePaginationConfig,
  Tooltip,
} from 'antd';
import {
  ColumnsType,
  FilterValue,
  SorterResult,
} from 'antd/es/table/interface';
import { FC, useState, useEffect } from 'react';
import { IRole } from './roles.interface';
import {
  SelectAllRoles,
  deleteRole,
  fetchRoles,
  selectLoading,
} from './roles.reducer';
import Link from 'next/link';

import { EditOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { selectLoggedUser } from '../users/users.reducer';
import { useRouter } from 'next/navigation';
import { PermissionsEnum, validatePermissionName } from '@/utils/permissions';

const Roles: FC = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const roles = useAppSelector(SelectAllRoles);
  const loading = useAppSelector(selectLoading);
  const loggedUser = useAppSelector(selectLoggedUser);
  const [tableParams, setTableParams] = useState<TableParams>({
    pagination: {
      current: 1,
      pageSize: 10,
    },
  });

  const columns: ColumnsType<IRole> = [
    {
      title: 'Nombre',
      dataIndex: '',
      key: 'name',
      render: (role: IRole) => `${(role && role.name) || ''}`,
    },
    {
      title: 'Descripción',
      dataIndex: '',
      key: 'description',
      render: (role: IRole) => `${(role && role.description) || ''}`,
    },
    {
      title: 'Tipo',
      dataIndex: '',
      key: 'type',
      render: (role: IRole) => `${(role && role.type) || ''}`,
    },
    {
      title: 'Acciones',
      dataIndex: '',
      key: 'actions',
      render: (role: IRole) => {
        return (
          <Row wrap={false} justify={'space-evenly'}>
            <Link
              href={{
                pathname: '/pages/roles/form',
                query: { roleId: role.id },
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
                onClick={() => showConfirmDelete(role)}
              />
            </Tooltip>
          </Row>
        );
      },
    },
  ];

  const handleFetchRoles = () => {
    dispatch(fetchRoles(convertParams(tableParams)));
  };

  useEffect(() => {
    // !hasPermission(loggedUser.role.permissions, 'user', 'find') &&
    //   router.replace('/pages/dashboard');
  }, []);

  useEffect(() => {
    handleFetchRoles();
  }, [JSON.stringify(tableParams)]);

  const showConfirmDelete = (role: IRole) => {
    const modal = Modal.confirm({
      title: 'Eliminar',
      content: `¿Está seguro de eliminar el rol ${role.name}?`,
      onOk: () => dispatch(deleteRole(role.id)),
    });
  };

  return (
    <>
      <Row style={{ marginBottom: 15 }} justify={'end'}>
        <Link href={{ pathname: '/pages/roles/form' }}>
          <Button type='primary' icon={<PlusOutlined />}>
            Crear rol
          </Button>
        </Link>
      </Row>
      <Table
        columns={columns}
        dataSource={roles}
        pagination={{ pageSize: 15 }}
        loading={loading}
        rowKey={(record: IRole) => record.id}
        scroll={{ x: 500 }}
        // onChange={(pagination, filters, sorter) =>
        //   handleTableChange(pagination, filters, sorter)
        // }
      />
    </>
  );
};

export default Roles;
