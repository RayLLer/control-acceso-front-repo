'use client'
import React from 'react';
import { EyeOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import MagicTable from '../../table-v2/table-custom';
import {
  IErrorReport,
  IErrorReportResponse,
} from '@/app/interfaces/error-reports';
import { paths } from "@/app/routes/paths";
import { error_report_columns } from './error-report-columns';

const ErrorReportsGeneral = () => {
  const router = useRouter();
  return (
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
      }}
      moreActions={[
        {
          icon: <EyeOutlined />,
          onClick: (record) => {
            router.push(
              paths.error_reports.details(
                record!.id,
              )
            );
          },
          tooltip: "Ver detalles",
        },
      ]}

    />
  );
};

export default ErrorReportsGeneral;
