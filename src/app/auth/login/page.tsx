'use client';
import { AUTH, paths } from '@/app/routes/paths';
import { axiosInstance } from '@/utils/axios';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import {
  Button,
  Card,
  Checkbox,
  Form,
  Image,
  Input,
  notification,
  Typography,
} from 'antd';
import { isAxiosError } from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import styles from './page.module.css';

interface ILogin {
  identifier: string;
  password: string;
}

const Login: React.FC = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const onLogin = async (payload: ILogin) => {
    try {
      setLoading(true);
      const response = await axiosInstance.post(
        process.env.NEXT_PUBLIC_API_URL + '/' + AUTH,
        payload
      );
      const user = response.data.user;
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', response.data.jwt);
      // const responseFcm = await userService.putUser(user.id, user);
      setLoading(false);
      router.push(paths.tests.root);
    } catch (error: any) {
      setLoading(false);
      if (isAxiosError(error)) {
        notification.open({
          type: 'error',
          message: 'Error',
          description: error.response?.data.error.message,
        });
      }
    }
  };

  // const onLogin = (payload: ILogin) => {
  //   signIn('credentials', { ...payload, redirect: false })
  //     .then((res) => {
  //       console.log(res);
  //     })
  //     .catch((e) => {
  //       console.log(e);
  //     });
  // };

  return (
    // <Row justify='center' align='middle' style={{ minHeight: '98vh' }}>
    <div
      style={{
        flexDirection: 'column',
        width: '100vw',
        height: '100vh',
        margin: 0,
        padding: 0,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundImage: 'url(/img/login-background.png)',
        backgroundSize: 'cover',
      }}
    >
      <Image src='/img/logo.png' width={200} alt='Logo' style={{marginBottom: '5px'}} />
      <Card className={styles.card}>
        <Typography.Title level={3}>Ingresar</Typography.Title>
        <Form
          name='normal_login'
          className='login-form'
          initialValues={{ remember: true }}
          onFinish={onLogin}
        >
          <Form.Item
            name='identifier'
            rules={[{ required: true, message: 'Introduzca el Identificador' }]}
          >
            <Input
              prefix={<UserOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder='Identificador'
            />
          </Form.Item>
          <Form.Item
            name='password'
            rules={[{ required: true, message: 'Introduzca la Contraseña' }]}
          >
            <Input.Password
              prefix={<LockOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
              type='password'
              placeholder='Contraseña'
            />
          </Form.Item>

          <Form.Item>
            <Checkbox>Recuérdame</Checkbox>
          </Form.Item>

          <Form.Item>
            <Button
              type='primary'
              htmlType='submit'
              className='login-form-button'
              loading={loading}
            >
              Acceder
            </Button>
          </Form.Item>
          <Link href={paths.forgot_password}>
            Has olvidado tu contraseña
          </Link>
        </Form>
      </Card>
    </div>
    // </Row>
  );
};

export default Login;
