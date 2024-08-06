/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import React, { useState } from 'react';
import MagicTable from '../../table-v2/table-custom';
import { IQuestion, IQuestionResponse } from '@/app/interfaces/question';
import { question_columns } from './question-columns';
import { paths } from '@/app/routes/paths';
import { useRouter } from 'next/navigation';
import { BASE_FILTER } from '@/utils/constants/constants';
import {UploadOutlined} from '@ant-design/icons';
import UploadModal from './upload-modal';

const QuestionTemplate = () => {
  const router = useRouter();
  const [showUploadModal, setShowUploadModal] = useState(false)

  return (
    <>
      <MagicTable<IQuestionResponse, IQuestion>
        columns={question_columns}
        url='questions'
        crud
        onEdit={(id) => router.push(paths.questions.edit(id))}
        onAdd={() => router.push(paths.questions.create)}
        defaultParameters={{
          filters: {
            ...BASE_FILTER,
          },
        }}
        topActions={[{
          icon: <UploadOutlined />,
          onClick: () => setShowUploadModal(true),
          tooltip: 'Subir Preguntas'
        }]}
      />
      <UploadModal open={showUploadModal} onClose={()=>setShowUploadModal(false)} />
    </>
  );
};

export default QuestionTemplate;
