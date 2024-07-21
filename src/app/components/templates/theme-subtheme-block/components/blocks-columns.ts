import {
  IBlockResponse,
  ISubThemeResponse
} from '@/app/interfaces/question';
import { ColumnsType } from '@/app/interfaces/strapi';

export const block_columns: ColumnsType<IBlockResponse>[] = [
  {
    title: 'Nombre del Bloque',
    dataIndex: ['attributes', 'name'],
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
];
