import MagicTable from '@/app/components/table-v2/table-custom';
import { ITheme, IThemeResponse } from '@/app/interfaces/theme';
import React from 'react';
import { theme_columns } from './theme-columns';

const ThemeTable = () => {
  return (
    <MagicTable<IThemeResponse, ITheme>
      columns={theme_columns}
      url={'themes'}
      crud
      onAdd={function (): void {
        throw new Error('Function not implemented.');
      }}
      onEdit={function (id: number): void {
        throw new Error('Function not implemented.');
      }}
      defaultParameters={{
        populate: { category_themes: { populate: 'category' } },
      }}
    />
  );
};

export default ThemeTable;
