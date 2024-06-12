/* eslint-disable react-hooks/exhaustive-deps */
'use client';
import { Table, TableProps } from 'antd';
import React, { useEffect, useState } from 'react';
import { question_columns } from './question-columns';
import { questionService } from '@/app/services/question.service';
import { IQuestionResponse } from '@/app/interfaces/question';
import { TableParams } from '@/app/interfaces/strapi';

const QuestionTemplate = () => {
  const [data, setData] = useState<IQuestionResponse[]>();
  const [loading, setLoading] = useState(false);
  const [tableParams, setTableParams] = useState<TableParams>({
    pagination: {
      current: 1,
      pageSize: 10,
    },
  });

  const fetchData = () => {
    setLoading(true);
    questionService
      .get(tableParams)
      .then((res) => {
        setLoading(false);
        setData(res.data.data);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchData();
  }, [
    tableParams.pagination?.current,
    tableParams.pagination?.pageSize,
    tableParams.sortField,
    tableParams.sortOrder,
    tableParams.filters,
  ]);

  const convertSortOptions = (sorter: any) => {
    if (!sorter.order) return {};
    const field = sorter.field
      .filter((f: string) => f !== 'attributes' && f !== 'data')
      .join('.');
    return {
      sortField: field,
      sortOrder: sorter.order === 'ascend' ? 'asc' : 'desc',
    };
  };

  const handleTableChange: TableProps['onChange'] = (
    pagination,
    filters,
    sorter
  ) => {
    console.log(convertSortOptions(sorter));
    setTableParams({
      pagination,
      filters,
      ...convertSortOptions(sorter),
    });

    // `dataSource` is useless since `pageSize` changed
    if (pagination.pageSize !== tableParams.pagination?.pageSize) {
      setData([]);
    }
  };

  return (
    <Table
      columns={question_columns}
      rowKey={(record) => record.id}
      dataSource={data}
      pagination={tableParams.pagination}
      loading={loading}
      onChange={handleTableChange}
      bordered
    />
  );
};

export default QuestionTemplate;
