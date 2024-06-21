import { IRealizedTest } from '@/app/interfaces/realized-tests';
import { ColumnsType } from '@/app/interfaces/strapi';
import moment from 'moment';

export const realized_tests_columns: ColumnsType<IRealizedTest>[] = [
  {
    title: 'Usuario',
    dataIndex: ['users_permissions_user', 'username'],
    filtrable: true,
  },
  {
    title: 'Test',
    dataIndex: ['test', 'name'],
    filtrable: true,
  },
  {
    title: 'Cantidad de intentos',
    dataIndex: ['attempts'],
    filtrable: true,
  },
  {
    title: 'Último resultado',
    dataIndex: ['calification'],
    filtrable: true,
    render: (value) =>
      `${new Intl.NumberFormat('es-Es', {
        style: 'percent',
        minimumFractionDigits: 0,
      }).format(value / 100)}`,
  },
  {
    title: 'fecha del último intento',
    dataIndex: ['initDate'],
    filtrable: true,
    render: (value) =>
      value ? moment(value).format('DD/MM/YYYY HH:mm:ss') : '',
  },
];
