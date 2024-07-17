'use client';
import { Button, Modal, Row, Table, Tooltip } from 'antd';
import { FC, ReactElement, use, useEffect, useState } from 'react';

import type { TablePaginationConfig } from 'antd/es/table';
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
import MagicTable from '@/app/components/table-v2/table-custom';
import { ColumnsType } from '@/app/interfaces/strapi';


const User: FC = (): ReactElement => {
  const router = useRouter()

  const columns: ColumnsType<IUser>[] = [
    {
      title: 'Usuario',
      dataIndex: ['username'],
      key: 'username',
      filtrable: true,
      
    },
    {
      title: 'Correo',
      dataIndex: ['email'],
      key: 'email',
      filtrable: true,
    },
    {
      title: 'Nombre Completo',
      dataIndex: ['name'],
      key: 'name',
      filtrable: true,
    },
    {
      title: 'Rol',
      dataIndex: ['role', 'name'],
      key: 'role.name',
      filtrable: true,
    },
    {
      title: 'Bloqueado',
      dataIndex: ['blocked'],
      key: 'blocked',
      render: (user: IUser) => (user.blocked ? 'Bloqueado' : 'No bloqueado'),
    },
  ];

  return (
    <MagicTable<IUser, IUser>
      columns={columns}
      url={'users'}
      onAdd={() => router.push('users/form')}
      onEdit={(id) => router.push(`users/form/${id}`,)}
      deleteEntry
      crud
    />
  );
};

export default User;
