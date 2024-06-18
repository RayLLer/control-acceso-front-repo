/* eslint-disable react-hooks/exhaustive-deps */
'use client';
import { ISelect } from '@/app/interfaces/basics';
import {
  ICategoryResponse,
  IQuestion,
  IQuestionResponse,
} from '@/app/interfaces/question';
import { paths } from '@/app/routes/paths';
import { blockService } from '@/app/services/block.service';
import { categoryService } from '@/app/services/category.service';
import { questionService } from '@/app/services/question.service';
import { subThemeService } from '@/app/services/subthemes.service';
import { themeService } from '@/app/services/themes.service';
import { convertForSelect } from '@/utils/select-utils';
import { PlusOutlined } from '@ant-design/icons';
import { App, Button, Form, Input, Select, Upload } from 'antd';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const QuestionForm = () => {
  const { id } = useParams();
  const { message, notification } = App.useApp();
  const [form] = Form.useForm<IQuestion>();
  const [categories, setCategories] = useState<ISelect[]>([]);
  const [themes, setThemes] = useState<ISelect[]>([]);
  const [subThemes, setSubThemes] = useState<ISelect[]>([]);
  const [blocks, setBlocks] = useState<ISelect[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [loadingThemes, setLoadingThemes] = useState(false);
  const [loadingSubThemes, setLoadingSubThemes] = useState(false);
  const [loadingBlocks, setLoadingBlocks] = useState(false);
  const router = useRouter();

  const selectedCategory = Form.useWatch('category', form);
  const selectedTheme = Form.useWatch('theme', form);
  const selectedSubTheme = Form.useWatch('sub_theme', form);

  console.log(selectedCategory, selectedSubTheme, selectedTheme);

  const updateFields = (question: IQuestionResponse) => {
    form.setFieldsValue(question.attributes);
    form.setFieldValue('category', question.attributes.category.data.id);
    form.setFieldValue('theme', question.attributes.theme.data.id);
    form.setFieldValue('sub_theme', question.attributes.sub_theme.data.id);
    form.setFieldValue('block', question.attributes.block.data.id);

    form.setFieldValue('image', question.attributes.image.url);
  };

  const fetchQuestion = async () => {
    // Fetch question by id
    const response = questionService.getById(+id);
    updateFields((await response).data.data);
  };

  const fetchCategories = async () => {
    // Fetch categories
    setLoadingCategories(true);
    try {
      const response = await categoryService.getForSelect('name');
      setCategories(convertForSelect(response.data.data));
    } catch (error) {
      message.error('Error al cargar las categorías');
    }
    setLoadingCategories(false);
  };

  const fetchTheme = async () => {
    // Fetch theme
    setLoadingThemes(true);
    try {
      const response = await themeService.getForSelect('name', {
        filters: {
          category_themes: {
            category: { id: { $eq: selectedCategory } },
          },
        },
      });
      setThemes(convertForSelect(response.data.data));
    } catch (error) {
      message.error('Error al cargar los temas');
    }

    setLoadingThemes(false);
  };

  const fetchSubTheme = async () => {
    // Fetch subtheme
    setLoadingSubThemes(true);
    try {
      const response = await subThemeService.getForSelect('name', {
        filters: {
          theme: {
            id: { $eq: selectedTheme },
          },
        },
      });
      setSubThemes(convertForSelect(response.data.data));
    } catch (error) {
      message.error('Error al cargar los subtemas');
    }
    setLoadingSubThemes(false);
  };

  const fetchBlock = async () => {
    // Fetch block
    setLoadingBlocks(true);
    try {
      const response = await blockService.getForSelect('name', {
        filters: {
          sub_theme: {
            id: { $eq: selectedSubTheme },
          },
        },
      });
      setBlocks(convertForSelect(response.data.data));
    } catch (error) {
      message.error('Error al cargar los bloques');
    }
    setLoadingBlocks(false);
  };

  useEffect(() => {
    if (id) {
      fetchCategories();
      fetchQuestion();
    }
    return () => {
      form.resetFields();
    };
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      setThemes([]);
      setSubThemes([]);
      setBlocks([]);
      fetchTheme();
    }
  }, [selectedCategory]);

  useEffect(() => {
    selectedTheme && fetchSubTheme();
  }, [selectedTheme]);

  useEffect(() => {
    selectedSubTheme && fetchBlock();
  }, [selectedSubTheme]);

  const onFinish = async (values: any) => {
    console.log('Success:', values);
    console.log('la imagen es nueva', form.isFieldTouched('image'));
    if (id) {
      await questionService.put(+id, values);
      notification.success({
        message: 'Pregunta actualizada correctamente',
        placement: 'topRight',
      });
    } else {
      const response = await questionService.post(values);
      notification.success({
        message: 'Pregunta creada correctamente',
        placement: 'topRight',
      });
      router.push(paths.questions.edit(response.data.data.id));
    }
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  const normFile = (e: any) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

  return (
    <Form
      form={form}
      name='questionForm'
      layout='horizontal'
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      labelCol={{ span: 4 }}
      wrapperCol={{ span: 14 }}
      labelWrap
    >
      <Form.Item
        label='Pregunta'
        name='questionText'
        rules={[{ required: true, message: 'Por favor, ingrese su pregunta.' }]}
      >
        <Input.TextArea rows={3} />
      </Form.Item>

      <Form.Item
        label='Respuesta correcta'
        name='correctAnswer'
        rules={[
          {
            required: true,
            message: 'Por favor, ingrese la respuesta correcta.',
          },
        ]}
      >
        <Input.TextArea rows={3} />
      </Form.Item>

      <Form.Item
        label='Imagen'
        valuePropName='fileList'
        name={'image'}
        getValueFromEvent={normFile}
      >
        <Upload listType='picture-card' maxCount={1}>
          <button style={{ border: 0, background: 'none' }} type='button'>
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>Cargar</div>
          </button>
        </Upload>
      </Form.Item>

      <Form.Item
        label='Respuesta incorrecta 1'
        name='incorrectAnswer1'
        rules={[
          {
            required: true,
            message: 'Por favor, ingrese una respuesta incorrecta.',
          },
        ]}
      >
        <Input.TextArea rows={3} />
      </Form.Item>

      <Form.Item
        label='Respuesta incorrecta 2'
        name='incorrectAnswer2'
        rules={[
          {
            required: true,
            message: 'Por favor, ingrese una respuesta incorrecta.',
          },
        ]}
      >
        <Input.TextArea rows={3} />
      </Form.Item>

      <Form.Item
        label='Respuesta incorrecta 3'
        name='incorrectAnswer3'
        rules={[
          {
            required: true,
            message: 'Por favor, ingrese una respuesta incorrecta.',
          },
        ]}
      >
        <Input.TextArea rows={3} />
      </Form.Item>

      <Form.Item
        label='Texto de la justificación'
        name='justificationText'
        rules={[
          { required: true, message: 'Por favor, ingrese la justificación.' },
        ]}
      >
        <Input.TextArea rows={3} />
      </Form.Item>

      <Form.Item
        label='Referencia'
        name='referencia'
        rules={[
          { required: true, message: 'Por favor, ingrese la referencia.' },
        ]}
      >
        <Input.TextArea rows={3} />
      </Form.Item>

      <Form.Item
        label='Texto de la pista'
        name='clueText'
        rules={[{ required: true, message: 'Por favor, ingrese la pista.' }]}
      >
        <Input.TextArea rows={3} />
      </Form.Item>

      <Form.Item name='category' label='Cuerpo'>
        <Select
          options={categories}
          onDropdownVisibleChange={(open: boolean) =>
            open && !categories.length && fetchCategories()
          }
          loading={loadingCategories}
          onChange={() => {
            form.setFieldsValue({
              theme: undefined,
              sub_theme: undefined,
              block: undefined,
            });
          }}
        />
      </Form.Item>

      <Form.Item name='theme' label='Tema'>
        <Select options={themes} loading={loadingThemes} />
      </Form.Item>

      <Form.Item name='sub_theme' label='SubTema'>
        <Select options={subThemes} loading={loadingSubThemes} />
      </Form.Item>

      <Form.Item name='block' label='Bloque'>
        <Select options={blocks} loading={loadingBlocks} />
      </Form.Item>

      <Form.Item>
        <Button type='primary' htmlType='submit'>
          {id ? 'Actualizar' : 'Crear'}
        </Button>
      </Form.Item>
    </Form>
  );
};

export default QuestionForm;
