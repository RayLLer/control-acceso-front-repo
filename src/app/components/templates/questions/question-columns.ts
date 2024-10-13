import { IQuestionResponse } from '@/app/interfaces/question';
import { ColumnsType } from '@/app/interfaces/strapi';

export const question_columns: ColumnsType<IQuestionResponse>[] = [
  {
    title: 'Pregunta',
    dataIndex: ['attributes', 'questionText'],
    sorter: true,
    filtrable: true,
    filterType: 'string',
  },
  {
    title: 'Cuerpo',
    dataIndex: ['attributes', 'category', 'data', 'attributes', 'name'],
    sorter: true,
    filtrable: true,
    filterType: 'string',
  },
  {
    title: 'Tema',
    dataIndex: ['attributes', 'theme', 'data', 'attributes', 'name'],
    sorter: true,
    filtrable: true,
    filterType: 'string',
  },
  {
    title: 'SubTema',
    dataIndex: ['attributes', 'sub_theme', 'data', 'attributes', 'name'],
    sorter: true,
    filtrable: true,
    filterType: 'string',
  },
  {
    title: 'Ley y Artículo',
    dataIndex: ['attributes', 'referencia'],
    sorter: true,
    filtrable: true,
    filterType: 'string',
  },
  // {
  //   title: 'Bloque',
  //   dataIndex: ['attributes', 'block', 'data', 'attributes', 'name'],
  //   sorter: true,
  //   filtrable: true,
  //   filterType: 'string',
  // },
  // {
  //   title: 'Tema',
  //   dataIndex: ['attributes', 'theme', 'data', 'attributes', 'name'],
  //   render: (data) => data.length,
  // },
  // {
  //   title: 'Tests',
  //   dataIndex: ['attributes', 'tests', 'data'],
  //   render: (data) => data.length,
  // },
];
