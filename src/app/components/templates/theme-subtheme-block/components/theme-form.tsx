/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { ISelect } from "@/app/interfaces/basics";
import { ICategoryResponse } from "@/app/interfaces/question";
import { ITheme, IThemeResponse } from "@/app/interfaces/theme";
import { categoryThemeService } from "@/app/services/category-theme.service";
import { categoryService } from "@/app/services/category.service";
import { themeService } from "@/app/services/themes.service";
import { App, Form, Input, Modal, Select } from "antd";
import { isAxiosError } from "axios";
import { FC, useEffect, useMemo, useState } from "react";
import "./style.css";
import useSubmitable from "@/app/hooks/use-submitable";
import { changeUndefinedToNull } from "@/utils/utils";

type Props = {
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
  themeId?: number;
};

const TAGS = ["Informática", "General", "Tercer Ejercicio"];

const ThemeForm: FC<Props> = ({ open, themeId, onClose, onSaved }) => {
  const editMode = !!themeId;
  const [form] = Form.useForm();
  const { notification } = App.useApp();
  const [theme, setTheme] = useState<IThemeResponse>();
  const [categories, setCategories] = useState<ISelect[]>([]);
  const [excludedCategories, setExcludedCategories] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const { submittable, setSubmittable } = useSubmitable({ form });

  const fetchTheme = async () => {
    if (editMode) {
      const response = await themeService.getById(themeId, {
        populate: { category_themes: { populate: "category" } },
      });

      setTheme(() => response.data.data);
      updateFields(response.data.data);
    }
  };

  const fetchCategories = async () => {
    const response = await categoryService.getForSelect("name");
    setCategories(
      response.data.data.map((category) => ({
        label: category.attributes.name,
        value: category.id,
      }))
    );
  };

  const updateFields = (theme: IThemeResponse) => {
    form.setFieldsValue({
      name: theme.attributes.name,
      tag: theme.attributes.tag,
      categories: theme.attributes.category_themes.data?.map(
        (categoryTheme) => categoryTheme.attributes.category.data.id
      ),
    });
  };

  useEffect(() => {
    fetchCategories();
    editMode && fetchTheme();
  }, [editMode]);

  // useEffect(() => {
  //   if(excludedCategories.length) {
  //     setCategoriesFiltered(
  //       categoriesFiltered.filter(
  //         (category) => !excludedCategories.includes(category.value)
  //       )
  //     );
  //   }
  // }, [excludedCategories]);

  const onFinish = async (values: any) => {
    const dataToSend = { ...changeUndefinedToNull(values) };
    setLoading(true);
    try {
      if (editMode && theme) {
        const promises: any[] = [];
        theme?.attributes.category_themes.data?.forEach((catId) => {
          promises.push(categoryThemeService.delete(catId.id));
        });
        dataToSend.categories.forEach((catId: number) => {
          promises.push(
            categoryThemeService.post({
              category: catId,
              theme: theme.id,
            })
          );
        });
        delete dataToSend.categories;
        await themeService.put(themeId, dataToSend as ITheme);
        await Promise.all(promises);
        notification.success({
          type: "success",
          message: "Guardado",
          description: "Tema actualizado correctamente.",
        });
        setSubmittable(false);
      } else {
        const promises: any[] = [];
        const response = await themeService.post(dataToSend as ITheme);
        dataToSend.categories.forEach((catId: number) => {
          promises.push(
            categoryThemeService.post({
              category: catId,
              theme: response.data.data.id,
            })
          );
        });
        await Promise.all(promises);
        notification.success({
          type: "success",
          message: "Guardado",
          description: "Tema creado correctamente.",
        });
      }
      onSaved();
    } catch (error: any) {
      if (isAxiosError(error)) {
        notification.error({
          type: "error",
          message: "Error",
          description:
            error.response?.data?.error.message ??
            "Ha ocurrido un error al guardar el tema.",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      title={editMode ? "Editar Tema" : "Agregar Tema"}
      onCancel={onClose}
      onOk={() => form.submit()}
      confirmLoading={loading}
      okButtonProps={{ disabled: !submittable }}
      className="my-custom-class"
    >
      <Form onFinish={onFinish} form={form}>
        <Form.Item
          label="Nombre"
          name="name"
          validateTrigger="onBlur"
          rules={[
            { required: true, message: "El nombre es obligatorio" },
            ({ getFieldValue }) => ({
              async validator(_, value) {
                if (!value || value === theme?.attributes.name)
                  return Promise.resolve();
                const response = await themeService.get({
                  filters: { name: value },
                });
                if (response.data.data.length > 0) {
                  return Promise.reject(
                    "El nombre ya está en uso, debe ser único"
                  );
                }
                return Promise.resolve();
              },
            }),
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Cuerpo/s"
          name="categories"
          rules={[{ required: true, message: "El cuerpo es obligatorio" }]}
        >
          <Select
            mode="tags"
            options={categories}
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
        <Form.Item label="Etiqueta" name="tag">
          <Select
            options={TAGS.map((tag) => ({ label: tag, value: tag }))}
            filterOption={(input, opt) => {
              return (
                opt?.label.toLowerCase().includes(input.toLowerCase()) ?? false
              );
            }}
            allowClear
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ThemeForm;
