import { TableParams } from '@/utils/table';
import { Button, Card, Checkbox, Col, Dropdown, Row, Table } from 'antd';
import { FC, Key, useEffect, useRef, useState } from 'react';
import { DownOutlined, FilterOutlined } from '@ant-design/icons';
import { blue } from '@ant-design/colors';
import { ColumnType } from 'antd/es/table';
import FiltrersTable, { DataType } from './filters';
import { CheckboxChangeEvent } from 'antd/es/checkbox';

export type LoretaColumnsType<T> = ColumnType<T> & {
  dataType?: DataType;
  key: Key
};

interface IProps {
  data: any[];
  columns: LoretaColumnsType<any>[];
  loading: boolean;
  tableParams: TableParams;
  onChangeTableParams: (args: any) => void;
  onFilterChange: (filters: any) => void;
  expandable?: any;
  footer?: any;
  totalLabel?: string;
}

const LoretaTable = ({
  data,
  columns,
  loading,
  tableParams = { pagination: { current: 1, pageSize: 15 } },
  onChangeTableParams,
  onFilterChange,
  expandable,
  footer,
  totalLabel
}: IProps) => {
  const columnsRef = useRef(columns);
  const checkRef = useRef(new Array(columns.length).fill(true));
  const [checked, setChecked] = useState<boolean[]>(
    new Array(columns.length).fill(true)
  );

  const handleCheckChange = (event: CheckboxChangeEvent, idx: number, key: Key | undefined) => {
    // checkRef.current[idx] = event.target.checked;
    // columnsRef.current = columns.filter((col, idx) => checkRef.current[idx]);
    setChecked((prev) => {
      const newState = [...prev];
      newState[idx] = event.target.checked;
      return newState;
    });
    checkRef.current[idx] = event.target.checked;
    columnsRef.current = columns.filter((col, idx) => checkRef.current[idx]);
  };

  const ColumnMenu = () => {
    return (
      <Card>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'baseline',
          }}
        >
          {columns.map((col, idx) => {
            return (
              <Checkbox
                key={col.key}
                onChange={(event) => handleCheckChange(event, idx, col.key)}
                checked={checked[idx]}
              >
                {col.title as string}
              </Checkbox>
            );
          })}
        </div>
      </Card>
    );
  };

  return (
    <div>
      <Row style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
        <Col>
          <FiltrersTable columns={columns} onFilterChange={onFilterChange} />
        </Col>
        <Col>
          <Dropdown
            menu={{ items: [] }}
            placement='bottomRight'
            arrow={{ pointAtCenter: true }}
            dropdownRender={(menu) => <ColumnMenu />}
          >
            <Button type='text' style={{ color: blue.primary }}>
              {' '}
              Columnas <DownOutlined />{' '}
            </Button>
          </Dropdown>
        </Col>
      </Row>
      <Table
        columns={columnsRef.current}
        dataSource={data}
        pagination={{
          showTotal: (total: any, range: any[]) =>
            `${range[0]}-${range[1]} de ${total} ${totalLabel ?? 'registros'}`,
          ...tableParams.pagination,
        }}
        expandable={expandable}
        loading={loading}
        rowKey={(record) => record.id}
        scroll={{ x: '500px' }}
        onChange={(pagination, sorter) =>
          onChangeTableParams({ pagination, sorter })
        }
        footer={footer}
      />
    </div>
  );
};

export default LoretaTable;
