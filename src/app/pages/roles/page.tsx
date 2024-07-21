'use client';
import { FC } from 'react';
import { IRole } from './roles.interface';

import MagicTable from '@/app/components/table-v2/table-custom';
import { ColumnsType } from '@/app/interfaces/strapi';
import { useRouter } from 'next/navigation';

const Roles: FC = () => {
  const router = useRouter();

  const columns: ColumnsType<IRole>[] = [
    {
      title: 'Nombre',
      dataIndex: ['name'],
      key: 'name',
      // filtrable: true,
      filterType: 'string',
    },
    {
      title: 'Descripción',
      dataIndex: ['description'],
      key: 'description',
      // filtrable: true,
      filterType: 'string',
    },
    {
      title: 'Tipo',
      dataIndex: ['type'],
      key: 'type',
      // filtrable: true,
      filterType: 'string',
    },
  ];

  return (
    <MagicTable<IRole, IRole>
      columns={columns}
      url={'users-permissions/roles'}
      onAdd={function (): void {
        router.push('roles/form');
      }}
      onEdit={function (id: number): void {
        router.push(`roles/form?roleId=${id}`);
      }}
      crud
    />
  );
};

export default Roles;
