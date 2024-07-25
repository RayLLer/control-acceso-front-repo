'use client'
import {
  IRealizedTest,
  IRealizedTestAttemptsResponse
} from '@/app/interfaces/realized-tests';
import MagicTable from '../../table-v2/table-custom';
import { realized_tests_columns } from './realized-tests-columns';
import { EyeOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { paths } from '@/app/routes/paths';

const RealizedTestsTemplate = () => {
  const router = useRouter()
  return (
    <MagicTable<IRealizedTestAttemptsResponse, IRealizedTestAttemptsResponse>
      url='realized-tests/last-grouped-by-user'
      columns={realized_tests_columns}
      onAdd={function (): void {
        throw new Error('Function not implemented.');
      }}
      onEdit={function (id: number): void {
        throw new Error('Function not implemented.');
      }}
      moreActions={[
        {
          icon: <EyeOutlined />,
          onClick: (record) => {
            router.push(
              paths.realized_tests.details(
                record!.user.id,
                record!.test.id
              )
            );
          },
          tooltip: 'Ver detalles',
        },
      ]}
    />
  );
};

export default RealizedTestsTemplate;
