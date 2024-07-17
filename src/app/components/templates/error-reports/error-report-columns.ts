import { IErrorReportResponse } from '@/app/interfaces/error-reports';
import { ColumnsType } from '@/app/interfaces/strapi';
import moment from 'moment';

export const error_report_columns: ColumnsType<IErrorReportResponse>[] = [
  {
    title: 'Pregunta',
    dataIndex: ['attributes', 'question', 'data', 'attributes', 'questionText'],
    filtrable: true,
    filterType: 'string',
  },
  {
    title: 'Tema',
    dataIndex: [
      'attributes',
      'question',
      'data',
      'attributes',
      'theme',
      'data',
      'attributes',
      'name',
    ],
    filtrable: true,
    filterType: 'string',
  },
  {
    title: 'Causa',
    dataIndex: ['attributes', 'selectedCause'],
    filtrable: true,
    filterType: 'string',
  },
  {
    title: 'Texto del error',
    dataIndex: ['attributes', 'textError'],
    filtrable: true,
    filterType: 'string',
  },
  {
    title: 'Fecha',
    dataIndex: ['attributes', 'date'],
    filtrable: true,
    filterType: 'date',
    render(value, record, index) {
      return moment(value).format('DD/MM/YYYY HH:mm:ss');
    },
  },
  {
    title: 'Usuario',
    dataIndex: [
      'attributes',
      'users_permissions_user',
      'data',
      'attributes',
      'username',
    ],
    filtrable: true,
    filterType: 'string',
  },
];