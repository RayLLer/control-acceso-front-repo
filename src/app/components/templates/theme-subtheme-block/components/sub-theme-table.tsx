import MagicTable from '@/app/components/table-v2/table-custom';
import { ISubTheme, ISubThemeResponse } from '@/app/interfaces/question';
import React from 'react'
import { subtheme_columns } from './sub-theme-columns';

const SubThemeTable = () => {
  return (
    <MagicTable<ISubThemeResponse, ISubTheme>
      columns={subtheme_columns}
      url={'sub-themes'}
      crud
      onAdd={function (): void {
        throw new Error('Function not implemented.');
      }}
      onEdit={function (id: number): void {
        throw new Error('Function not implemented.');
      }}
      defaultParameters={{
        populate: { theme: '*' },
      }}
    />
  );
}

export default SubThemeTable