/* eslint-disable react-hooks/exhaustive-deps */
'use client';
import {
  IRealizedTest,
  IRealizedTest2,
  IRealizedTestResponse,
} from '@/app/interfaces/realized-tests';
import { realizedTestService } from '@/app/services/realized-test.service';
import { Button, Col, Flex, List, Pagination } from 'antd';
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import MagicTable from '../../table-v2/table-custom';
import { details_columns } from './details-columns';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { paths } from '@/app/routes/paths';

const RealizedTestsDetails = () => {
  const { params } = useParams();
  const [userId] = useState(params[0]);
  const [testId] = useState(params[1]);
  const router = useRouter();

  return (
    <>
      <Button
        type='link'
        color='primary'
        icon={<ArrowLeftOutlined />}
        style={{ marginBottom: 10 }}
        onClick={() => router.push(paths.realized_tests.root)}
      >
        VOLVER
      </Button>
      <MagicTable<IRealizedTestResponse, IRealizedTest2>
        columns={details_columns}
        url='realized-tests'
        onAdd={function (): void {
          throw new Error('Function not implemented.');
        }}
        onEdit={function (id: number): void {
          throw new Error('Function not implemented.');
        }}
        defaultParameters={{
          populate: {
            test: {
              populate: 'theme',
            },
            users_permissions_user: {
              fields: 'username',
            },
          },
          filters: { users_permissions_user: userId, test: testId },
        }}
      />
    </>
  );
};

export default RealizedTestsDetails;
