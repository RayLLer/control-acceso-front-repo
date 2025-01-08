/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import useSubmitable from "@/app/hooks/use-submitable";
import { ISelect } from "@/app/interfaces/basics";
import {
  IFinalPhrase,
  IFinalPhraseResponse,
} from "@/app/interfaces/final-phrase";
import { finalPhraseService } from "@/app/services/final-phrase.service";
import { App, Form, Input, Modal, Select } from "antd";
import { isAxiosError } from "axios";
import { FC, useEffect, useState } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
  finalPhraseId?: number;
};

const FinalPhraseForm: FC<Props> = ({ open, finalPhraseId, onClose, onSaved }) => {
  const editMode = !!finalPhraseId;
  const [form] = Form.useForm();
  const { notification } = App.useApp();
  const [loading, setLoading] = useState(false);
  const [finalPhrase, setFinalPhrase] = useState<IFinalPhraseResponse>();
  const { submittable, setSubmittable } = useSubmitable({ form });

  const fetchFinalPhrase = async () => {
    const response = await finalPhraseService.getById(finalPhraseId!, {});
    setFinalPhrase(() => response.data.data);
    updateFields(response.data.data);
  };

  const updateFields = (finalPhrase: IFinalPhraseResponse) => {
    form.setFieldsValue({
      description: finalPhrase.attributes.description,
    });
  };

  useEffect(() => {
    fetchFinalPhrase();
  }, []);

  const onFinish = async (values: any) => {
    const dataTosend = { ...values };
    setLoading(true);
    try {  
      await finalPhraseService.put(finalPhraseId!, dataTosend as IFinalPhrase);
      notification.success({
        message: "Frase final actualizada",
        description: "La frase final ha sido actualizada correctamente",
      });
      setSubmittable(false);
      onSaved();
    } catch (error: any) {
      if (isAxiosError(error)) {
        notification.error({
          type: "error",
          message: "Error",
          description:
            error.response?.data?.error.message ??
            "Ha ocurrido un error al guardar la frase final.",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      title={"Editar Frase Final"}
      onCancel={onClose}
      onOk={() => form.submit()}
      okButtonProps={{ disabled: !submittable }}
      confirmLoading={loading}
    >
      <Form onFinish={onFinish} form={form}>
        <Form.Item
          label="Texto"
          name="description"
          rules={[
            { required: true, message: "El texto es obligatorio" },
          ]}
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default FinalPhraseForm;
