/* eslint-disable react-hooks/exhaustive-deps */
'use client';
import { ISelect } from '@/app/interfaces/basics';
import { ITest, ITestResponse } from '@/app/interfaces/test';
import { paths } from '@/app/routes/paths';
import { testService } from '@/app/services/test.service';
import { convertForSelect } from '@/utils/select-utils';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { App, Button, DatePicker, Form, Input, Select } from 'antd';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useHierarchy } from '../questions/use-hierarchy';
import moment from 'moment';
import { dateFormat } from '@/utils/constants/constants';

const OFICIAL = 'Oficial';
const CHALLENGE = 'Reto';

const testTypeOpt = [
  { label: 'Reto', value: CHALLENGE },
  { label: 'Oficial', value: OFICIAL },
];

const suTestTypeOpt = [
  { label: 'General', value: 'General' },
  { label: 'Práctico', value: 'Práctico' },
];

const TestForm = () => {
  const { id } = useParams();
  const { notification } = App.useApp();
  const [form] = Form.useForm();
  const router = useRouter();
  const [asociatedTests, setAsociatedTests] = useState<ISelect[]>([]);

  const testType = Form.useWatch('testType', form);
  const subTestType = Form.useWatch('suTestType', form);
  const selectedCategory = Form.useWatch('category', form);
  const selectedTheme = Form.useWatch('theme', form);
  const year = Form.useWatch('year', form);

  const {
    categories,
    themes,
    subThemes,
    loadingCategories,
    loadingThemes,
    loadingSubThemes,
  } = useHierarchy(+selectedCategory, selectedTheme);

  const updateFields = (test: ITestResponse) => {
    // Update form fields
    form.setFieldsValue(test.attributes);
    form.setFieldValue('category', test.attributes.category.data?.id);
    form.setFieldValue('theme', test.attributes.theme.data?.id);
    form.setFieldValue('sub_theme', test.attributes.sub_theme.data?.id);
    form.setFieldValue('test', test.attributes.test.data?.id);
    form.setFieldValue('initDate', moment(test.attributes.initDate));
    form.setFieldValue('spireDate', moment(test.attributes.spireDate));
  };

  const fetchAsociatedTest = async () => {
    // Fetch associated test
    setAsociatedTests([]);
    const response = await testService.getForSelect('name', {
      filters: {
        suTestType: { $eq: subTestType === 'General' ? 'Práctico' : 'General' },
        year: { $eq: form.getFieldValue('year') },
      },
    });
    setAsociatedTests(convertForSelect(response.data.data));
  };

  const fetchTest = async () => {
    // Fetch test by id
    const response = await testService.getById(+id);
    updateFields(response.data.data);
  };

  useEffect(() => {
    id && fetchTest();
  }, [id]);

  useEffect(() => {
    if (testType === OFICIAL && subTestType) {
      fetchAsociatedTest();
    }
  }, [testType, subTestType]);

  const onFinish = async (values: ITest) => {
    // Submit form
    try {
      const dataToSend: any = { ...values };
      dataToSend.initDate = dataToSend.initDate.toISOString();
      dataToSend.spireDate = dataToSend.spireDate.toISOString();
      dataToSend.timeLimit = +dataToSend.timeLimit;
      dataToSend.oposition = 1;
      if (id) {
        await testService.put(+id, dataToSend);
        notification.success({ message: 'Test actualizado correctamente' });
      } else {
        const response = await testService.post(dataToSend);
        notification.success({ message: 'Test creado correctamente' });
        router.push(paths.tests.edit(response.data.data.id));
      }
    } catch (error) {
      notification.error({ message: 'Error al guardar el test' });
    }
  };

  const renderLinkedTest = () => {
    // Render linked test
    if (testType !== OFICIAL || !suTestTypeOpt || !year) return null;

    return (
      <Form.Item label='Test vinculado' name='test'>
        <Select options={asociatedTests} allowClear />
      </Form.Item>
    );
  };

  return (
    <Form
      form={form}
      name='questionForm'
      layout='horizontal'
      onFinish={onFinish}
      labelCol={{ span: 4 }}
      wrapperCol={{ span: 16 }}
      labelWrap
    >
      <Button
        type='link'
        color='primary'
        icon={<ArrowLeftOutlined />}
        style={{ marginBottom: 10 }}
        onClick={() => router.push(paths.tests.root)}
      >
        VOLVER
      </Button>
      {/* Form fields */}
      <Form.Item
        label='Nombre'
        name='name'
        rules={[{ required: true, message: 'El nombre es requerido' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name='category'
        label='Cuerpo'
        rules={[{ required: true, message: 'El cuerpo es requerido' }]}
      >
        <Select
          options={categories}
          loading={loadingCategories}
          onChange={() => {
            form.setFieldsValue({
              theme: undefined,
              sub_theme: undefined,
              block: undefined,
            });
          }}
          allowClear
        />
      </Form.Item>

      <Form.Item
        name='theme'
        label='Tema'
        rules={[{ required: true, message: 'El tema es requerido' }]}
      >
        <Select options={themes} loading={loadingThemes} allowClear />
      </Form.Item>

      <Form.Item
        name='sub_theme'
        label='SubTema'
        rules={[{ required: true, message: 'El subtema es requerido' }]}
      >
        <Select options={subThemes} loading={loadingSubThemes} allowClear />
      </Form.Item>

      <Form.Item
        label='Tipo de Test'
        name='testType'
        rules={[{ required: true, message: 'El tipo de test es requerido' }]}
      >
        <Select options={testTypeOpt} allowClear />
      </Form.Item>

      {testType === OFICIAL && (
        <Form.Item label='SubTipo de Test' name='suTestType'>
          <Select options={suTestTypeOpt} defaultValue={'General'} allowClear />
        </Form.Item>
      )}
      {testType === OFICIAL && (
        <Form.Item
          label='Año'
          name='year'
          rules={[
            { required: testType === OFICIAL, message: 'El año es requerido' },
          ]}
        >
          <Input
            type='number'
            min={1900}
            onFocus={() => {
              !form.getFieldValue('year') &&
                form.setFieldValue('year', new Date().getFullYear());
            }}
          />
        </Form.Item>
      )}

      {renderLinkedTest()}

      {subTestType === 'Práctico' && (
        <Form.Item
          label='Descripción del caso práctico'
          name='practicCaseText'
          rules={[
            {
              required: subTestType === 'Práctico',
              message: 'La descripción del caso práctico es requerida',
            },
          ]}
        >
          <Input.TextArea rows={5} />
        </Form.Item>
      )}

      <Form.Item
        label='Tiempo límite'
        name='timeLimit'
        rules={[
          {
            min: 0,
            message: 'No debe admitir valores negativos',
          },
        ]}
      >
        <Input type='number' suffix='minutos' min={0} />
      </Form.Item>

      <Form.Item
        label='Fecha de entrada en vigor'
        name='initDate'
        // rules={[
        //   {
        //     required: true,
        //     message: 'Por favor, ingrese la fecha de entrada en vigor.',
        //   },
        // ]}
      >
        <DatePicker style={{ width: '100%' }} format={dateFormat} />
      </Form.Item>
      <Form.Item
        label='Fecha de caducidad'
        name='spireDate'
        rules={[
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (value) {

                return getFieldValue('initDate') < value
                  ? Promise.resolve()
                  : Promise.reject(
                      'La fecha de caducidad debe ser mayor a la fecha de entrada en vigor'
                    );
              }
            },
          }),
        ]}
      >
        <DatePicker style={{ width: '100%' }} format={dateFormat} />
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
