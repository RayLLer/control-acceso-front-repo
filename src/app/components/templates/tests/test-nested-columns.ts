import { ITestResponse, Question, TestQuestionResponse, TestQuestions } from '@/app/interfaces/test';
import { ColumnsType } from './../../../interfaces/strapi';

export const nested_columns: ColumnsType<TestQuestionResponse> = [
  {
    title: 'Pregunta',
    dataIndex: ['attributes', 'question', 'data', 'attributes', 'questionText'],
  },
  {
    title: 'Cuerpo',
    dataIndex: [
      'attributes',
      'question',
      'data',
      'attributes',
      'category',
      'data',
      'attributes',
      'name',
    ],
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
  },
  {
    title: 'SubTema',
    dataIndex: [
      'attributes',
      'question',
      'data',
      'attributes',
      'sub_theme',
      'data',
      'attributes',
      'name',
    ],
  },
];
