import { IRealizedTestAttemptsResponse } from '@/app/interfaces/realized-tests';
import { ColumnsType } from '@/app/interfaces/strapi';
import moment from 'moment';

export const realized_tests_columns: ColumnsType<IRealizedTestAttemptsResponse>[] = [
  {
    title: 'Usuario',
    dataIndex: ['user', 'username'],
    filtrable: true,
  },
  {
    title: 'Test',
    dataIndex: ['lastTest', 'test', 'name'],
    filtrable: true,
  },
  {
    title: 'Cantidad de intentos',
    dataIndex: ['attempts'],
    filtrable: true,
    render: (value) => `${value ?? 0}`,
  },
  // {
  //   title: 'Calificación',
  //   dataIndex: ['lastTest', 'evaluationPercent'],
  //   // render: (value) => (value ? `${value}` : 'No calificado'),
  // },
  {
    title: 'Último resultado',
    dataIndex: ['lastTest', 'evaluationPercent'],
    filtrable: true,
    render: (value) =>
      `${new Intl.NumberFormat('es-Es', {
        style: 'percent',
        minimumFractionDigits: 1,
      }).format(value / 100)}`,
  },
  {
    title: 'fecha del último intento',
    dataIndex: ['lastTest', 'finishDate'],
    filtrable: true,
    render: (value) =>
      value ? moment(value).format('DD/MM/YYYY HH:mm:ss') : '',
  },
];
