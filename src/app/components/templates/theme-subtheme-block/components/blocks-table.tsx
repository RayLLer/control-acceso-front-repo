import MagicTable from '@/app/components/table-v2/table-custom';
import { IBlock, IBlockResponse, ISubTheme, ISubThemeResponse } from '@/app/interfaces/question';
import React from 'react'
import { subtheme_columns } from './sub-theme-columns';
import { block_columns } from './blocks-columns';

const BlockTable = () => {
  return (
    <MagicTable<IBlockResponse, IBlock>
      columns={block_columns}
      url={'blocks'}
      crud
      onAdd={function (): void {
        throw new Error('Function not implemented.');
      }}
      onEdit={function (id: number): void {
        throw new Error('Function not implemented.');
      }}
      defaultParameters={{
        populate: { sub_theme: '*' },
      }}
    />
  );
}

export default BlockTable