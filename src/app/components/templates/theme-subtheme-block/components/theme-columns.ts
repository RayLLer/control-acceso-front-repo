import { ColumnsType } from '@/app/interfaces/strapi';
import { IThemeResponse } from '@/app/interfaces/theme';

export const theme_columns: ColumnsType<IThemeResponse>[] = [
  {
    title: 'Nombre del Tema',
    dataIndex: ['attributes', 'name'],
    sorter: true,
    filtrable: true,
  },
  {
    title: 'Cuerpo/s',
    dataIndex: ['attributes', 'category_themes', 'data'],
    sorter: true,
    filtrable: true,
    render: (data: any[]) =>
      data?.map((d) => d.attributes.category.data?.attributes.name).join(', ') ?? '',
  },
  {
    title: 'Etiqueta',
    dataIndex: ['attributes', 'tag'],
    sorter: true,
    filtrable: true,
  },
];
