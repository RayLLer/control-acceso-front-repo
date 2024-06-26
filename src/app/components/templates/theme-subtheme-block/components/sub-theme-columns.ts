import {
  ICategoryResponse,
  ISubThemeResponse,
} from '@/app/interfaces/question';
import { ColumnsType } from '@/app/interfaces/strapi';
import { ITestResponse } from '@/app/interfaces/test';
import { IThemeResponse } from '@/app/interfaces/theme';

export const subtheme_columns: ColumnsType<ISubThemeResponse>[] = [
  {
    title: 'Nombre del SubTema',
    dataIndex: ['attributes', 'name'],
    sorter: true,
    filtrable: true,
  },
  {
    title: 'Tema',
    dataIndex: ['attributes', 'theme', 'data', 'attributes', 'name'],
    sorter: true,
    filtrable: true,
  },
];
