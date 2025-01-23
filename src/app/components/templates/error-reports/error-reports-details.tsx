'use client'
import React, { useState } from 'react';
import { useParams, useRouter } from "next/navigation";
import { Button } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import MagicTable from '../../table-v2/table-custom';
import {
  IErrorReport,
  IErrorReportResponse,
} from '@/app/interfaces/error-reports';
import { paths } from "@/app/routes/paths";
import { error_report_columns } from './details-columns';

const ErrorReportsDetail = () => {
  const { id } = useParams();
  const router = useRouter();
  return (
    <>
    <Button
        type='link'
        color='primary'
        icon={<ArrowLeftOutlined />}
        style={{ marginBottom: 10 }}
        onClick={() => router.push(paths.error_reports.root)}
      >
        VOLVER
      </Button>
    <MagicTable<IErrorReportResponse, IErrorReport>
      columns={error_report_columns}
      url='error-reports'
      onAdd={function (): void {
        throw new Error('Function not implemented.');
      }}
      onEdit={function (id: number): void {
        throw new Error('Function not implemented.');
      }}
      defaultParameters={{
        populate: {
          users_permissions_user: {populate: 'role'},
          question: {
            populate: 'theme'
          }
        },
        filters: { id },
      }}

    />
    </>
  );
};

export default ErrorReportsDetail;
