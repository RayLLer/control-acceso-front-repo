/* eslint-disable react-hooks/exhaustive-deps */
'use client';
import {
  BugOutlined,
  FileDoneOutlined,
  IdcardOutlined,
  LogoutOutlined,
  MoonOutlined,
  QuestionCircleOutlined,
  SafetyCertificateOutlined,
  SunOutlined,
  UnorderedListOutlined,
  UserOutlined,
} from '@ant-design/icons';
import {
  Button,
  Card,
  Col,
  Dropdown,
  Image,
  Layout,
  Menu,
  MenuProps,
  Row,
  Switch,
  Typography,
  theme as antdTheme,
} from 'antd';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { paths } from '../routes/paths';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { setTheme } from '../store/settings/settingsSlice';
import { PermissionsEnum, validatePermissionName } from '@/utils/permissions';
import { getLoggedUser } from '../pages/users/users.reducer';
import useValidatePermissions from '@/utils/hooks/use-validate-permissions';

const { Sider, Content, Footer, Header } = Layout;
type MenuItem = Required<MenuProps>['items'][number];

const userMenuItems: MenuItem[] = [
  getItem('Salir', '/auth/login', false, <LogoutOutlined />),
];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  active?: boolean,
  icon?: React.ReactNode,
  children?: MenuItem[]
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
    disabled: !active,
  } as MenuItem;
}

const FONT_SIZE = 20;

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const path = usePathname();
  const dispatch = useAppDispatch();
  const theme = useAppSelector((state) => state.settings.theme);
  const [collapsed, setCollapsed] = useState(false);
  const { token } = antdTheme.useToken();

  const { loggedUser } = useAppSelector((state) => state.users);

  const { validate } = useValidatePermissions();

  const items: MenuItem[] = useMemo(() => {
    console.log(loggedUser);
    return !loggedUser.id
      ? []
      : [
          getItem(
            'Gestión de Test',
            paths.tests.root,
            validate(PermissionsEnum.GestionarTest),
            <IdcardOutlined style={{ fontSize: FONT_SIZE }} />
          ),
          getItem(
            'Gestión de Categorías',
            paths.theme_subtheme_block.root,
            validate(PermissionsEnum.GestionarCategorias),
            <UnorderedListOutlined style={{ fontSize: FONT_SIZE }} />
          ),
          getItem(
            'Gestión de Preguntas',
            paths.questions.root,
            validate(PermissionsEnum.GestionarPreguntas),
            <QuestionCircleOutlined style={{ fontSize: FONT_SIZE }} />
          ),
          getItem(
            'Tests Realizados',
            paths.realized_tests.root,
            validate(PermissionsEnum.VerTestsRealizados),
            <FileDoneOutlined style={{ fontSize: FONT_SIZE }} />
          ),
          getItem(
            'Quejas y Errores',
            paths.error_reports.root,
            validate(PermissionsEnum.VerReporteDeQuejasYErrores),
            <BugOutlined style={{ fontSize: FONT_SIZE }} />
          ),
          getItem(
            'Gestión de Usuarios',
            '/pages/users',
            validate(PermissionsEnum.GestionarUsuarios),
            <UserOutlined />
          ),
          getItem(
            'Roles y permisos',
            '/pages/roles',
            validate(PermissionsEnum.GestionarRolesPermisos),
            <SafetyCertificateOutlined style={{ fontSize: FONT_SIZE }} />
          ),
        ];
  }, [loggedUser]);

  useEffect(() => {
    dispatch(getLoggedUser(undefined));
  }, []);

  const onClick: MenuProps['onClick'] = (e) => {
    if (e.key == '/auth/login') {
      localStorage.clear();
    }
    router.push(e.key);
  };

  const changeTheme = (value: boolean) => {
    dispatch(setTheme(value ? 'dark' : 'light'));
  };

  return (
    <Layout style={{ minHeight: '100vh', backgroundColor: token.colorPrimary }}>
      <Sider
        collapsible
        style={{ marginTop: 20 }}
        width={250}
        collapsed={collapsed}
        onCollapse={setCollapsed}
      >
        {!collapsed ? (
          <Image
            alt='Logo'
            src='/img/logo.png'
            height={70}
            width={'80%'}
            style={{ marginLeft: 20 }}
            preview={false}
          />
        ) : (
          <Image
            alt='Logo'
            src='/img/logo-collapsed.png'
            height={30}
            style={{ marginLeft: 5 }}
            preview={false}
          />
        )}

        <Menu
          mode='inline'
          items={items}
          style={{ marginTop: 20, fontWeight: 700 }}
          onClick={onClick}
          defaultActiveFirst
        />
      </Sider>
      <Layout className='site-layout'>
        <Header
          style={{
            padding: 0,
          }}
        >
          <Row justify={'end'} gutter={8}>
            {/* <Col>
              <Switch
                value={theme === 'dark'}
                onChange={changeTheme}
                checkedChildren={<MoonOutlined />}
                unCheckedChildren={<SunOutlined />}
              />
            </Col> */}

            <Col style={{ marginRight: 20 }}>
              <Dropdown
                menu={{ items: userMenuItems, onClick }}
                placement='bottomRight'
                arrow
              >
                <Button icon={<UserOutlined />} danger>
                  {'Develop'}
                </Button>
              </Dropdown>
            </Col>
          </Row>
        </Header>
        <Content style={{ margin: '0 16px' }}>
          <Card style={{ marginTop: 10, minHeight: '80vh' }}>{children}</Card>
        </Content>
        <Footer style={{ textAlign: 'center' }}>
          TestOpo©{new Date().getFullYear()}
        </Footer>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
