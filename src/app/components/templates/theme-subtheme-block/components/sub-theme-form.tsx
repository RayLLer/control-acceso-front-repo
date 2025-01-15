/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import useSubmitable from "@/app/hooks/use-submitable";
import { ISelect } from "@/app/interfaces/basics";
import { ISubTheme, ISubThemeResponse } from "@/app/interfaces/question";
import { subThemeService } from "@/app/services/subthemes.service";
import { themeService } from "@/app/services/themes.service";
import { App, Form, Input, Modal, Select } from "antd";
import { isAxiosError } from "axios";
import { FC, useEffect, useState } from "react";
import { CategoryThemes } from "@/app/interfaces/theme";

type Props = {
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
  subThemeId?: number;
};

const SubThemeForm: FC<Props> = ({ open, subThemeId, onClose, onSaved }) => {
  const editMode = !!subThemeId;
  const [form] = Form.useForm();
  const { notification } = App.useApp();
  const [themes, setThemes] = useState<ISelect[]>([]);
  const [loading, setLoading] = useState(false);
  const [subTheme, setSubTheme] = useState<ISubThemeResponse>();
  const { submittable, setSubmittable } = useSubmitable({ form });

  const fetchSubTheme = async () => {
    if (editMode) {
      const response = await subThemeService.getById(subThemeId, {
        populate: { theme: { populate: "*" } },
      });
      setSubTheme(() => response.data.data);
      updateFields(response.data.data);
    }
  };

  const fetchThemes = async () => {
    const response = await themeService.get({
      fields: ["name"],
      filters: {
        deleted: false, // Excluir temas eliminados
      },
      populate: { category_themes : {
        populate: { category: true },
      } },
    });

    const categories = (array: CategoryThemes[]): string => {
      return array
        .map(item => item.attributes.category.data.attributes.name)
        .join(", ");
    }
    
    setThemes(() =>
      response.data.data.map((theme) => ({
        label: `${theme.attributes.name}: ${categories(theme.attributes.category_themes.data ?? [])}`,
        value: theme.id,
      }))
    );
  };

  const updateFields = (subTheme: ISubThemeResponse) => {
    form.setFieldsValue({
      name: subTheme.attributes.name,
      theme: subTheme.attributes.theme.data?.id,
    });
  };

  useEffect(() => {
    fetchThemes();
    editMode && fetchSubTheme();
  }, [editMode]);

  const onFinish = async (values: any) => {
    const dataTosend = { ...values };
    setLoading(true);
    try {
      if (editMode) {
        await subThemeService.put(subThemeId, dataTosend as ISubTheme);
        notification.success({
          message: "SubTema actualizado",
          description: "El subtema ha sido actualizado correctamente",
        });
        setSubmittable(false);
      } else {
        await subThemeService.post(dataTosend as ISubTheme);
        notification.success({
          message: "SubTema creado",
          description: "El subtema ha sido creado correctamente",
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
      title={editMode ? "Editar SubTema" : "Agregar SubTema"}
      onCancel={onClose}
      onOk={() => form.submit()}
      okButtonProps={{ disabled: !submittable }}
      confirmLoading={loading}
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
                const themeId = getFieldValue("theme");
                if (
                  !value ||
                  !themeId ||
                  (value === subTheme?.attributes.name &&
                    themeId === subTheme?.attributes.theme.data.id)
                )
                  return Promise.resolve();
                const response = await subThemeService.get({
                  filters: {
                    $and: [{ theme: { id: themeId } }, { name: value }],
                  },
                });
                if (response.data.data.length > 0) {
                  return Promise.reject(
                    "El nombre ya está en uso para este tema"
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
          label="Tema"
          name="theme"
          rules={[{ required: true, message: "El tema es obligatorio" }]}
        >
          <Select
            options={themes}
            filterOption={(input, opt) => {
              return (
                opt?.label.toLowerCase().includes(input.toLowerCase()) ?? false
              );
            }}
            onChange={() => form.validateFields(["name"])}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default SubThemeForm;
