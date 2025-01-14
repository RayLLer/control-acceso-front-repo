'use client'
import React, { useState } from 'react';
import { EyeOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import MagicTable from '../../table-v2/table-custom';
import {
  IErrorReport,
  IErrorReportResponse,
} from '@/app/interfaces/error-reports';
import { paths } from "@/app/routes/paths";
import { error_report_columns } from './error-report-columns';
import { ERROR_REPORT_STATES } from '@/utils/constants/constants';
import ErrorReportForm from './error-reports-form';

const ErrorReportsResolved = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedErrorId, setSelectedErrorId] = useState<number | undefined>();
  const [refetch, setRefetch] = useState(false);
  
  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedErrorId(undefined);
  };

  const router = useRouter();
  return (
    <>
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
        filters: { state: ERROR_REPORT_STATES.RESOLVED },
      }}
      setRefetch={setRefetch}
      refetch={refetch}
      moreActions={[
        {
          icon: <EyeOutlined />,
          onClick: (record) => {
              handleShowModal();
              setSelectedErrorId(record?.id);
            },
          tooltip: "Ver detalles",
        },
      ]}

    />
    {showModal && (
        <ErrorReportForm
          errorReportId={selectedErrorId}
          open={showModal}
          onClose={handleCloseModal}
          onSaved={() => {
            handleCloseModal();
            setRefetch(true);
          }}
        />
      )}
    </>
  );
};

export default ErrorReportsResolved;
