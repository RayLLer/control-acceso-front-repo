'use client';
import MagicTable from '@/app/components/table-v2/table-custom';
import { ITheme, IThemeResponse } from '@/app/interfaces/theme';
import React, { useState } from 'react';
import { theme_columns } from './theme-columns';
import ThemeForm from './theme-form';
import { BASE_FILTER } from '@/utils/constants/constants';

const ThemeTable = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedThemeId, setSelectedThemeId] = useState<number | undefined>();
  const [refetch, setRefetch] = useState(false);

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedThemeId(undefined);
  };

  return (
    <>
      <MagicTable<IThemeResponse, ITheme>
        columns={theme_columns}
        url={'themes'}
        crud
        onAdd={handleShowModal}
        onEdit={(id: number): void => {
          handleShowModal();
          setSelectedThemeId(id);
        }}
        defaultParameters={{
          populate: { category_themes: { populate: 'category' } },
        }}
        setRefetch={setRefetch}
        refetch={refetch}
        deleteEntry
      />
      {showModal && (
        <ThemeForm
          themeId={selectedThemeId}
          open={showModal}
          onClose={handleCloseModal}
          onSaved={() => {
            handleCloseModal();
            setRefetch(true);
          }}
        />
      )}
    </>
  );
};

export default ThemeTable;
