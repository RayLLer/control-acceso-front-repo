'use client'
import { paths } from '@/app/routes/paths';
import { Button, Result } from 'antd';
import { useRouter } from 'next/navigation';
import React from 'react'

const NotFound404 = () => {
  const router = useRouter()
  return (
    <Result
      status='404'
      title='404'
      subTitle='Lo sentimos, la página que has visitados no existe.'
      extra={<Button onClick={()=>router.push(paths.home)}  type='primary'>Ir al Inicio</Button>}
    />
  );
}

export default NotFound404