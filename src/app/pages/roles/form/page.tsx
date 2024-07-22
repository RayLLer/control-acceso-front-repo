'use client';
import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import { sources } from '@/utils/sources';
import { Button, Form, Input, Space, Spin, notification } from 'antd';
import { useForm } from 'antd/es/form/Form';
import Title from 'antd/es/typography/Title';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import {
  SelectAllRoles,
  fetchPermissions,
  fetchRoles,
  patchRoles,
  postRoles,
  selectError,
  selectPermissions,
  selectRoleByID,
} from '../roles.reducer';
import { RolesServices } from '../roles.service';
import PermissionsCheckBox from './permissionsCheckBox';

const rolesService = new RolesServices();

const SuspenseForm = () => {
  return (
    <Suspense>
      <FormRole />
    </Suspense>
  );
};

const FormRole = () => {
  const [form] = useForm();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const roleId = searchParams.get('roleId') ?? 0;
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const error = useAppSelector(selectError);
  const permissions = useAppSelector(selectPermissions);
  const roles = useAppSelector(SelectAllRoles);
  const [rolePermissions, setRolePermissions] = useState();
  const [loadingGeneral, setLoadingGeneral] = useState(false);

  const fetchRole = async () => {
    try {
      setLoadingGeneral(true);
      let response = await rolesService.getRoleById(sources.ROLES, +roleId);

      let rolePermissionsResponse = await rolesService.getPermissionsByRoleID(
        sources.ROLE_PERMISSION + '/getCustomPermissionsByRoleId',
        +roleId
      );

      const auxRolePermissions =
        rolePermissionsResponse.data[0]?.custom_permissions.map((p: any) => {
          return p.id;
        }) ?? [];

      setRolePermissions(auxRolePermissions);
      form.setFieldsValue({
        name: response.data.role.name,
        description: response.data.role.description,
        type: response.data.role.type,
        permissions: auxRolePermissions,
      });
      setLoadingGeneral(false);
    } catch (error: any) {
      setLoadingGeneral(false);
      notification.error({
        message: error.message ?? 'Error al obtener los permisos del rol',
      });
    }
  };

  useEffect(() => {
    dispatch(fetchPermissions(undefined));
    roleId && fetchRole();
  }, []);

  const updatePermissions = async (roleId: number, permissions: number[]) => {
    try {
      await rolesService.updatePermissions(
        sources.ROLE_PERMISSION + '/updateRole',
        { roleId: +roleId, customPermissionsIds: permissions }
      );
    } catch (error) {
      notification.error({
        message: 'Error',
        description: 'Los permisos no fueron actualizados correctamente.',
      });
    }
  };

  const onFinish = async (data: any) => {
    try {
      const roleDto: any = {
        name: data.name,
        description: data.description,
        // type: data.type,
      };
      roleId && (roleDto.id = roleId);
      setLoading(true);
      try {
        if(!roleId){
          debugger
          await rolesService.postRole(roleDto);
          const response = await rolesService.get() as any;
          const id  = response.data.roles.find((r: any) => r.name === data.name)!.id;
          await updatePermissions(id, data.permissions);
          notification.success({
            message: 'Rol creado correctamente.',
          });
        } else {
          await rolesService.put(+roleId, roleDto);
          await updatePermissions(+roleId, data.permissions);
          notification.success({
            message: 'Rol actualizado correctamente.',
          });
        }
        router.push('/pages/roles');
        
      } catch (error) {
        console.log(error)  
      }
      
    } catch (error) {
      setLoading(false);
      notification.error({
        message: 'Error al guardar el rol',
      });
    }
  };

  const formItemLayout = {
    labelCol: {
      xs: { span: 4 },
      // sm: { span: 8 },
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

  return loadingGeneral ? (
    <Space
      size='middle'
      style={{ minHeight: '50vh', width: '70vw', justifyContent: 'center' }}
    >
      <Spin size='large' />
    </Space>
  ) : (
    <>
      <Title level={2}>{roleId ? 'Editar rol' : 'Crear rol'}</Title>
      <Form
        {...formItemLayout}
        form={form}
        name='crear/editar'
        onFinish={onFinish}
        style={{
          maxWidth: '70%',
        }}
        scrollToFirstError
        labelWrap
      >
        <Form.Item
          name='name'
          label='Nombre'
          rules={[
            {
              required: true,
              message: 'Introduzca el nombre',
              whitespace: true,
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name='description'
          label='Descripción'
          rules={[
            {
              message: 'Introduzca la descripción',
              whitespace: true,
            },
          ]}
        >
          <Input />
        </Form.Item>

        {/* <Form.Item
          name='type'
          label='Tipo'
          rules={[
            {
              message: 'Introduzca el tipo',
            },
          ]}
        >
          <Input />
        </Form.Item> */}

        <Form.Item
          name='permissions'
          label='Permisos'
          rules={[
            {
              required: true,
              type: 'array',
              min: 1,
            },
          ]}
        >
          <PermissionsCheckBox
            permissions={permissions}
            userPermissions={rolePermissions}
            onValueChange={(values) => {
              form.setFieldValue('permissions', values);
            }}
          />
        </Form.Item>

        <Form.Item {...tailFormItemLayout}>
          <Button
            type='primary'
            htmlType='submit'
            // icon={roleId ? <EditOutlined /> : <PlusOutlined />}
            style={{ marginRight: 15 }}
            loading={loading}
          >
            Aceptar
          </Button>
          <Button onClick={() => router.push('/pages/roles')}>Cancelar</Button>
        </Form.Item>
      </Form>
    </>
  );
};

export default SuspenseForm;
