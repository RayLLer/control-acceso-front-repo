import React from 'react'

const usePagination = () => {
  const [pagination, setPagination] = React.useState({
    pagination:{
      current: 1,
      pageSize: 10
    },
    filters: {}
  })

  const handleTablePaginationChange = (params: any) => {
    setPagination((prev) => ({
      ...prev,
      pagination: {
        ...prev.pagination,
        current: params.current,
        pageSize: params.pageSize,
        total: params?.total,
      },
    }));
  };

  const updatePagination = (params: any) => {
    setPagination((prev) => ({
      ...prev,
      pagination: {
        ...prev.pagination,
        current: params.page,
        pageSize: params.pageSize,
        total: params.total,
      },
    }));
  }

  const handleFiltersChange = (filters: any) => {
    
    setPagination((prev) => ({
      ...prev,
      current: 1,
      ...filters,
    }));

  };

  return {
    pagination,
    handleTablePaginationChange,
    handleFiltersChange,
    updatePagination
  }
}

export default usePagination