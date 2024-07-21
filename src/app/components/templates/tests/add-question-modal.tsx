/* eslint-disable react-hooks/exhaustive-deps */
import { Button, Modal, Row } from 'antd';
import React, { FC, useEffect, useState } from 'react';
import MagicTable from '../../table-v2/table-custom';
import { IQuestion, IQuestionResponse } from '@/app/interfaces/question';
import { question_columns } from '../questions/question-columns';
import { testQuestionService } from '@/app/services/test-question';
import { BASE_FILTER } from '@/utils/constants/constants';

type Props = {
  visible: boolean;
  onClose: () => void;
  testId: number;
  excludedQuestions: number[];
  refetch: () => void;
};

const AddQuestionModal: FC<Props> = ({
  onClose,
  testId,
  visible,
  excludedQuestions,
  refetch
}) => {
  const [open] = useState(visible);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const handleAddQuestions = () => {
    if (selectedRowKeys.length) {
      // Add questions to the test
      setConfirmLoading(true);
      const promises: any[] = [];
      selectedRowKeys.map((questionId) => {
        promises.push(
          testQuestionService.post({
            test: testId,
            question: questionId,
          } as any)
        );
      });
      Promise.all(promises)
        .then(() => {
          setConfirmLoading(false);
          refetch();
          onClose();
        })
        .catch(() => {
          setConfirmLoading(false);
        });
    }
  };

  useEffect(() => {
    !open && onClose();
  }, [open]);

  const renderFooter = (
    <Row>
      <Button
        type='primary'
        disabled={!selectedRowKeys.length}
        onClick={handleAddQuestions}
        style={{ marginRight: 10 }}
        loading={confirmLoading}
      >
        Adicionar
      </Button>
      <Button onClick={onClose}>Cancelar</Button>
    </Row>
  );

  return (
    <Modal
      title='Adicionar Preguntas'
      open={open}
      onCancel={onClose}
      destroyOnClose
      width={'80%'}
      style={{ top: 20 }}
      okButtonProps={{ disabled: !selectedRowKeys.length }}
      footer={renderFooter}
    >
      <MagicTable<IQuestionResponse, IQuestion>
        columns={question_columns}
        url={'questions'}
        onAdd={function (): void {
          throw new Error('Function not implemented.');
        }}
        onEdit={function (id: number): void {
          throw new Error('Function not implemented.');
        }}
        rowSelection={{
          selectedRowKeys,
          onChange: setSelectedRowKeys,
        }}
        scroll={{ x: 700, y: 400 }}
        style={{ marginTop: 30 }}
        defaultParameters={{
          filters: {
            id: { $notIn: excludedQuestions },
            ...BASE_FILTER
          },
        }}
      />
    </Modal>
  );
};

export default AddQuestionModal;
