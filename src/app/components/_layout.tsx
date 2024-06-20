'use client';
import {
  IdcardOutlined,
  LogoutOutlined,
  MoonOutlined,
  QuestionCircleOutlined,
  SafetyCertificateOutlined,
  SunOutlined,
  UnorderedListOutlined,
  UserOutlined,
  BugOutlined
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
  theme as antdTheme,
} from 'antd';
import { usePathname, useRouter } from 'next/navigation';
import { use, useEffect, useState } from 'react';
import { paths } from '../routes/paths';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { setTheme } from '../store/settings/settingsSlice';

const { Sider, Content, Footer, Header } = Layout;
type MenuItem = Required<MenuProps>['items'][number];

const userMenuItems: MenuItem[] = [
  getItem('Salir', '/auth/login', false, <LogoutOutlined />)
];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  disabled?: boolean,
  icon?: React.ReactNode,
  children?: MenuItem[]
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
    disabled,
  } as MenuItem;
}

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const path = usePathname()
  const dispatch = useAppDispatch();
  const theme = useAppSelector((state) => state.settings.theme);
  const [collapsed, setCollapsed] = useState(false);
  const { token } = antdTheme.useToken();
  const items: MenuItem[] = [
    getItem('Gestión de Test', paths.tests.root, false, <IdcardOutlined />),
    getItem(
      'Gestión de Temas y Subtemas',
      paths.home + '/0',
      false,
      <UnorderedListOutlined />
    ),
    getItem(
      'Gestión de Preguntas',
      paths.questions.root,
      false,
      <QuestionCircleOutlined />
    ),
    getItem(
      'Quejas y Errores',
      paths.error_reports.root,
      false,
      <BugOutlined />
    ),
    getItem('Gestión de Usuarios', '/pages/users', false, <UserOutlined />),
    getItem(
      'Roles y permisos',
      '/pages/roles',
      false,
      <SafetyCertificateOutlined />
    ),
  ];

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
            <Col>
              <Switch
                value={theme === 'dark'}
                onChange={changeTheme}
                checkedChildren={<MoonOutlined />}
                unCheckedChildren={<SunOutlined />}
              />
            </Col>

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
