/* eslint-disable react-hooks/exhaustive-deps */
'use client';
import { IQuestionForm, IQuestionResponse } from '@/app/interfaces/question';
import { paths } from '@/app/routes/paths';
import { questionService } from '@/app/services/question.service';
import { uploadService } from '@/app/services/upload.service';
import { ArrowLeftOutlined, PlusOutlined } from '@ant-design/icons';
import { App, Button, Form, Input, Select, Upload, UploadFile } from 'antd';
import { useParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useHierarchy } from './use-hierarchy';

const QuestionForm = () => {
  const { id } = useParams();
  const { message, notification } = App.useApp();
  const [form] = Form.useForm<IQuestionForm>();

  const router = useRouter();

  const selectedCategory = Form.useWatch('category', form);
  const selectedTheme = Form.useWatch('theme', form);
  const selectedSubTheme = Form.useWatch('sub_theme', form);

  const {
    categories,
    blocks,
    loadingBlocks,
    loadingCategories,
    loadingSubThemes,
    loadingThemes,
    subThemes,
    themes,
  } = useHierarchy(+selectedCategory, selectedTheme, selectedSubTheme);

  const updateFields = (question: IQuestionResponse) => {
    form.setFieldsValue(question.attributes as unknown as IQuestionForm);
    form.setFieldValue('category', question.attributes.category.data?.id);
    form.setFieldValue('theme', question.attributes.theme.data?.id);
    form.setFieldValue('sub_theme', question.attributes.sub_theme.data?.id);
    form.setFieldValue('block', question.attributes.block.data?.id);
    form.setFieldValue('image', []);

    if (question.attributes.image.data) {
      const file: UploadFile = {
        name: question.attributes.image.data.attributes.name,
        uid: question.attributes.image.data.id,
        status: 'done',
        url:
          process.env.NEXT_PUBLIC_BASE_URL +
          question.attributes.image.data.attributes.url,
      };
      form.setFieldValue('image', [file]);
    }

    // form.setFieldValue('image', question.attributes.image.url);
  };

  const fetchQuestion = async () => {
    // Fetch question by id
    const response = questionService.getById(+id);
    updateFields((await response).data.data);
  };

  useEffect(() => {
    if (id) {
      fetchQuestion();
    }
    return () => {
      form.resetFields();
    };
  }, []);

  const onFinish = async (values: any) => {
    const dataToSend = { ...values };
    delete dataToSend.image;
    try {
      if (values.image) {
        if (values.image.length && !values.image[0].status) {
          const response = await uploadService(values.image[0].originFileObj);
          dataToSend.image = response?.data[0].id;
        }
      }
      if (id) {
        await questionService.put(+id, dataToSend);
        notification.success({
          message: 'Pregunta actualizada correctamente',
          placement: 'topRight',
        });
      } else {
        const response = await questionService.post(dataToSend);
        notification.success({
          message: 'Pregunta creada correctamente',
          placement: 'topRight',
        });
        router.push(paths.questions.edit(response.data.data.id));
      }
    } catch (error) {
      console.log(error);
      notification.error({
        message: 'Ha ocurrido un error al guardar la pregunta',
        placement: 'topRight',
      });
    }
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
      labelCol={{ span: 4 }}
      wrapperCol={{ span: 14 }}
      labelWrap
    >
      <Button
        type='link'
        color='primary'
        icon={<ArrowLeftOutlined />}
        style={{ marginBottom: 10 }}
        onClick={() => router.push(paths.questions.root)}
      >
        VOLVER
      </Button>
      <Form.Item
        label='Pregunta'
        name='questionText'
        rules={[{ required: true, message: 'Por favor, ingrese su pregunta.' }]}
      >
        <Input.TextArea rows={5} />
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
        rules={[
          () => ({
            async validator(_, value) {
              if (!value) return Promise.resolve();
              const img = new Image();
              img.src = URL.createObjectURL(value[0].originFileObj);
              await img.decode();
              debugger;
              const diff = Math.abs(img.width - img.height);
              const average = (img.width + img.height) / 2;
              const percent = (diff / average) * 100;
              if (percent > 5) {
                return Promise.reject(
                  'La imagen a subir debe de ser cuadrada'
                );
              }
              return Promise.resolve();
            },
          }),
        ]}
      >
        <Upload
          listType='picture-card'
          maxCount={1}
          beforeUpload={() => false}
          accept='image/*'
        >
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

      <Form.Item
        name='category'
        label='Cuerpo'
        rules={[{ required: true, message: 'Seleccione un cuerpo.' }]}
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
        />
      </Form.Item>

      <Form.Item
        name='theme'
        label='Tema'
        rules={[{ required: true, message: 'Seleccione un tema.' }]}
      >
        <Select options={themes} loading={loadingThemes} />
      </Form.Item>

      <Form.Item
        name='sub_theme'
        label='SubTema'
        // rules={[{ required: true, message: 'Seleccione un subtema.' }]}
      >
        <Select options={subThemes} loading={loadingSubThemes} />
      </Form.Item>

      <Form.Item
        name='block'
        label='Bloque'
        // rules={[{ required: true, message: 'Seleccione un bloque.' }]}
      >
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
