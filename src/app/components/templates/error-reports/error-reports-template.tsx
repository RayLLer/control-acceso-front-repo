'use client'
import React from 'react';
import MagicTable from '../../table-v2/table-custom';
import {
  IErrorReport,
  IErrorReportResponse,
} from '@/app/interfaces/error-reports';
import { error_report_columns } from './error-report-columns';

const ErrorReportsTemplate = () => {
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
    />
  );
};

export default ErrorReportsTemplate;
