'use client';
import { generalConfigServices } from '@/app/services/general-config.service';

import {
  Button,
  Col,
  Form,
  InputNumber,
  Input,
  Row,
  Typography,
  notification,
} from 'antd';
import { useForm } from 'antd/es/form/Form';
import { useEffect, useState } from 'react';
import useSubmitable from "@/app/hooks/use-submitable";

const { Title } = Typography;

const GeneralDataForm = () => {

  const [form] = useForm();
  const [loading, setLoading] = useState(false);
  const { submittable, setSubmittable } = useSubmitable({ form });


  const getGeneralData = async () => {
    try {
      const response = await generalConfigServices.getGeneralConfig();
      console.log('API Response:', response);
      // Ensure response.data.data.attributes exists before setting form values
      if (response?.data?.data?.attributes) {
        form.setFieldsValue(response.data.data.attributes);
      } else {
        console.error('Invalid response structure:', response);
        notification.error({ message: 'Failed to fetch general data' });
      }
    } catch (error) {
      console.error('Error fetching general data:', error);
      notification.error({ message: 'Error fetching general data' });
    }
  };

  useEffect(() => {
    getGeneralData();
  }, []);

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      await generalConfigServices.patchGeneralData(values);
      setLoading(false);
      notification.success({
        message: 'Datos generales actualizados',
      });
      setSubmittable(false);
    } catch (error) {
      setLoading(false);
      notification.error({
        message: 'Error al actualizar los datos generales',
      });
    }
  };

  const formItemLayout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  };

  return (
    <>
      {/* <Title level={2} style={{ marginBottom: 30 }}>
        Datos generales
      </Title> */}
      <Form
        {...formItemLayout}
        form={form}
        style={{ maxWidth: 1200 }}
        scrollToFirstError
        onFinish={onFinish}
        labelWrap
        initialValues={{
          practicalTestCorrectAnswerValue: 0,
          practicalTestIncorrectAnswerValue: 0,
          standarTestCorrectAnswerValue: 0,
          standarTestIncorrectAnswerValue: 0,
        }}
      >
        <Row gutter={[24, 24]} style={{ width: '100%' }}>
          <Col sm={24} lg={12}>
            <Form.Item
              name='fiftyMaxQty'
              label='Cantidad máximo uso de la ayuda 50/50'
            >
              <InputNumber
                style={{ minWidth: 250 }}
                min={0}
                placeholder='Cantidad máximo uso de la ayuda 50/50'
              />
            </Form.Item>
          </Col>
          <Col sm={24} lg={12}>
            <Form.Item
              name='clueMaxQty'
              label='Cantidad máximo uso de la ayuda Pista'
            >
              <InputNumber
                style={{ minWidth: 250 }}
                min={0}
                placeholder='Cantidad máximo uso de la ayuda Pista'
              />
            </Form.Item>
          </Col>
          <Col sm={24} lg={12}>
            <Form.Item
              name='ruleOutMaxQty'
              label='Cantidad máximo uso de la ayuda El arte del descarte'
            >
              <InputNumber
                style={{ minWidth: 250 }}
                min={0}
                placeholder='Cantidad máximo uso de la ayuda El arte del descarte'
              />
            </Form.Item>
          </Col>
          <Col sm={24} lg={12}>
            <Form.Item
              name='twoAnswersQty'
              label='Cantidad máximo uso de la ayuda Me la juego'
            >
              <InputNumber
                style={{ minWidth: 250 }}
                min={0}
                placeholder='Cantidad máximo uso de la ayuda Me la juego'
              />
            </Form.Item>
          </Col>
          {/*<Col sm={24} lg={12}>
            <Form.Item
              name='adminEmail'
              label='Correo del administrador'
            >
              <Input
                style={{ minWidth: 250 }}
                placeholder='Correo del administrador'
              />
            </Form.Item>
          </Col>*/}
          <Col sm={24} lg={12}>
            <Form.Item
              name='practicalTestCorrectAnswerValue'
              label='Valor de acertadas en test prácticos'
              rules={[{ required: true, message: 'Este campo es requerido' }]}
            >
              <InputNumber
                style={{ minWidth: 250 }}
                min={0}
                placeholder='Valor de acertadas en test prácticos'
              />
            </Form.Item>
          </Col>
          <Col sm={24} lg={12}>
            <Form.Item
              name='practicalTestIncorrectAnswerValue'
              label='Valor de falladas en test prácticos'
              rules={[{ required: true, message: 'Este campo es requerido' }]}
            >
              <InputNumber
                style={{ minWidth: 250 }}
                min={0}
                placeholder='Valor de falladas en test prácticos'
              />
            </Form.Item>
          </Col>
          <Col sm={24} lg={12}>
            <Form.Item
              name='standarTestCorrectAnswerValue'
              label='Valor de acertadas en test normales'
              rules={[{ required: true, message: 'Este campo es requerido' }]}
            >
              <InputNumber
                style={{ minWidth: 250 }}
                min={0}
                max={1}
                placeholder='Valor de acertadas en test normales'
              />
            </Form.Item>
          </Col>
          <Col sm={24} lg={12}>
            <Form.Item
              name='standarTestIncorrectAnswerValue'
              label='Valor de falladas en test normales'
              rules={[{ required: true, message: 'Este campo es requerido' }]}
            >
              <InputNumber
                style={{ minWidth: 250 }}
                min={0}
                max={1}
                placeholder='Valor de falladas en test normales'
              />
            </Form.Item>
          </Col>
        </Row>
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            paddingRight: 40,
            justifyContent: 'center',
            alignItems: 'flex-end',
          }}
        >
          <Button
            type='primary'
            htmlType='submit'
            style={{ marginRight: 15, alignSelf: 'flex-end' }}
            disabled={!submittable}
            loading={loading}
          >
            SALVAR
          </Button>
        </div>
      </Form>
    </>
  );
};

export default GeneralDataForm;
