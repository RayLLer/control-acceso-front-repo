/* eslint-disable react-hooks/exhaustive-deps */
'use client';
import { ISelect } from '@/app/interfaces/basics';
import { ICategoryResponse } from '@/app/interfaces/question';
import { ITheme, IThemeResponse } from '@/app/interfaces/theme';
import { categoryThemeService } from '@/app/services/category-theme.service';
import { categoryService } from '@/app/services/category.service';
import { themeService } from '@/app/services/themes.service';
import { App, Form, Input, Modal, Select } from 'antd';
import { AxiosError, isAxiosError } from 'axios';
import { FC, useEffect, useMemo, useState } from 'react';

type Props = {
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
  themeId?: number;
};

const TAGS = ['Informatica', 'General'];

const ThemeForm: FC<Props> = ({ open, themeId, onClose, onSaved }) => {
  const editMode = !!themeId;
  const [form] = Form.useForm();
  const { notification } = App.useApp();
  const [theme, setTheme] = useState<IThemeResponse>();
  const [categoriesFiltered, setCategoriesFiltered] = useState<ISelect[]>([]);
  const [excludedCategories, setExcludedCategories] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchTheme = async () => {
    if (editMode) {
      const response = await themeService.getById(themeId, {
        populate: { category_themes: { populate: 'category' } },
      });
      setTheme(() => response.data.data);
      updateFields(response.data.data);
    }
  };

  const fetchCategories = async () => {
    const response = await categoryService.getForSelect('name');
    setCategoriesFiltered(
      response.data.data.map((category) => ({
        label: category.attributes.name,
        value: category.id,
      }))
    );
  };

  const updateFields = (theme: IThemeResponse) => {
    console.log(theme.attributes.name);
    form.setFieldValue('name', theme.attributes.name);
    form.setFieldsValue({
      name: theme.attributes.name,
      categories: theme.attributes.category_themes.data?.map(
        (categoryTheme) => categoryTheme.attributes.category.data.id
      ),
    });
  };

  useEffect(() => {
    fetchCategories();
    editMode && fetchTheme();
  }, [editMode]);

  useEffect(() => {
    setCategoriesFiltered(
      categoriesFiltered.filter(
        (category) => !excludedCategories.includes(category.value)
      )
    );
  }, [excludedCategories]);

  const onFinish = async (values: any) => {
    const dataTosend = { ...values };
    setLoading(true);
    try {
      if (editMode && theme) {
        const promises: any[] = [];
        theme?.attributes.category_themes.data?.forEach(
          (catId: ICategoryResponse) => {
            promises.push(categoryThemeService.delete(catId.id));
          }
        );
        dataTosend.categories.forEach((catId: number) => {
          promises.push(
            categoryThemeService.post({
              category: catId,
              theme: theme.id,
            })
          );
        });
        await Promise.all(promises);
        delete dataTosend.categories;
        await themeService.put(themeId, dataTosend as ITheme);
        notification.success({
          type: 'success',
          message: 'Guardado',
          description: 'Tema actualizado correctamente.',
        });
      } else {
        const promises: any[] = [];
        const response = await themeService.post(dataTosend as ITheme);
        dataTosend.categories.forEach((catId: number) => {
          promises.push(
            categoryThemeService.post({
              category: catId,
              theme: response.data.data.id,
            })
          );
        });
        await Promise.all(promises);
        notification.success({
          type: 'success',
          message: 'Guardado',
          description: 'Tema creado correctamente.',
        });
      }
      onSaved();
    } catch (error: any) {
      if (isAxiosError(error)) {
        notification.error({
          type: 'error',
          message: 'Error',
          description:
            error.response?.data?.error.message ??
            'Ha ocurrido un error al guardar el tema.',
        });
      }
    }
    setLoading(false);
  };

  return (
    <Modal
      open={open}
      title={editMode ? 'Editar Tema' : 'Agregar Tema'}
      onCancel={onClose}
      onOk={() => form.submit()}
      confirmLoading={loading}
    >
      <Form onFinish={onFinish} form={form}>
        <Form.Item
          label='Nombre'
          name='name'
          rules={[{ required: true, message: 'El nombre es requerido' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label='Cuerpo/s'
          name='categories'
          rules={[{ required: true, message: 'El cuerpo es requerido' }]}
        >
          <Select
            mode='tags'
            options={categoriesFiltered}
            filterOption={(input, opt) => {
              return (
                opt?.label.toLowerCase().includes(input.toLowerCase()) ?? false
              );
            }}
            onChange={(values) => {
              setExcludedCategories(values);
            }}
          />
        </Form.Item>
        <Form.Item label='Etiqueta' name='tag'>
          <Select
            options={TAGS.map((tag) => ({ label: tag, value: tag }))}
            filterOption={(input, opt) => {
              return (
                opt?.label.toLowerCase().includes(input.toLowerCase()) ?? false
              );
            }}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ThemeForm;
