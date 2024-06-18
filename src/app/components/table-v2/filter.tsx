import { Select, Input, Space, Button } from 'antd';
import { FilterDropdownProps } from 'antd/es/table/interface';
import React, { FC } from 'react';
import { selectFilters } from './filter-values';
import { SearchOutlined } from '@ant-design/icons';

const FilterComponent: FC<
  FilterDropdownProps & {
    dataIndex: string;
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
  title
}) => {
  const [searchInput, setSearchInput] = React.useState<string>('');
  const [filterOperator, setFilterOperator] =
    React.useState<string>('$containsi');

  const reset = () => {
    setFilterOperator('$containsi');
    setSearchInput('');
    handleReset(dataIndex);
    setSelectedKeys([]);
  };
  
  console.log(dataIndex)

  return (
    <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
      <Select
        options={selectFilters}
        value={filterOperator}
        style={{ marginBottom: 8, width: '100%' }}
        onChange={(value) => {
          setFilterOperator(value);
        }}
        defaultValue={'$eq'}
      />
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
        <Button onClick={reset} size='small' style={{ width: 90 }}>
          Limpiar
        </Button>
        <Button
          type='link'
          size='small'
          onClick={() => {
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
