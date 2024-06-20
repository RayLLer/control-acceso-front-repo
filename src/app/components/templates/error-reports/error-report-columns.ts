import { IErrorReportResponse } from '@/app/interfaces/error-reports';
import { ColumnsType } from '@/app/interfaces/strapi';
import moment from 'moment';

export const error_report_columns: ColumnsType<IErrorReportResponse>[] = [
  {
    title: 'Pregunta',
    dataIndex: ['attributes', 'question', 'data', 'attributes', 'questionText'],
    filtrable: true,
  },
  {
    title: 'Causa',
    dataIndex: ['attributes', 'selectedCause'],
    filtrable: true,
  },
  {
    title: 'Texto del error',
    dataIndex: ['attributes', 'textError'],
    filtrable: true,
  },
  {
    title: 'Fecha',
    dataIndex: ['attributes', 'date'],
    filtrable: true,
    render (value, record, index) {
      return moment(value).format('DD/MM/YYYY HH:mm:ss');
    },
  },
  {
    title: 'Usuario',
    dataIndex: ['attributes', 'users_permissions_user', 'data', 'attributes', 'username'],
    filtrable: true,
  },
]