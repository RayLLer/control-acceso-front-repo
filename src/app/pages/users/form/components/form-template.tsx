"use client";
import { IRole } from "@/app/interfaces/role";
import { useAppDispatch, useAppSelector } from "@/app/store/hooks";
import {
  Button,
  Form,
  Input,
  Select,
  Spin,
  Typography,
  notification,
} from "antd";
import PhotoUpload from "./photo-upload";
import { MaskedInput } from "antd-mask-input";
import { useForm } from "antd/es/form/Form";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { fetchRoles, SelectAllRoles } from "../../../roles/roles.reducer";
import { IUser } from "../../users.interface";
import {
  patchUsers,
  postUsers,
  selectLoading,
  selectUserByID,
} from "../../users.reducer";
import { UsersService } from "../../users.service";
import useSubmitable from "@/app/hooks/use-submitable";

const { Title } = Typography;

const usersService = new UsersService();

const { Option } = Select;

const isUser = (data: any): data is IUser => {
  return "username" in data;
};

const SuspenseForm = () => {
  return (
    <Suspense>
      <FormUser />
    </Suspense>
  );
};

const FormUser = () => {
  const [form] = useForm();
  const userId = useParams().id;
  const dispatch = useAppDispatch();
  const router = useRouter();
  const loading = useAppSelector(selectLoading);
  const user = useAppSelector((state) => selectUserByID(state, +userId));
  const roles = useAppSelector(SelectAllRoles);
  const [loadingUsername] = useState(false);
  const [officialRole, setOfficialRole] = useState<IRole>();
  const [disabled, setDisabled] = useState(false);
  const [disabledPosition, setDisabledPosition] = useState(true);
  const { submittable, setSubmittable } = useSubmitable({ form });

  const fetchUser = async () => {
    try {
      let response: any = await usersService.getById(+userId, {
        populate: "*",
      });
      if (isUser(response.data)) {
        form.setFieldsValue({
          username: response.data.username,
          email: response.data.email,
          name: response.data.name ?? "",
          numeroIdentificacion: response.data.numeroIdentificacion ?? "",
          nombreApellidos: response.data.nombreApellidos ?? "",
          phone: response.data.phone,
          foto:
            response.data.foto && response.data.foto !== "undefined"
              ? Array.isArray(response.data.foto)
                ? response.data.foto[0]
                : response.data.foto
              : null,
          role: response.data.role.id,
          blocked: response.data.blocked,
          positionHeld: response.data?.official?.positionHeld ?? "",
          confirmed: response.data.confirmed,
        });
      }
    } catch (error) {
      notification.error({
        message: "Error de usuario",
        description: "Ha ocurrido un error obteniendo los datos del usuario.",
      });
    }
  };

  useEffect(() => {
    console.log(roles);
  }, [roles]);

  useEffect(() => {
    form.setFieldValue("blocked", false);
    dispatch(fetchRoles(undefined))
      .unwrap()
      .then((result) => {
        userId && fetchUser();
      });
  }, []);

  const onFinish = async (data: any) => {
    

    const userDto: any = {
      username: data.username,
      email: data.email,
      name: data.name,
      lastName: data.lastName,
      numeroIdentificacion: data.numeroIdentificacion,
      phone: data.phone,
      nombreApellidos: data.nombreApellidos,
      role: data.role,
      blocked: data.blocked,
      confirmed: userId ? data.confirmed : true,
    };

    if (data.password !== undefined && data.password.length > 0) {
      userDto.password = data.password;
    }
    if (data.foto && data.foto !== "undefined") {
      if (Array.isArray(data.foto)) {
        userDto.foto = data.foto[0]?.id ?? null;
      } else {
        userDto.foto = data.foto.id ?? data.foto ?? null;
      }
    } else {
      userDto.foto = null;
    }
    userId ? (userDto.id = userId) : (userDto.password = data.password);
    dispatch(userId ? patchUsers(userDto) : postUsers(userDto))
      .unwrap()
      .then((result: any) => {
        const funcDto = {
          fullName: userDto.name + " " + userDto.lastName,
          phoneNumber: userDto.phone,
          email: userDto.email,
          user: result.id,
          positionHeld: data.positionHeld,
        };
        // if (userId && user.official) {
        //   officialServices.put(user.official.id, funcDto as any);
        // } else {
        //   officialServices.post(funcDto as any);
        // }
        notification.success({
          message: userId
            ? "Usuario editado correctamente"
            : "Usuario creado correctamente",
        });
        setSubmittable(false);
        router.push("/pages/users");
      })
      .catch((error) => {});
  };

  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 8 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 16 },
    },
  };

  const tailFormItemLayout = {
    wrapperCol: {
      xs: {
        span: 24,
        offset: 0,
      },
      sm: {
        span: 16,
        offset: 8,
      },
    },
  };

  return (
    <>
      <Title level={2}>{userId ? "Editar usuario" : "Crear usuario"}</Title>
      <Form
        {...formItemLayout}
        form={form}
        name="crear/editar"
        onFinish={onFinish}
        // initialValues={{
        //   prefix: '+34',
        // }}
        style={{ maxWidth: 600 }}
        scrollToFirstError
        labelWrap
      >
        <Form.Item
          name="username"
          label="Usuario"
          validateTrigger="onBlur"
          rules={[
            {
              required: true,
              message: "Introduzca el usuario",
              whitespace: true,
            },
            ({ getFieldValue }) => ({
              async validator(_, value) {
                if (!value || value === getFieldValue("username"))
                  return Promise.resolve();
                const response = (await usersService.get({
                  filters: { username: value },
                })) as any;
                if (response.data.length === 0) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error("El nombre de usuario ya está en uso")
                );
              },
            }),
          ]}
        >
          <Input
            disabled={!!userId || disabled}
            prefix={loadingUsername && <Spin size="small" />}
          />
        </Form.Item>

        <Form.Item
          name="email"
          label="Correo"
          validateTrigger="onBlur"
          rules={[
            ({ getFieldValue }) => ({
              async validator(_, value) {
                if (!value || value === getFieldValue("email"))
                  return Promise.resolve();
                const reEmail =
                  /^(([^<>()\[\]\\.,;:\s@”]+(\.[^<>()\[\]\\.,;:\s@”]+)*)|(“.+”))@((\[[0–9]{1,3}\.[0–9]{1,3}\.[0–9]{1,3}\.[0–9]{1,3}])|(([a-zA-Z\-0–9]+\.)+[a-zA-Z]{2,}))$/;
                const response = (await usersService.get({
                  filters: { email: value },
                })) as any;
                if (reEmail.test(value) && response.data.length === 0) {
                  return Promise.resolve();
                }
                if (response.data.length > 0) {
                  return Promise.reject(new Error("El correo ya está en uso"));
                }
                return Promise.reject(new Error("Introduzca un email válido"));
              },
            }),
            {
              required: true,
              message: "Introduzca un correo válido",
            },
          ]}
        >
          <Input disabled={!!userId || disabled} />
        </Form.Item>

        <Form.Item
          name="nombreApellidos"
          label="Nombre completo"
          rules={[
            { required: true, message: "El nombre completo es obligatorio." },
            {
              message: "Introduzca el nombre",
              whitespace: true,
            },
          ]}
        >
          <Input disabled={disabled} />
        </Form.Item>

        {/* <Form.Item
          name='lastName'
          label='Apellidos'
          rules={[
            {
              message: 'Introduzca los apellidos',
              whitespace: true,
            },
          ]}
        >
          <Input disabled={disabled} />
        </Form.Item> */}

        <Form.Item
          name="numeroIdentificacion"
          label="Número de identificación"
          rules={[
            { required: true, message: "El nombre completo es obligatorio." },
            {
              message: "Introduzca el nombre",
              whitespace: true,
            },
          ]}
        >
          <Input disabled={disabled} />
        </Form.Item>
        <Form.Item
          name="phone"
          label="Teléfono"
          rules={[
            { required: true, message: "Introduzca el número de teléfono" },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value) {
                  return Promise.reject();
                }
                value = value.replace(/\D/g, "");
                if (value.length > 0) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error("Introduzca el número de teléfono")
                );
              },
            }),
          ]}
        >
          <MaskedInput
            mask={(value: any) => {
              if (value.startsWith("+53")) {
                return "+(53)#######";
              } else if (value.startsWith("+34")) {
                return "+(34)#########";
              } else {
                return "+(00)000000000";
              }
            }}
            maskOptions={{
              lazy: false,
            }}
            disabled={disabled}
          />
        </Form.Item>

        <Form.Item name="foto" label="Foto">
          <PhotoUpload />
        </Form.Item>

        <Form.Item
          name="role"
          label="Rol"
          rules={[
            {
              required: true,
              message: "Debe seleccionar un rol para el usuario",
            },
          ]}
        >
          <Select
            placeholder="Selecciona un rol"
            options={roles}
            fieldNames={{ value: "id", label: "name" }}
            disabled={disabled}
          ></Select>
        </Form.Item>

        {!disabledPosition && (
          <Form.Item
            name="positionHeld"
            label="Cargo"
            rules={[
              {
                required: !disabledPosition,
                message: "Introduzca el cargo del usuario",
              },
            ]}
          >
            <Input disabled={disabled} />
          </Form.Item>
        )}

        <Form.Item
          name="blocked"
          label="Bloqueado"
          rules={[
            {
              required: true,
              message: "Debe indicar si el usuario está bloqueado o no",
            },
          ]}
        >
          <Select
            options={[
              {
                label: "Si",
                value: true,
              },
              {
                label: "No",
                value: false,
              },
            ]}
            defaultValue={[{ label: "No", value: false }]}
            disabled={disabled}
          />
        </Form.Item>

        <Form.Item
          name="password"
          label="Contraseña"
          rules={[
            {
              required: !userId,
              message: "Introduzca la contraseña",
            },
            {
              min: 6,
              message: "La contraseña debe tener al menos 6 caracteres",
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!userId) {
                  const regex =
                    /^(?=.*[A-Z])(?=.*[a-z])(?=.*[^a-zA-Z0-9]).{8,}$/;
                  return regex.test(value)
                    ? Promise.resolve()
                    : Promise.reject(
                        "La contraseña debe tener al menos 8 caracteres, una mayúscula, una minuscula y un caracter especial"
                      );
                }
                return Promise.resolve();
              },
            }),
          ]}
          hasFeedback
        >
          <Input.Password placeholder={userId ? "••••••••" : ""} />
        </Form.Item>

        <Form.Item
          name="confirm"
          label="Confirmar Contraseña"
          dependencies={["password"]}
          hasFeedback
          rules={[
            {
              required: !userId,
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
          <Input.Password placeholder={userId ? "••••••••" : ""} />
        </Form.Item>

        <Form.Item {...tailFormItemLayout}>
          <Button
            type="primary"
            htmlType="submit"
            // icon={userId ? <EditOutlined /> : <PlusOutlined />}
            style={{ marginRight: 15 }}
            loading={loading}
            disabled={!submittable}
          >
            Aceptar
          </Button>
          <Button onClick={() => router.push("/pages/users")}>Cancelar</Button>
        </Form.Item>
      </Form>
    </>
  );
};

export default SuspenseForm;
