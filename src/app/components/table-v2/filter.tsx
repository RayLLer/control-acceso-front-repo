import { Select, Input, Space, Button, DatePicker } from 'antd';
import { FilterDropdownProps } from 'antd/es/table/interface';
import React, { FC, useMemo } from 'react';
import {
  filtersSelectBoolean,
  filtersSelectNumberOrDate,
  filtersSelectString,
  selectFilters,
} from './filter-values';
import { SearchOutlined } from '@ant-design/icons';

type DataType = 'string' | 'number' | 'date' | 'boolean';

const FilterComponent: FC<
  FilterDropdownProps & {
    dataIndex: string;
    type?: DataType;
    title: string;
    handleSearch: (
      value: string,
      confirm: FilterDropdownProps['confirm'],
      dataIndex: string,
      filterOperator: string
    ) => void;
    handleReset: (index?: string) => void;
  }
> = ({
  close,
  confirm,
  dataIndex,
  handleSearch,
  handleReset,
  setSelectedKeys,
  title,
  type = 'string',
}) => {
  const [searchInput, setSearchInput] = React.useState<string>('');
  const [dateValue, setDateValue] = React.useState<Date>();
  const [filterOperator, setFilterOperator] = React.useState<string>(
    type === 'string' ? '$containsi' : '$eq'
  );

  const filters = useMemo(() => {
    switch (type) {
      case 'string':
        return filtersSelectString;
      case 'number':
        return filtersSelectNumberOrDate;
      case 'date':
        return filtersSelectNumberOrDate;
      case 'boolean':
        return filtersSelectBoolean;
    }
  }, [type]);

  const reset = () => {
    setFilterOperator('$containsi');
    setSearchInput('');
    handleReset(dataIndex);
    setSelectedKeys([]);
  };

  return (
    <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
      <Select
        options={filters}
        value={filterOperator}
        style={{ marginBottom: 8, width: '100%' }}
        onChange={(value) => {
          setFilterOperator(value);
        }}
        defaultValue={'$eq'}
      />
      {type !== 'date' ? (
        <Input
          // ref={searchInput}
          placeholder={`${title}`}
          value={searchInput}
          onChange={(e) => {
            setSearchInput(e.target.value);
          }}
          onPressEnter={() => {
            handleSearch(searchInput, confirm, dataIndex, filterOperator);
          }}
          style={{ marginBottom: 8, display: 'block' }}
        />
      ) : (
        <DatePicker
          value={dateValue}
          showTime
          style={{ marginBottom: 8, display: 'block' }}
          onChange={(date) => {
            setDateValue(date);
            setSearchInput(date.toISOString());
          }}
        />
      )}
      <Space>
        <Button
          type='primary'
          onClick={() => {
            handleSearch(searchInput, confirm, dataIndex, filterOperator);
          }}
          icon={<SearchOutlined />}
          size='small'
          style={{ width: 90 }}
        >
          Buscar
        </Button>
        {/* <Button onClick={reset} size='small' style={{ width: 90 }}>
          Limpiar
        </Button> */}
        <Button
          type='link'
          size='small'
          onClick={() => {
            setSearchInput('');
            setFilterOperator(type === 'string' ? '$containsi' : '$eq');
            setDateValue(undefined);
            handleReset();
          }}
        >
          Limpiar Todo
        </Button>
        <Button
          type='link'
          size='small'
          onClick={() => {
            close();
          }}
        >
          Cerrar
        </Button>
      </Space>
    </div>
  );
};

export default FilterComponent;
