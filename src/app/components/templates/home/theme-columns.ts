import { IThemeResponse } from '@/app/interfaces/theme';
import { TableProps } from 'antd';

export const theme_columns: TableProps<IThemeResponse>['columns'] = [
  {
    title: 'Nombre',
    dataIndex: ['attributes', 'name'],
    sorter: true,
  },
  {
    title: 'Categorías',
    dataIndex: ['attributes', 'category_themes', 'data'],
    render: (data) => data.map((category: any) => category.attributes.name).join(', '),
  },
  {
    title: 'Preguntas',
    dataIndex: ['attributes', 'questions', 'data'],
    render: (data) => data.length,
  },
  {
    title: 'Tests',
    dataIndex: ['attributes', 'tests', 'data'],
    render: (data) => data.length,
  }
];
