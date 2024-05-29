import { Spin } from 'antd';
import React from 'react'

const Loading = () => {
  return (
    <span
      style={{
        height: '80vh',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Spin size='large' />
    </span>
  );
}

export default Loading