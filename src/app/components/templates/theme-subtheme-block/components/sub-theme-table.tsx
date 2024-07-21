import MagicTable from '@/app/components/table-v2/table-custom';
import { ISubTheme, ISubThemeResponse } from '@/app/interfaces/question';
import { subtheme_columns } from './sub-theme-columns';
import { useState } from 'react';
import SubThemeForm from './sub-theme-form';
import { BASE_FILTER } from '@/utils/constants/constants';

const SubThemeTable = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedSubThemeId, setSelectedSubThemeId] = useState<number | undefined>();
  const [refetch, setRefetch] = useState(false);

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedSubThemeId(undefined);
  };

  return (
    <>
      <MagicTable<ISubThemeResponse, ISubTheme>
        columns={subtheme_columns}
        url={'sub-themes'}
        crud
        onAdd={handleShowModal}
        onEdit={(id: number): void => {
          handleShowModal();
          setSelectedSubThemeId(id);
        }}
        setRefetch={setRefetch}
        refetch={refetch}
        defaultParameters={{
          populate: { theme: '*' },
          filters: { ...BASE_FILTER },
        }}
      />
      {showModal && (
        <SubThemeForm
          subThemeId={selectedSubThemeId}
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
}

export default SubThemeTable