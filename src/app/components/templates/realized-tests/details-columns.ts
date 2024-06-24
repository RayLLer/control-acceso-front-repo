import { IRealizedTestResponse } from '@/app/interfaces/realized-tests';
import { ColumnsType } from '@/app/interfaces/strapi';
import moment from 'moment';

export const details_columns: ColumnsType<IRealizedTestResponse>[] = [
  {
    title: 'Usuario',
    dataIndex: [
      'attributes',
      'users_permissions_user',
      'data',
      'attributes',
      'username',
    ],
  },
  {
    title: 'Test',
    dataIndex: ['attributes', 'test', 'data', 'attributes', 'name'],
    width: '300px',
  },
  {
    title: 'Preguntas Correctas',
    dataIndex: ['attributes', 'correctAnswersQty'],
    align: 'right',
  },
  {
    title: 'Preguntas Incorrectas',
    dataIndex: ['attributes', 'incorrectAnswersQty'],
    align: 'right',
  },
  {
    title: 'Preguntas Dudosas',
    dataIndex: ['attributes', 'doubtAnswersQty'],
    align: 'right',
  },
  {
    title: 'Preguntas en Blanco',
    dataIndex: ['attributes', 'blanckAnswersQty'],
    align: 'right',
  },
  {
    title: 'Porcentaje de Aciertos',
    dataIndex: ['attributes', 'evaluationPercent'],
    align: 'right',
    render: (value) =>
      `${new Intl.NumberFormat('es-Es', {
        style: 'percent',
        minimumFractionDigits: 0,
      }).format(value / 100)}`,
  },
  {
    title: 'Duración',
    dataIndex: ['attributes', 'duration'],
    align: 'right',
    render: (value) => `${value} min`,
  },
  {
    title: 'Fecha de Inicio',
    dataIndex: ['attributes', 'initDate'],
    align: 'right',
    render: (value) => moment(value).format('DD/mm/yyyy HH:mm:ss'),
  },
  {
    title: 'Fecha de Finalización',
    dataIndex: ['attributes', 'finishDate'],
    align: 'right',
    render: (value) => (value ? moment(value).format('DD/mm/yyyy HH:mm:ss') : 'No finalizado'),
  },
  {
    title: 'Calificación',
    dataIndex: ['attributes', 'calification'],
    align: 'right',
  },
];
