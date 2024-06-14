'use client';
import React from 'react';
import MagicTable from '../../table-v2/table-custom';
import { ITest, ITestResponse } from '@/app/interfaces/test';
import { test_columns } from './test-columns';
import { Card, Table } from 'antd';
import { nested_columns } from './test-nested-columns';

const TestTemplate = () => {
  return (
    <MagicTable<ITestResponse, ITest>
      columns={test_columns}
      crud
      onAdd={() => {}}
      onEdit={(id) => {}}
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
      }}
    />
  );
};

export default TestTemplate;
