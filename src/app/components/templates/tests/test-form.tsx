'use client';
import { ITest, ITestResponse } from '@/app/interfaces/test';
import { testService } from '@/app/services/test.service';
import { Button, DatePicker, Form, Input, Select } from 'antd';
import { useParams } from 'next/navigation';
import React, { useEffect } from 'react';

const testTypeOpt = [
  { label: 'Reto', value: 'Reto' },
  { label: 'Oficial', value: 'Oficial' },
];

const suTestTypeOpt = [
  { label: 'General', value: 'General' },
  { label: 'Práctico', value: 'Práctico' },
];

const TestForm = () => {
  const { id } = useParams();
  const [form] = Form.useForm();

  const testType = Form.useWatch('testType', form);

  const updateFields = (test: ITestResponse) => {
    // Update form fields
    form.setFieldsValue(test.attributes);
  };

  const fetchTest = async () => {
    // Fetch test by id
    const response = await testService.getById(+id);
    updateFields(response.data.data);
  };

  useEffect(() => {
    id && fetchTest();
  }, [id]);

  const onFinish = async (values: ITest) => {
    // Submit form
    if (id) {
      await testService.put(+id, values);
    } else {
      await testService.post(values);
    }
  };

  return (
    <Form
      form={form}
      name='questionForm'
      layout='horizontal'
      onFinish={onFinish}
      labelCol={{ span: 4 }}
      wrapperCol={{ span: 14 }}
      labelWrap
    >
      {/* Form fields */}
      <Form.Item
        label='Nombre'
        name='name'
        rules={[{ required: true, message: 'El npmbre es requerido' }]}
      >
        <Input />
      </Form.Item>
      <Form.Item label='Tipo de Test' name='testType'>
        <Select options={testTypeOpt} defaultValue={'Oficial'} />
      </Form.Item>

      {testType === 'Oficial' ? (
        <Form.Item label='SubTipo de Test' name='suTestType'>
          <Select options={suTestTypeOpt} defaultValue={'General'} />
        </Form.Item>
      ) : (
        <Form.Item label='SubTipo de Test' name='suTestType'>
          <Input />
        </Form.Item>
      )}
      <Form.Item label='Test práctico asociado'>
        <Select options={[]} />
      </Form.Item>
      <Form.Item label='Tiempo límite'>
        <DatePicker.TimePicker style={{ width: '100%' }} />
      </Form.Item>
      <Form.Item label='Año' name='year'>
        <Input type='number' min={1900} />
      </Form.Item>
      <Form.Item label='Fecha de entrada en vigor' name='initDate'>
        <DatePicker style={{ width: '100%' }} />
      </Form.Item>
      <Form.Item label='Fecha de caducidad' name='spireDate'>
        <DatePicker style={{ width: '100%' }} />
      </Form.Item>
      <Form.Item>
        <Button type='primary' htmlType='submit'>
          {id ? 'Actualizar' : 'Crear'}
        </Button>
      </Form.Item>
    </Form>
  );
};

export default TestForm;
