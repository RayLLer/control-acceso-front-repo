'use client';
import { promoServices } from '@/app/services/promos.service';

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
import TextArea from 'antd/es/input/TextArea';

const { Title } = Typography;

const PromoDataForm = () => {

  const [form] = useForm();
  const [loading, setLoading] = useState(false);
  const { submittable, setSubmittable } = useSubmitable({ form });


  const getPromoData = async () => {
    try {
      const response = await promoServices.getPromos();
      console.log('API Response:', response);
      // Ensure response.data.data.attributes exists before setting form values
      if (response?.data?.data) {
        form.setFieldsValue(response.data.data);
      } else {
        console.error('Invalid response structure:', response);
        notification.error({ message: 'Failed to promo data' });
      }
    } catch (error) {
      console.error('Error fetching promo data:', error);
      notification.error({ message: 'Error fetching promo data' });
    }
  };

  useEffect(() => {
    getPromoData();
  }, []);

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      await promoServices.patchPromos(values);
      setLoading(false);
      notification.success({
        message: 'Datos de promos actualizados',
      });
      setSubmittable(false);
    } catch (error) {
      setLoading(false);
      notification.error({
        message: 'Error al actualizar los datos de promos',
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
          texto: '',
        }}
      >
        <Row gutter={[24, 24]} style={{ width: '100%' }}>
         
          <Col sm={24} lg={12}>
            <Form.Item
              name='texto'
              label='Texto de lA promoción'
            >
              <TextArea
                style={{ width: '100%', minHeight: 100 }}
                placeholder='Texto de promos'
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

export default PromoDataForm;
