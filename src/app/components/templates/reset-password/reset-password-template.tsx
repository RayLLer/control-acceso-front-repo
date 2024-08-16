"use client";
import { paths } from "@/app/routes/paths";
import { axiosBaseInstance } from "@/utils/axios";
import { Flex, Card, Form, Input, Button, App } from "antd";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const ResetPasswordTemplate = () => {
  const router = useRouter();
  const { notification } = App.useApp();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: any) => {
    try {
      setLoading(true);
      const response = await axiosBaseInstance.post(
        "auth/reset-password",
        values,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setLoading(false);
      notification.success({
        message: "Contraseña cambiada",
        description: "Su contraseña ha sido cambiada con éxito",
      });
      router.push(paths.login);
    } catch (error) {
      setLoading(false);
      notification.error({
        message: "Error",
        description: "Hubo un error al cambiar la contraseña",
      });
    }
  };

  return (
    <div
      style={{
        flexDirection: "column",
        width: "100vw",
        height: "100vh",
        margin: 0,
        padding: 0,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundImage: "url(/img/login-background.png)",
        backgroundSize: "cover",
      }}
    >
      <Card title="Cambiar la contraseña" style={{ width: 500 }}>
        <p>
          Copie el código del correo que se le envió y péguelo aquí y cambie su
          contraseña.
        </p>
        <Form
          name="forgotForm"
          layout="horizontal"
          onFinish={onFinish}
          labelWrap
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 16 }}
        >
          <Form.Item
            label="Código"
            name="code"
            rules={[
              {
                required: true,
                message:
                  "Por favor ingrese el código del correo que se le envió",
              },
            ]}
          >
            <Input placeholder="zertyoaizndoianzodianzdonaizdoinaozdnia" />
          </Form.Item>

          <Form.Item
            name="password"
            label="Contraseña"
            rules={[
              {
                required: true,
                message: "Introduzca la contraseña",
              },
              {
                min: 6,
                message: "La contraseña debe tener al menos 6 caracteres",
              },
            ]}
            hasFeedback
          >
            <Input.Password placeholder={"••••••••"} />
          </Form.Item>

          <Form.Item
            name="passwordConfirmation"
            label="Confirmar Contraseña"
            dependencies={["password"]}
            hasFeedback
            rules={[
              {
                required: true,
                message: "Confirme su contraseña",
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error("Las contraseñas no coinciden")
                  );
                },
              }),
            ]}
          >
            <Input.Password placeholder={"••••••••"} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              Enviar
            </Button>
            <Button type="link" onClick={() => router.push(paths.login)}>
              Cancelar
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default ResetPasswordTemplate;
