'use client';
import { ITest, ITestResponse } from '@/app/interfaces/test';
import { Card, Table } from 'antd';
import MagicTable from '../../table-v2/table-custom';
import { test_columns } from './test-columns';
import { nested_columns } from './test-nested-columns';
import { useRouter } from 'next/navigation';
import { paths } from '@/app/routes/paths';

const TestTemplate = () => {
  const router = useRouter()
  return (
    <MagicTable<ITestResponse, ITest>
      columns={test_columns}
      crud
      onAdd={() => router.push(paths.tests.create)}
      onEdit={(id) => router.push(paths.tests.edit(id))}
      url='tests'
      defaultParameters={{
        populate: {
          category: true,
          theme: true,
          test_questions: {
            populate: {
              question: {
                populate: '*'
              },
            },
          },
        },
      }}
      expandable={{
        expandedRowRender: (record: ITestResponse) => (
          <Card style={{margin: 20}}>
            <Table
              columns={nested_columns}
              dataSource={record.attributes.test_questions.data}
              pagination={false}
            />
          </Card>
        ),
        rowExpandable: (record: ITestResponse) => record.attributes.test_questions.data.length > 0,
      }}
    />
  );
};

export default TestTemplate;
