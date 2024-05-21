'use client';
import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import { sources } from '@/utils/sources';
import { Button, Form, Input, Space, Spin, notification } from 'antd';
import { useForm } from 'antd/es/form/Form';
import Title from 'antd/es/typography/Title';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  SelectAllRoles,
  fetchPermissions,
  fetchRoles,
  patchRoles,
  postRoles,
  selectError,
  selectPermissions,
  selectRoleByID,
} from '../../roles/roles.reducer';
import { RolesServices } from '../roles.service';
import PermissionsCheckBox from './permissionsCheckBox';

const rolesService = new RolesServices();

const FormRole = () => {
  const [form] = useForm();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  let roleId = searchParams.get('roleId');
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
      let response = await rolesService.getRoleById(
        sources.ROLES,
        parseInt(roleId!)
      );

      let rolePermissionsResponse = await rolesService.getPermissionsByRoleID(
        sources.ROLE_PERMISSION + '/getCustomPermissionsByRoleId',
        parseInt(roleId!)
      );

      const auxRolePermissions =
        rolePermissionsResponse.data[0]?.custom_permissions.map((p) => {
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
    } catch (error) {
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

  const onFinish = async (data: any) => {
    try {
      const roleDto: any = {
        name: data.name,
        description: data.description,
        // type: data.type,
      };
      roleId && (roleDto.id = roleId);
      setLoading(true);
      if (!roleId) {
        await dispatch(postRoles(roleDto));
        await dispatch(fetchRoles(undefined))
          .unwrap()
          .then((res) => {
            const tempRol = res.find((r) => r.name === data.name);
            roleId = tempRol.id.toString();
          })
          .catch((err) => {});
      } else {
        await dispatch(patchRoles(roleDto));
      }
      await rolesService.updatePermissions(
        sources.ROLE_PERMISSION + '/updateRole',
        { roleId: parseInt(roleId), customPermissionsIds: data.permissions }
      );
      setLoading(false);
      router.push('pages/roles');
    } catch (error) {
      setLoading(false);
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

export default FormRole;
