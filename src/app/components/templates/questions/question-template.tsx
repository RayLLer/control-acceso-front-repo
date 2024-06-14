/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import React from 'react'
import MagicTable from '../../table-v2/table-custom';
import { IQuestion, IQuestionResponse } from '@/app/interfaces/question';
import { question_columns } from './question-columns';
import { paths } from '@/app/routes/paths';
import { useRouter } from 'next/navigation';

const QuestionTemplate = () => {
  const router = useRouter();
  return (
    <MagicTable<IQuestionResponse, IQuestion>
      columns={question_columns}
      url='questions'
      crud
      onEdit={(id) => router.push(paths.questions.edit(id))}
      onAdd={() =>
        router.push(paths.questions.create)
      }
    />
  );
}

export default QuestionTemplate