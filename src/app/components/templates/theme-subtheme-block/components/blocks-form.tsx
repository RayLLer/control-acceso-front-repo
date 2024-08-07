/* eslint-disable react-hooks/exhaustive-deps */
'use client';
import useSubmitable from '@/app/hooks/use-submitable';
import { ISelect } from '@/app/interfaces/basics';
import {
  IBlock,
  IBlockResponse,
  ISubTheme,
  ISubThemeResponse,
} from '@/app/interfaces/question';
import { blockService } from '@/app/services/block.service';
import { subThemeService } from '@/app/services/subthemes.service';
import { themeService } from '@/app/services/themes.service';
import { App, Form, Input, Modal, Select } from 'antd';
import { isAxiosError } from 'axios';
import { FC, useEffect, useState } from 'react';

type Props = {
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
  blockId?: number;
};

const BlockForm: FC<Props> = ({ open, blockId, onClose, onSaved }) => {
  const editMode = !!blockId;
  const [form] = Form.useForm();
  const { notification } = App.useApp();
  const [subThemes, setSubThemes] = useState<ISelect[]>([]);
  const [loading, setLoading] = useState(false);
  const [block, setBlock] = useState<IBlockResponse>();
  const { submittable, setSubmittable } = useSubmitable({ form });

  const fetchBlock = async () => {
    if (editMode) {
      const response = await blockService.getById(blockId, {
        populate: { sub_theme: { populate: '*' } },
      });
      setBlock(() => response.data.data);
      updateFields(response.data.data);
    }
  };

  const fetchSubThemes = async () => {
    const response = await subThemeService.getForSelect('name');
    setSubThemes(() =>
      response.data.data.map((theme) => ({
        label: theme.attributes.name,
        value: theme.id,
      }))
    );
  };

  const updateFields = (subTheme: IBlockResponse) => {
    form.setFieldsValue({
      name: subTheme.attributes.name,
      sub_theme: subTheme.attributes.sub_theme.data?.id,
    });
  };

  useEffect(() => {
    fetchSubThemes();
    editMode && fetchBlock();
  }, [editMode]);

  const onFinish = async (values: any) => {
    const dataTosend = { ...values };
    setLoading(true);
    try {
      if (editMode) {
        await blockService.put(blockId, dataTosend as IBlock);
        notification.success({
          message: 'Bloque actualizado',
          description: 'El Bloque ha sido actualizado correctamente',
        });
        setSubmittable(false);
      } else {
        await blockService.post(dataTosend as IBlock);
        notification.success({
          message: 'Bloque creado',
          description: 'El Bloque ha sido creado correctamente',
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
            'Ha ocurrido un error al guardar el bloque.',
        });
      }
    }
    setLoading(false);
  };

  return (
    <Modal
      open={open}
      title={editMode ? 'Editar Bloque' : 'Agregar Bloque'}
      onCancel={onClose}
      onOk={() => form.submit()}
      okButtonProps={{ disabled: !submittable }}
      confirmLoading={loading}
    >
      <Form onFinish={onFinish} form={form}>
        <Form.Item
          label='Nombre'
          name='name'
          rules={[
            { required: true, message: 'El nombre es obligatorio' },
            ({ getFieldValue }) => ({
              async validator(_, value) {
                const subThemeId = getFieldValue('sub_theme');
                if (
                  !value ||
                  !subThemeId ||
                  (value === block?.attributes.name &&
                    subThemeId === block?.attributes.sub_theme.data.id)
                )
                  return Promise.resolve();
                const response = await blockService.get({
                  filters: {
                    $and: [{ sub_theme: { id: subThemeId } }, { name: value }],
                  },
                });
                if (response.data.data.length > 0) {
                  return Promise.reject(
                    'El nombre ya está en uso para este subtema'
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
          label='SubTema'
          name='sub_theme'
          rules={[{ required: true, message: 'El subtema es obligatorio' }]}
        >
          <Select
            options={subThemes}
            filterOption={(input, opt) => {
              return (
                opt?.label.toLowerCase().includes(input.toLowerCase()) ?? false
              );
            }}
            onChange={() => form.validateFields(['name'])}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default BlockForm;
