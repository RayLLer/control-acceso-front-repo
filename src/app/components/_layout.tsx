// 'use client';
// import {
//   CarOutlined,
//   ContainerOutlined,
//   DesktopOutlined,
//   LogoutOutlined,
//   RiseOutlined,
//   SafetyCertificateOutlined,
//   SettingOutlined,
//   UserOutlined,
//   WechatOutlined,
//   CreditCardOutlined,
//   FileDoneOutlined,
//   InfoCircleOutlined,
//   QuestionCircleOutlined
// } from '@ant-design/icons';
// import {
//   Button,
//   Card,
//   Col,
//   Dropdown,
//   Layout,
//   Menu,
//   MenuProps,
//   Row,
//   Space,
//   Spin,
//   theme,
// } from 'antd';
// import { usePathname, useRouter } from 'next/navigation';
// import React, { useEffect, useRef, useState } from 'react';

// import { icons } from '@/utils/icons';
// import { getLoggedUser } from '../pages/users/users.reducer';
// import { paths } from '../routes/paths';
// import { useAppDispatch } from '../store/hooks';
// import { PermissionsEnum, validatePermissionName } from '@/utils/permissions';
// import { IUser } from '../interfaces/user';
// import { colors } from '@/theming/colors';

// const { Header, Content, Footer, Sider } = Layout;

// type MenuItem = Required<MenuProps>['items'][number];

// function getItem(
//   label: React.ReactNode,
//   key: React.Key,
//   disabled?: boolean,
//   icon?: React.ReactNode,
//   children?: MenuItem[]
// ): MenuItem {
//   return {
//     key,
//     icon,
//     children,
//     label,
//     disabled,
//   } as MenuItem;
// }

// const userMenuItems: MenuItem[] = [
//   getItem('Salir', '/auth/login', false, <LogoutOutlined />),
//   // getItem('Campañas y creatividades', '/pages/campaigns', <FundViewOutlined />),
// ];

// const MainLayout = ({ children }: { children: React.ReactNode }) => {
//   const router = useRouter();
//   const pathname = usePathname();
//   const [collapsed, setCollapsed] = useState(false);
//   const [user, setUser] = useState<any>();
//   const [loading, setLoading] = useState<boolean>(false);
//   const dispatch = useAppDispatch();
//   const {
//     token: { colorWhite, colorBgContainer },
//   } = theme.useToken();
//   const items = useRef<Array<MenuItem>>([]);

//   const initItems = (loggedUser: IUser) => {
//     items.current = [
//       // getItem('Mapa', paths.map.root, false, icons.map),
//       // getItem(
//       //   'Conductores',
//       //   paths.drivers.root,
//       //   !validatePermissionName(
//       //     PermissionsEnum.GestionarEstado,
//       //     loggedUser.role.permissions,
//       //     loggedUser.role.name
//       //   ),
//       //   <CarOutlined />
//       // ),
//       // getItem(
//       //   'Tarifas',
//       //   paths.fee.root,
//       //   !validatePermissionName(
//       //     PermissionsEnum.GestionarTarifas,
//       //     loggedUser.role.permissions,
//       //     loggedUser.role.name
//       //   ),
//       //   <CreditCardOutlined />
//       // ),
//       // getItem(
//       //   'Facturas',
//       //   paths.invoices.root,
//       //   !validatePermissionName(
//       //     PermissionsEnum.GestionarEstado,
//       //     loggedUser.role.permissions,
//       //     loggedUser.role.name
//       //   ),
//       //   <ContainerOutlined />
//       // ),
//       // getItem(
//       //   'Reportes',
//       //   paths.report.root,
//       //   !validatePermissionName(
//       //     PermissionsEnum.GestionarConfiguracionesGenerales,
//       //     loggedUser.role.permissions,
//       //     loggedUser.role.name
//       //   ),
//       //   <FileDoneOutlined />
//       // ),
//       // getItem(
//       //   'Chat',
//       //   paths.chat.root,
//       //   !validatePermissionName(
//       //     PermissionsEnum.VerChat,
//       //     loggedUser.role.permissions,
//       //     loggedUser.role.name
//       //   ),
//       //   <WechatOutlined />
//       // ),
//       // getItem(
//       //   'Configuraciones',
//       //   'configuraciones/generales',
//       //   !validatePermissionName(
//       //     PermissionsEnum.GestionarConfiguracionesGenerales,
//       //     loggedUser.role.permissions,
//       //     loggedUser.role.name
//       //   ),
//       //   <SettingOutlined />,
//       //   [
//       //     getItem(
//       //       'Configuraciones generales',
//       //       paths.general_data.root,
//       //       false,
//       //       <RiseOutlined />,
//       //       undefined
//       //     ),
//       //     getItem(
//       //       'Sobre El Metro',
//       //       paths.metro_data.root,
//       //       false,
//       //       <QuestionCircleOutlined />,
//       //       [
//       //         getItem(
//       //           'Datos del metro',
//       //           paths.metro_data.root,
//       //           false,
//       //           <DesktopOutlined />,
//       //           undefined
//       //         ),
//       //         getItem(
//       //           'Cómo funciona (Clientes ES)',
//       //           paths.how_it_works.config.clients.es,
//       //           false,
//       //           <InfoCircleOutlined />,
//       //           undefined
//       //         ),
//       //         getItem(
//       //           'Cómo funciona (Clientes EN)',
//       //           paths.how_it_works.config.clients.en,
//       //           false,
//       //           <InfoCircleOutlined />,
//       //           undefined
//       //         ),
//       //         getItem(
//       //           'Cómo funciona (Funcionario)',
//       //           paths.how_it_works.config.officials.es,
//       //           false,
//       //           <InfoCircleOutlined />,
//       //           undefined
//       //         ),
//       //         getItem(
//       //           'Cómo funciona (Conductores)',
//       //           paths.how_it_works.config.drivers.es,
//       //           false,
//       //           <InfoCircleOutlined />,
//       //           undefined
//       //         ),
//       //       ]
//       //     ),
//       //   ]
//       // ),
//       getItem(
//         'Usuarios',
//         '/pages/users',
//         !validatePermissionName(
//           PermissionsEnum.GestionarUsuarios,
//           loggedUser.role.permissions,
//           loggedUser.role.name
//         ),
//         <UserOutlined />
//       ),
//       getItem(
//         'Roles y permisos',
//         '/pages/roles',
//         !validatePermissionName(
//           PermissionsEnum.GestionarRolesPermisos,
//           loggedUser.role.permissions,
//           loggedUser.role.name
//         ),
//         <SafetyCertificateOutlined />
//       ),
//     ];
//   };

//   useEffect(() => {
//     // getUserFromLocalStorage();
//     // setLoading(true);
//     dispatch(getLoggedUser(undefined))
//       .unwrap()
//       .then((res) => {
//         initItems(res);
//         setUser(res);
//         setLoading(false);
//       })
//       .catch((err) => {
//         setLoading(false);
//         // router.push('/auth/login');
//       });
//   }, []);

//   const onClick: MenuProps['onClick'] = (e) => {
//     if (e.key == '/auth/login') {
//       localStorage.clear();
//     }
//     router.push(e.key);
//   };

//   return loading ? (
//     <Space
//       size='middle'
//       style={{ minHeight: '98vh', width: '98vw', justifyContent: 'center' }}
//     >
//       <Spin size='large' />
//     </Space>
//   ) : (
//     <Layout style={{ minHeight: '100vh' }} color='primary'>
//       <Sider
//         width={'20.5rem'}
//         collapsible
//         collapsed={collapsed}
//         // width={'15rem'}
//         onCollapse={(value) => setCollapsed(value)}
//       >
//         <div
//           style={{
//             height: 32,
//             margin: 16,
//             background: 'rgba(255, 255, 255, 0.2)',
//           }}
//         />
//         <Menu
//           style={{backgroundColor: colors.colorPrimary}}
//           defaultSelectedKeys={[pathname]}
//           mode='inline'
//           items={items.current}
//           onClick={onClick}
//         />
//       </Sider>
//       <Layout className='site-layout'>
//         <Header
//           style={{
//             padding: 0,
//             background: colorBgContainer,
//           }}
//         >
//           <Row justify={'end'} gutter={8}>
//             {/* <Col>
//               <Dropdown
//                 menu={{ items: infoMenuItems, onClick }}
//                 placement='bottomRight'
//                 arrow
//               >
//                 <Button icon={<InfoCircleOutlined />} type='link'>
//                 </Button>
//               </Dropdown>
//             </Col> */}
//             <Col style={{ marginRight: 20 }}>
//               <Dropdown
//                 menu={{ items: userMenuItems, onClick }}
//                 placement='bottomRight'
//                 arrow
//               >
//                 <Button icon={<UserOutlined />}>
//                   {(user && user.username) || 'Develop'}
//                 </Button>
//               </Dropdown>
//             </Col>
//           </Row>
//         </Header>
//         <Content style={{ margin: '0 16px' }}>
//           <Card style={{ marginTop: 10 }}>{children}</Card>
//         </Content>
//         <Footer style={{ textAlign: 'center' }}>
//           El Metro©{new Date().getFullYear()}
//         </Footer>
//       </Layout>
//     </Layout>
//   );
// };
// export default MainLayout;

'use client';
import {
  Button,
  Card,
  Col,
  Dropdown,
  Layout,
  Menu,
  MenuProps,
  Row,
  Switch,
  Image,
  theme as antdTheme,
} from 'antd';
import {
  DesktopOutlined,
  FileOutlined,
  PieChartOutlined,
  TeamOutlined,
  UserOutlined,
  LogoutOutlined,
  MoonOutlined,
  SunOutlined,
} from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { setTheme } from '../store/settings/settingsSlice';
import { useEffect, useState } from 'react';

const { Sider, Content, Footer, Header } = Layout;
type MenuItem = Required<MenuProps>['items'][number];

const userMenuItems: MenuItem[] = [
  getItem('Salir', '/auth/login', false, <LogoutOutlined />),
  // getItem('Campañas y creatividades', '/pages/campaigns', <FundViewOutlined />),
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
  const dispatch = useAppDispatch();
  const theme = useAppSelector((state) => state.settings.theme);
  const [collapsed, setCollapsed] = useState(false);
  const { token } = antdTheme.useToken();
  const items: MenuItem[] = [
    getItem('Option 1', '1', false, <PieChartOutlined />),
    getItem('Option 2', '2', false, <DesktopOutlined />),
    getItem('User', 'sub1', false, <UserOutlined />, [
      getItem('Tom', '3'),
      getItem('Bill', '4'),
      getItem('Alex', '5'),
    ]),
    getItem('Team', 'sub2', false, <TeamOutlined />, [
      getItem('Team 1', '6'),
      getItem('Team 2', '8'),
    ]),
    getItem('Files', '9', false, <FileOutlined />),
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
        collapsed={collapsed}
        onCollapse={setCollapsed}
      >
        {!collapsed ? (
          <Image
            alt='Logo'
            src='/img/logo.png'
            height={70}
            style={{ marginLeft: 10 }}
            preview={false}
          />
        ) : (
          <Image
            alt='Logo'
            src='/img/logo-collapsed.png'
            height={30}
            style={{ marginLeft: 10 }}
            preview={false}
          />
        )}

        <Menu
          defaultSelectedKeys={['1']}
          mode='inline'
          items={items}
          style={{ marginTop: 20, fontWeight: 700 }}
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
                checked={theme === 'dark'}
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
                <Button icon={<UserOutlined />} danger>{'Develop'}</Button>
              </Dropdown>
            </Col>
          </Row>
        </Header>
        <Content style={{ margin: '0 16px' }}>
          <Card style={{ marginTop: 10 }}>{children}</Card>
        </Content>
        <Footer style={{ textAlign: 'center' }}>
          El Metro©{new Date().getFullYear()}
        </Footer>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
