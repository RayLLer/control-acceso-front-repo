'use client';
import { FC } from 'react';
import { IRole } from './roles.interface';

import MagicTable from '@/app/components/table-v2/table-custom';
import { ColumnsType } from '@/app/interfaces/strapi';
import { useRouter } from 'next/navigation';
import { RolesServices } from './roles.service';
import { userService } from '../users/users.service';
import { notification } from 'antd';

const roleServices = new RolesServices();

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

  const handleDelete = async (id: number) => {
    try {
      const usersResponse = (await userService.get({
        filters: {
          role: {
            id: {
              $eq: id,
            },
          },
        },
      })) as any;
      if (usersResponse.data.length > 0) {
        notification.error({
          message:
            'No se puede eliminar el rol porque tiene usuarios asociados.',
        });
        return;
      }
      await roleServices.delete(id);
      notification.success({
        message: 'El registro ha sido eliminado correctamente.',
      });
    } catch (error) {
      notification.error({
        message: 'Error al eliminar el registro.',
      });
    }
  };

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
      onDelete={handleDelete}
      crud
      deleteEntry
    />
  );
};

export default Roles;
