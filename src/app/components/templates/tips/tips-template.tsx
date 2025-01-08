/* eslint-disable react-hooks/exhaustive-deps */
'use client';
import React, { useState } from 'react';
import MagicTable from '../../table-v2/table-custom';
import { ITip, ITipResponse } from '@/app/interfaces/tip';
import { tip_columns } from './tips-columns';
import { paths } from '@/app/routes/paths';
import { useRouter } from 'next/navigation';

const TipTemplate = () => {
  const router = useRouter();

  return (
    <>
      <MagicTable<ITipResponse, ITip>
        columns={tip_columns}
        url='tips'
        crud
        onEdit={(id) => router.push(paths.tips.edit(id))}
        onAdd={() => router.push(paths.tips.create)}
        topActions={[]}
      />
    </>
  );
};

export default TipTemplate;
