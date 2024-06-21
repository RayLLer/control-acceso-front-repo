'use client'
import {
  IRealizedTest
} from '@/app/interfaces/realized-tests';
import MagicTable from '../../table-v2/table-custom';
import { realized_tests_columns } from './realized-tests-columns';

const RealizedTestsTemplate = () => {
  return (
    <MagicTable<IRealizedTest , IRealizedTest>
      url='realized-tests/last-grouped-by-user'
      columns={realized_tests_columns}
      onAdd={function (): void {
        throw new Error('Function not implemented.');
      }}
      onEdit={function (id: number): void {
        throw new Error('Function not implemented.');
      }}
    />
  );
};

export default RealizedTestsTemplate;
