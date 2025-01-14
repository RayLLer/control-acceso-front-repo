/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import useSubmitable from "@/app/hooks/use-submitable";
import { IErrorReport, IErrorReportResponse } from "@/app/interfaces/error-reports";
import { errorReportsService } from "@/app/services/error-reports.service";
import { ERROR_REPORT_STATES } from "@/utils/constants/constants";
import { App, Form, Input, Modal, Button, Divider } from "antd";
import { isAxiosError } from "axios";
import { FC, useEffect, useState } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
  errorReportId?: number;
};

const ErrorReportForm: FC<Props> = ({ open, errorReportId, onClose, onSaved }) => {
  const [form] = Form.useForm();
  const { notification } = App.useApp();
  const [loading, setLoading] = useState(false);
  const [errorReport, setErrorReport] = useState<IErrorReportResponse>();
  const { setSubmittable } = useSubmitable({ form });

  // Función para cargar los datos del reporte
  const fetchErrorReport = async () => {
    const response = await errorReportsService.getById(errorReportId!, {
      populate: {
        question: { populate: "theme" },
        users_permissions_user: true,
      },
    });
    setErrorReport(() => response.data.data);  // Set state first
    updateFields(response.data.data);          // Then update fields
  };

  // Actualizar los campos del formulario
  const updateFields = (errorReport: IErrorReportResponse) => {
    form.setFieldsValue({
      question: errorReport.attributes.question.data?.attributes.questionText || "N/A",
      theme: errorReport.attributes.question.data?.attributes.theme.data.attributes.name || "N/A",
      selectedCause: errorReport.attributes.selectedCause || "N/A",
      textError: errorReport.attributes.textError || "N/A",
      date: new Date(errorReport.attributes.date).toLocaleString() || "N/A",
      user: errorReport.attributes.users_permissions_user?.data?.attributes.username || "N/A",
      answer: errorReport.attributes.answer || "",
    });
  };

  // Ejecutar fetchErrorReport solo cuando el modal se abre
  useEffect(() => {
    if (errorReportId) {
      fetchErrorReport();
    }
  }, []);  // Match the same dependency pattern

  // Enviar los datos del formulario
  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      if (errorReportId && errorReport) {
        const updateData: IErrorReport = {
          ...errorReport.attributes,
          answer: values.answer,
          state: ERROR_REPORT_STATES.RESOLVED,
        };

        await errorReportsService.put(errorReportId, updateData);
        notification.success({
          message: "Respuesta actualizada",
          description: "La respuesta ha sido actualizada correctamente.",
        });

        setSubmittable(false);
        onSaved();
      }
    } catch (error: any) {
      if (isAxiosError(error)) {
        notification.error({
          message: "Error",
          description: error.response?.data?.error?.message || "Error al guardar la respuesta.",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      title="Responder Error"
      onCancel={onClose}
      footer={null}
      confirmLoading={loading}
      width={600}
    >
      <Form
        form={form}
        layout="horizontal"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        onFinish={onFinish}
        autoComplete="off"
        requiredMark={false}
        //style={{ marginLeft: "0px", marginRight: "10px" }}
      >
        <Form.Item 
          style={{ marginBottom: "12px" }}
          name="question"
          label="Pregunta:">
            <Input disabled style={{ flex: 1 }} />
        </Form.Item>

        <Form.Item 
          style={{ marginBottom: "12px" }}
          name="theme"
          label="Tema:">
            <Input disabled style={{ flex: 1 }} />
        </Form.Item>

        <Form.Item 
          style={{ marginBottom: "12px" }}
          name="selectedCause"
          label="Causa seleccionada:">
            <Input disabled style={{ flex: 1 }} />
        </Form.Item>

        <Form.Item 
          style={{ marginBottom: "12px" }}
          name="textError"
          label="Texto del Error:">
            <Input.TextArea disabled style={{ flex: 1 }} rows={2} />
        </Form.Item>

        <Form.Item 
          style={{ marginBottom: "12px" }}
          name="date"
          label="Fecha:">
            <Input disabled style={{ flex: 1 }} />
        </Form.Item>

        <Form.Item 
          style={{ marginBottom: "12px" }}
          name="user"
          label="Usuario:">
            <Input disabled style={{ flex: 1 }} />
        </Form.Item>

        <Divider style={{ margin: "20px 0" }} />

        <Form.Item
          label="Responder"
          name="answer"
          rules={[{ required: true, message: "Debes ingresar una respuesta." }]}
        >
          <Input.TextArea rows={4} placeholder="Escribe tu respuesta aquí..." />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} style={{ float: "right" }}>
            Enviar y Resolver
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ErrorReportForm;
