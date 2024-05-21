'use client';
import {axiosInstance} from '@/utils/axios';
import { sources } from '@/utils/sources';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Card, Form, Input, notification } from 'antd';
import { isAxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import styles from './page.module.css';
import { paths } from '@/app/routes/paths';
import useFcmToken from '@/app/hooks/useFcmToken';
import { userService } from '@/app/pages/users/users.service';

interface ILogin {
  identifier: string;
  password: string;
}

const Login: React.FC = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const {fcmToken} = useFcmToken()

  const onLogin = async (payload: ILogin) => {
    try {
      setLoading(true);
      const response = await axiosInstance.post(
        process.env.NEXT_PUBLIC_API_URL + '/' + sources.AUTH,
        payload
      );
      const user = response.data.user;
      user.fcm = fcmToken;
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', response.data.jwt);
      const responseFcm = await userService.putUser(user.id, user);
      setLoading(false);
      router.push(paths.map.root);
    } catch (error) {
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
        flexDirection: 'row',
        minHeight: '96vh',
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <Card className={styles.card}>
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
            <Button
              type='primary'
              htmlType='submit'
              className='login-form-button'
              loading={loading}
            >
              Acceder
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
    // </Row>
  );
};

export default Login;
