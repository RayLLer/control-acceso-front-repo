/* eslint-disable react-hooks/exhaustive-deps */
'use client';
import React, { useState } from 'react';
import MagicTable from '../../table-v2/table-custom';
import { EditOutlined } from "@ant-design/icons";
import { IFinalPhrase, IFinalPhraseResponse } from '@/app/interfaces/final-phrase';
import { final_phrase_columns } from './final-phrase-columns';
import { paths } from '@/app/routes/paths';
import { useRouter } from 'next/navigation';
import FinalPhraseForm from "@/app/components/templates/final-phrase/final-frase-form";

const FinalPhraseTemplate = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedFraseId, setSelectedFraseId] = useState<number | undefined>();
  const [refetch, setRefetch] = useState(false);

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedFraseId(undefined);
  };

  const router = useRouter();

  return (
    <>
      <MagicTable<IFinalPhraseResponse, IFinalPhrase>
        columns={final_phrase_columns}
        url='final-phrases'
        onAdd={function (): void {
          throw new Error('Function not implemented.');
        }}
        onEdit={function (id: number): void {
          throw new Error('Function not implemented.');
        }}
        setRefetch={setRefetch}
        refetch={refetch}
        moreActions={[
        {
          icon: <EditOutlined />,
          onClick: (record) => {
            handleShowModal();
            setSelectedFraseId(record?.id);
          },
          tooltip: "Editar",
        },
      ]}
      />
      {showModal && (
        <FinalPhraseForm
          finalPhraseId={selectedFraseId}
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

export default FinalPhraseTemplate;
