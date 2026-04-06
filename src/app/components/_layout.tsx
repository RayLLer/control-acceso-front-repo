/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import {
  BugOutlined,
  FileDoneOutlined,
  IdcardOutlined,
  LogoutOutlined,
  QuestionCircleOutlined,
  SafetyCertificateOutlined,
  UnorderedListOutlined,
  UserOutlined,
  SolutionOutlined,
  BulbOutlined,
  EditOutlined
} from "@ant-design/icons";
import {
  Button,
  Divider,
  Card,
  Col,
  Dropdown,
  Image,
  Layout,
  Menu,
  MenuProps,
  Row,
  theme as antdTheme,
} from "antd";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { paths } from "../routes/paths";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { setTheme } from "../store/settings/settingsSlice";
import { PermissionsEnum } from "@/utils/permissions";
import { getLoggedUser } from "../pages/users/users.reducer";
import useValidatePermissions from "@/utils/hooks/use-validate-permissions";
import secureStorage from "react-secure-storage";

const { Sider, Content, Footer, Header } = Layout;
type MenuItem = Required<MenuProps>["items"][number];

const userMenuItems: MenuItem[] = [
  getItem("Salir", "/auth/login", true, <LogoutOutlined />),
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
    return !loggedUser.username
      ? []
      : [
          getItem(
            "Gestión de Clientes",
            "/pages/users",
            validate(PermissionsEnum.GestionarUsuarios),
            <UserOutlined style={{ fontSize: FONT_SIZE }} />
          ),
          getItem(
            "Promociones",
            "/pages/promos",
            validate(PermissionsEnum.GestionarPromociones),
            <SolutionOutlined style={{ fontSize: FONT_SIZE }} />
          ),
          // getItem(
          //   "Gestión de Test",
          //   paths.tests.root,
          //   validate(PermissionsEnum.GestionarTest),
          //   <IdcardOutlined style={{ fontSize: FONT_SIZE }} />
          // ),
          // getItem(
          //   "Gestión de Categorías",
          //   paths.theme_subtheme_block.root,
          //   validate(PermissionsEnum.GestionarCategorias),
          //   <UnorderedListOutlined style={{ fontSize: FONT_SIZE }} />
          // ),
          // getItem(
          //   "Gestión de Preguntas",
          //   paths.questions.root,
          //   validate(PermissionsEnum.GestionarPreguntas),
          //   <QuestionCircleOutlined style={{ fontSize: FONT_SIZE }} />
          // ),
          // getItem(
          //   "Tests Realizados",
          //   paths.realized_tests.root,
          //   validate(PermissionsEnum.VerTestsRealizados),
          //   <FileDoneOutlined style={{ fontSize: FONT_SIZE }} />
          // ),
          // getItem(
          //   "Quejas y Errores",
          //   paths.error_reports.root,
          //   validate(PermissionsEnum.VerReporteDeQuejasYErrores),
          //   <BugOutlined style={{ fontSize: FONT_SIZE }} />
          // ),
          
          // getItem(
          //   "Roles y permisos",
          //   "/pages/roles",
          //   validate(PermissionsEnum.GestionarRolesPermisos),
          //   <SafetyCertificateOutlined style={{ fontSize: FONT_SIZE }} />
          // ),
          
          // getItem(
          //   "Gestión de Tips",
          //   paths.tips.root,
          //   validate(PermissionsEnum.GestionarTips),
          //   <BulbOutlined style={{ fontSize: FONT_SIZE }} />
          // ),
          // getItem(
          //   "Edición de Frase Final",
          //   paths.final_phrase.root,
          //   validate(PermissionsEnum.EditarFrase),
          //   <EditOutlined style={{ fontSize: FONT_SIZE }} />
          // ),
        ];
  }, [loggedUser]);

  useEffect(() => {
    dispatch(getLoggedUser(undefined));
  }, []);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setCollapsed(mobile);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const onClick: MenuProps["onClick"] = (e) => {
    if (e.key == "/auth/login") {
      const keepSign = secureStorage.getItem("keepSign");
      if (keepSign) {
        secureStorage.removeItem("user");
        secureStorage.removeItem("token");
      } else {
        secureStorage.clear();
      }
    }
    router.push(e.key);
  };

  const changeTheme = (value: boolean) => {
    dispatch(setTheme(value ? "dark" : "light"));
  };

  return (
    <Layout style={{ minHeight: "70vh", backgroundColor: token.colorPrimary }}>
      {/* Hide Sider for Cliente users or for client route */}
      {!(loggedUser?.role?.name === "Cliente" || (path || "").includes("/pages/client")) && (
        <Sider
          collapsible
          breakpoint="md"
          collapsedWidth={80}
          style={{ marginTop: 20 }}
          width={250}
          collapsed={collapsed}
          onCollapse={setCollapsed}
        >
          {!collapsed ? (
            <Image
              alt="Logo"
              src="/img/logo.png"
              height={80}
              style={{ marginLeft: 80, width: "50%" }}
              preview={false}
            />
          ) : (
            <Image
              alt="Logo"
              src="/img/logo.png"
              height={35}
              style={{ marginLeft: 20, width: "70%" }}
              preview={false}
            />
          )}

          <Menu
            defaultSelectedKeys={[path]}
            mode="inline"
            items={items}
            style={{ marginTop: 20, fontWeight: 700 }}
            onClick={onClick}
            defaultActiveFirst
          />
        </Sider>
      )}
      <Layout className="site-layout">
        <Header
          style={{
            padding: 0,
          }}
        >
          <Row justify={"end"} gutter={8}>
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
                placement="bottomRight"
                arrow
              >
                <Button icon={<UserOutlined />}>
                  {loggedUser.username ?? "Usuario"}
                </Button>
              </Dropdown>
            </Col>
          </Row>
        </Header>
        <Content style={{ margin: (loggedUser?.role?.name === "Cliente" || (path || "").includes("/pages/client")) ? 0 : "0 16px" }}>
          {loggedUser?.role?.name === "Cliente" || (path || "").includes("/pages/client") ? (
            <div style={{ marginTop: 0 }}>{children}</div>
          ) : (
            <Card style={{ marginTop: 10, minHeight: "80vh" }}>{children}</Card>
          )}
        </Content>
        <Footer style={{ textAlign: "center" }}>
          ProyectoX©{new Date().getFullYear()}
        </Footer>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
