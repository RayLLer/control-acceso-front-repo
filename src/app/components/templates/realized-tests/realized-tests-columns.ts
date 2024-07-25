import { IRealizedTestAttemptsResponse } from '@/app/interfaces/realized-tests';
import { ColumnsType } from '@/app/interfaces/strapi';
import moment from 'moment';

export const realized_tests_columns: ColumnsType<IRealizedTestAttemptsResponse>[] = [
  {
    title: 'Usuario',
    dataIndex: ['user', 'username'],
    filtrable: true,
    filterType: 'string',
  },
  {
    title: 'Tema',
    dataIndex: ['test', 'theme', 'name'],
    filtrable: true,
    filterType: 'string',
  },
  // {
  //   title: 'Test',
  //   dataIndex: ['lastTest', 'test', 'name'],
  //   filtrable: true,
  //   filterType: 'string',
  // },
  {
    title: 'Cantidad de intentos',
    dataIndex: ['attempts'],
    filtrable: true,
    filterType: 'number',
    render: (value) => `${value ?? 0}`,
  },
  // {
  //   title: 'Calificación',
  //   dataIndex: ['lastTest', 'evaluationPercent'],
  //   // render: (value) => (value ? `${value}` : 'No calificado'),
  // },
  {
    title: 'Último resultado',
    dataIndex: ['evaluationPercent'],
    filtrable: true,
    filterType: 'number',
    render: (value) =>
      `${new Intl.NumberFormat('es-Es', {
        style: 'percent',
        minimumFractionDigits: 1,
      }).format(value / 100)}`,
  },
  {
    title: 'fecha del último intento',
    dataIndex: ['finishDate'],
    filtrable: true,
    filterType: 'date',
    render: (value) =>
      value ? moment(value).format('DD/MM/YYYY HH:mm:ss') : '',
  },
];
