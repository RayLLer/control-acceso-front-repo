'use client';
import { IRole } from '@/app/interfaces/role';
import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import {
  Button,
  Form,
  Input,
  Select,
  Spin,
  Typography,
  notification,
} from 'antd';
import { MaskedInput } from 'antd-mask-input';
import { useForm } from 'antd/es/form/Form';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import { fetchRoles, SelectAllRoles } from '../../roles/roles.reducer';
import { IUser } from '../users.interface';
import {
  patchUsers,
  postUsers,
  selectLoading,
  selectUserByID
} from '../users.reducer';
import { UsersService } from '../users.service';

const { Title } = Typography;

const usersService = new UsersService();

const { Option } = Select;

const isUser = (data: any): data is IUser => {
  return 'username' in data;
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
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const userId = searchParams.get('userId') ?? 0;
  const router = useRouter();
  const loading = useAppSelector(selectLoading);
  const user = useAppSelector((state) => selectUserByID(state, +userId));
  const roles = useAppSelector(SelectAllRoles);
  const [loadingUsername] = useState(false);
  const [officialRole, setOfficialRole] = useState<IRole>();
  const [disabled, setDisabled] = useState(false);
  const [disabledPosition, setDisabledPosition] = useState(true);


  const fetchUser = async () => {
    try {
      let response: any = await usersService.getById(+userId);
      if (isUser(response.data)) {
        let fullName = '';
        let phone = ''
        setDisabledPosition(() => response.data.role.name !== 'Funcionario');
        if (response.data.role.name === 'Funcionario') {
          fullName = response.data.official?.fullName
          phone = response.data.official.phoneNumber
        }
        if (response.data.role.name === 'Conductor') {
          fullName = response.data.driver?.fullName
          phone = response.data.driver.phoneNumber
        }
        
        if (response.data.role.name === 'Cliente') {
          fullName = response.data.client?.fullName
          phone = response.data.client.phoneNumber
        }
        
        const splittedFullName = fullName.split(' ');
        form.setFieldsValue({
          username: response.data.username,
          email: response.data.email,
          name: splittedFullName[0] ?? '',
          lastName: splittedFullName[1] ?? '',
          phone,
          role: response.data.role.id,
          blocked: response.data.blocked,
          positionHeld: response.data?.official?.positionHeld ?? '',
        });
      }
    } catch (error) {
      notification.error({
        message: 'Error de usuario',
        description: 'Ha ocurrido un error obteniendo los datos del usuario.',
      });
    }
  };

  useEffect(() => {
    console.log(roles)
  }, [roles])
  

  useEffect(() => {
    form.setFieldValue('blocked', false);
    dispatch(fetchRoles(undefined))
      .unwrap()
      .then((result) => {
        userId && fetchUser();
      });
  }, []);

  const onFinish = async (data: any) => {
    let phone: string = data.phone;
    phone = phone.replace(/\D/g, '');

    const userDto: any = {
      username: data.username,
      email: data.email,
      name: data.name,
      lastName: data.lastName,
      phone: phone,
      role: data.role,
      blocked: data.blocked,
    };

    if (data.password !== undefined && data.password.length > 0) {
      userDto.password = data.password;
    }
    userId ? (userDto.id = userId) : (userDto.password = data.password);
    dispatch(userId ? patchUsers(userDto) : postUsers(userDto))
      .unwrap()
      .then((result: any) => {
        const funcDto = {
          fullName: userDto.name + ' ' + userDto.lastName,
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
            ? 'Usuario editado correctamente'
            : 'Usuario creado correctamente',
        });
        router.push('pages/users');
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
      <Title level={2}>{userId ? 'Editar usuario' : 'Crear usuario'}</Title>
      <Form
        {...formItemLayout}
        form={form}
        name='crear/editar'
        onFinish={onFinish}
        // initialValues={{
        //   prefix: '+34',
        // }}
        style={{ maxWidth: 600 }}
        scrollToFirstError
        labelWrap
      >
        <Form.Item
          name='username'
          label='Usuario'
          rules={[
            {
              required: true,
              message: 'Introduzca el usuario',
              whitespace: true,
            },
          ]}
        >
          <Input
            disabled={!!userId || disabled}
            prefix={loadingUsername && <Spin size='small' />}
          />
        </Form.Item>

        <Form.Item
          name='email'
          label='Correo'
          rules={[
            ({ getFieldValue }) => ({
              validator(_, value) {
                if(!value) return Promise.resolve()
                const reEmail = /^(([^<>()\[\]\\.,;:\s@”]+(\.[^<>()\[\]\\.,;:\s@”]+)*)|(“.+”))@((\[[0–9]{1,3}\.[0–9]{1,3}\.[0–9]{1,3}\.[0–9]{1,3}])|(([a-zA-Z\-0–9]+\.)+[a-zA-Z]{2,}))$/
                if (reEmail.test(value)){
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error('Introduzca un email válido')
                );
              },
            }),
            {
              required: true,
              message: 'Introduzca un correo válido',
            },
          ]}
        >
          <Input disabled={!!userId || disabled} />
        </Form.Item>

        <Form.Item
          name='name'
          label='Nombre'
          rules={[
            {
              message: 'Introduzca el nombre',
              whitespace: true,
            },
          ]}
        >
          <Input disabled={disabled} />
        </Form.Item>

        <Form.Item
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
        </Form.Item>

        <Form.Item
          name='phone'
          label='Teléfono'
          rules={[
            { required: true, message: 'Introduzca el número de teléfono' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value) {
                  return Promise.reject();
                }
                value = value.replace(/\D/g, '');
                if (value.length > 0) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error('Introduzca el número de teléfono')
                );
              },
            }),
          ]}
        >
          <MaskedInput
            mask='+(00) 00000000'
            maskOptions={{
              lazy: false,
            }}
            value={form.getFieldValue('phone')}
            disabled={disabled}
          />
        </Form.Item>

        <Form.Item
          name='role'
          label='Rol'
          rules={[
            {
              required: true,
              message: 'Debe seleccionar un rol para el usuario',
            },
          ]}
        >
          <Select
            placeholder='Selecciona un rol'
            options={roles}
            fieldNames={{ value: 'id', label: 'name' }}
            disabled={disabled}
            
          ></Select>
        </Form.Item>

        {!disabledPosition && (
          <Form.Item
            name='positionHeld'
            label='Cargo'
            rules={[
              {
                required: !disabledPosition,
                message: 'Introduzca el cargo del usuario',
              },
            ]}
          >
            <Input disabled={disabled} />
          </Form.Item>
        )}

        <Form.Item
          name='blocked'
          label='Bloqueado'
          rules={[
            {
              required: true,
              message: 'Debe indicar si el usuario está bloqueado o no',
            },
          ]}
        >
          <Select
            options={[
              {
                label: 'Si',
                value: true,
              },
              {
                label: 'No',
                value: false,
              },
            ]}
            defaultValue={[{ label: 'No', value: false }]}
            disabled={disabled}
          />
        </Form.Item>

        <Form.Item
          name='password'
          label='Contraseña'
          rules={[
            {
              required: !userId,
              message: 'Introduzca la contraseña',
            },
            {
              min: 6,
              message: 'La contraseña debe tener al menos 6 caracteres',
            },
          ]}
          hasFeedback
        >
          <Input.Password
            placeholder={userId ? '••••••••': ''}
          />
        </Form.Item>

        <Form.Item
          name='confirm'
          label='Confirmar Contraseña'
          dependencies={['password']}
          hasFeedback
          rules={[
            {
              required: !userId,
              message: 'Confirme su contraseña',
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error('Las contraseñas no coinciden')
                );
              },
            }),
          ]}
        >
          <Input.Password
            placeholder={userId ? '••••••••': ''}
          />
        </Form.Item>

        <Form.Item {...tailFormItemLayout}>
          <Button
            type='primary'
            htmlType='submit'
            // icon={userId ? <EditOutlined /> : <PlusOutlined />}
            style={{ marginRight: 15 }}
            loading={loading}
          >
            Aceptar
          </Button>
          <Button onClick={() => router.push('/pages/users')}>Cancelar</Button>
        </Form.Item>
      </Form>
    </>
  );
};

export default SuspenseForm;
