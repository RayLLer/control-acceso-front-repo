'use client'
import {
  IRealizedTest
} from '@/app/interfaces/realized-tests';
import MagicTable from '../../table-v2/table-custom';
import { realized_tests_columns } from './realized-tests-columns';
import { EyeOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { paths } from '@/app/routes/paths';

const RealizedTestsTemplate = () => {
  const router = useRouter()
  return (
    <MagicTable<IRealizedTest, IRealizedTest>
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
          onClick: (record: IRealizedTest) => {
            router.push(paths.realized_tests.details(record.users_permissions_user.id, record.test.id))
          }
        },
      ]}
    />
  );
};

export default RealizedTestsTemplate;
