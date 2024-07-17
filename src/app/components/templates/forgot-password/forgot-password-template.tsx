'use client'
import { paths } from '@/app/routes/paths'
import { axiosBaseInstance, axiosInstance } from '@/utils/axios'
import { App, Button, Card, Flex, Form, Input, Row } from 'antd'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'

const ForgotPasswordTemplate = () => {

  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const {notification } = App.useApp()

  const onFinish = async(values: any) => {
    try {
      setLoading(true)
      const response = await axiosBaseInstance.post(
        'auth/forgot-password',
        values,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }

      );
      setLoading(false)
      notification.success({
        message: 'Correo enviado',
        description: 'Se ha enviado un correo para restablecer su contraseña',
      });
      router.push(paths.reset_password)  
    } catch (error) {
      setLoading(false);
      notification.error({
        message: 'Error',
        description: 'Hubo un error al enviar el correo',
      });
    }
  }
  return (
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

      <Card
        title='Olvidé mi contraseña'
        style={{ width: 500 }}
      >
        <p>Ingrese su correo electrónico para recuperar su contraseña.</p>
        <Form
          name='forgotForm'
          layout='horizontal'
          onFinish={onFinish}
          labelWrap
        >
          <Form.Item
            label='Correo electrónico'
            name='email'
            rules={[
              {
                type: 'email',
                message: 'El correo electrónico no es válido',
              },
              {
                required: true,
                message: 'Por favor ingrese su correo electrónico',
              },
            ]}
          >
            <Input placeholder='test@testopo.com' />
          </Form.Item>
          <Row >
            <Button type='primary' htmlType='submit' loading={loading}>
              Enviar
            </Button>
            <Button type='link' onClick={() => router.push(paths.login)}>
              Cancelar
            </Button>
          </Row>
        </Form>
      </Card>
    </div>
  );
}

export default ForgotPasswordTemplate