'use client';
import { ITest, ITestResponse, TestQuestionResponse } from '@/app/interfaces/test';
import { paths } from '@/app/routes/paths';
import { BASE_FILTER } from '@/utils/constants/constants';
import { FileAddOutlined,DeleteOutlined } from '@ant-design/icons';
import { Button, Card, Table, TablePaginationConfig } from 'antd';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import MagicTable from '../../table-v2/table-custom';
import AddQuestionModal from './add-question-modal';
import { test_columns } from './test-columns';
import { nested_columns } from './test-nested-columns';
import { testQuestionService } from '@/app/services/test-question';

const TestTemplate = () => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [testId, setTestId] = useState<number | null>(null);
  const [excludedQuestions, setExcludedQuestions] = useState<number[]>([]);
  const [refetch, setRefetch] = useState(false);

  const handleOpen = (record?: ITestResponse) => {
    setOpen(true);
    setTestId(record!.id);
    setExcludedQuestions(
      record!.attributes.test_questions.data.map((q) => q.attributes.question.data.id),
    );
  };

  const handleClose = () => {
    setOpen(false);
    setTestId(null);
    setExcludedQuestions([]);
  };

  const [temp_nested_columns] = useState([
    ...nested_columns,
    {
      title: 'Acciones',
      render: (record: TestQuestionResponse) => (
        <div>
          <Button
            icon={<DeleteOutlined />}
            type='text'
            danger
            size='large'
            shape='circle'
            onClick={async () => {
              await testQuestionService.delete(record.id as number);
              setRefetch(true); 
            }}
          ></Button>
        </div>
      ),
    },
  ]);

  return (
    <>
      <MagicTable<ITestResponse, ITest>
        columns={test_columns}
        crud
        onAdd={() => router.push(paths.tests.create)}
        onEdit={(id) => router.push(paths.tests.edit(id))}
        url='tests'
        refetch={refetch}
        setRefetch={setRefetch}
        defaultParameters={{
          populate: {
            oposition: true,
            category: true,
            theme: true,
            sub_theme: true,
            test_questions: {
              populate: {
                question: {
                  populate: '*',
                },
              },
            },
          },
          filters: {
            ...BASE_FILTER,
            testType: {
              $ne: 'Personalizado'
            },
          },
        }}
        expandable={{
          expandedRowRender: (record: ITestResponse) => {
            return(
            <Card style={{ margin: 20 }}>
              <Table
                columns={temp_nested_columns}
                dataSource={record.attributes.test_questions.data}
                scroll={{ x: 700, y: 400 }}
                pagination={{pageSize: 5}}
                
              />
            </Card>
          )},
          rowExpandable: (record: ITestResponse) =>
            record.attributes.test_questions.data.length > 0,
        }}
        moreActions={[
          {
            icon: <FileAddOutlined />,
            onClick: handleOpen,
            tooltip: 'Agregar Preguntas',
          },
        ]}
      />
      {open && testId && (
        <AddQuestionModal
          visible={open}
          onClose={handleClose}
          testId={testId}
          excludedQuestions={excludedQuestions}
          refetch={() => {
            setRefetch(true);
          }}
        />
      )}
    </>
  );
};

export default TestTemplate;
