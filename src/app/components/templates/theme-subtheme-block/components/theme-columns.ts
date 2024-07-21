import { ColumnsType } from '@/app/interfaces/strapi';
import { IThemeResponse } from '@/app/interfaces/theme';

export const theme_columns: ColumnsType<IThemeResponse>[] = [
  {
    title: 'Nombre del Tema',
    dataIndex: ['attributes', 'name'],
    sorter: true,
    filtrable: true,
    filterType: 'string',
  },
  {
    title: 'Cuerpo/s',
    dataIndex: [
      'attributes',
      'category_themes',
      'category',
      'attributes',
      'name',
    ],
    sorter: true,
    filtrable: true,
    filterType: 'string',
    render: (_, record) =>
      record.attributes.category_themes.data
        ?.map((d) => d.attributes.category.data?.attributes.name)
        .join(', ') ?? '',
  },
  {
    title: 'Etiqueta',
    dataIndex: ['attributes', 'tag'],
    sorter: true,
    filtrable: true,
    filterType: 'string',
  },
];
