"use client";
import { FC, ReactElement } from "react";

import MagicTable from "@/app/components/table-v2/table-custom";
import { ColumnsType } from "@/app/interfaces/strapi";
import { useRouter } from "next/navigation";
import { Image, Modal, Form, Input, InputNumber, DatePicker, Button, notification, Tag, Descriptions, Table, Spin, Collapse } from "antd";
import { DollarOutlined, EyeOutlined, QrcodeOutlined } from "@ant-design/icons";
import { useState } from "react";
import dayjs from "dayjs";
import { IUser } from "./users.interface";
import { userService } from "./users.service";
import { axiosInstance } from "@/utils/axios";
import axios from "axios";

const User: FC = (): ReactElement => {
  const router = useRouter();

  const [paymentModalVisible, setPaymentModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [submittingPayment, setSubmittingPayment] = useState(false);
  const [form] = Form.useForm();
  const [refetch, setRefetch] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [searchResult, setSearchResult] = useState<any | null>(null);
  const [searchNotFound, setSearchNotFound] = useState(false);

  // Details modal & payments
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);
  const [detailsUser, setDetailsUser] = useState<any>(null);
  const [paymentsLoading, setPaymentsLoading] = useState(false);
  const [payments, setPayments] = useState<any[]>([]);

  // QR modal
  const [qrModalVisible, setQrModalVisible] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [qrGenerating, setQrGenerating] = useState(false);
  const [qrUser, setQrUser] = useState<any>(null);

  const paymentsColumns = [
    
    {
      title: "Monto",
      dataIndex: "monto",
      key: "monto",
      render: (value: any) => (value !== undefined ? Number(value).toFixed(2) : "-"),
    },
    {
      title: "Periodo",
      dataIndex: "periodo_pagado",
      key: "periodo_pagado",
    },
    {
      title: "Fecha",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (value: any) => (value ? dayjs(value).format("YYYY-MM-DD HH:mm") : "-"),
    },
  ];

  const handleDelete = async (id: number) => {
    try {
      const response = await userService.deleteUser(id);
      console.log(response);
      // Return true when backend deletion succeeded so caller knows it's OK.
      if (response && response.status && response.status >= 200 && response.status < 300) {
        return true;
      }
      // Fallback: if response contains data indicating failure, return message
      if (response && response.data && response.data.message) {
        return String(response.data.message);
      }
      return false;
    } catch (error) {
      return axios.isAxiosError(error)
        ? error.response?.data.message
        : "Ha ocurrido un error";
    }
  };

  const columns: ColumnsType<IUser>[] = [
    {
      title: "",
      dataIndex: ["foto"],
      key: "foto",
      width: 80,
      render: (foto: any) => {
        if (!foto) return null;
        // If array, take first element
        const f = Array.isArray(foto) ? foto[0] : foto;
        const obj = f?.data?.attributes ?? f?.attributes ?? f;
        const url = obj?.url || obj?.formats?.thumbnail?.url || obj?.formats?.small?.url || obj?.formats?.medium?.url;
        if (!url || (typeof url === "string" && (url === "undefined" || url === "null" || url.trim() === ""))) return null;
        const src = url.startsWith("http") ? url : `${process.env.NEXT_PUBLIC_BASE_URL}${url}`;
        return src ? <Image src={src} alt="Foto" width={48} height={48} preview={false} /> : null;
      },
    },
    // {
    //   title: "Usuario",
    //   dataIndex: ["username"],
    //   key: "username",
    //   filtrable: true,
    //   filterType: "string",
    // },
    {
      title: "Correo",
      dataIndex: ["email"],
      key: "email",
      filtrable: true,
      filterType: "string",
    },
    {
      title: "Nombre Completo",
      dataIndex: ["nombreApellidos"],
      key: "nombreApellidos",
      filtrable: true,
      filterType: "string",
    },
    {
      title: "Rol",
      dataIndex: ["role", "name"],
      key: "role.name",
      filtrable: true,
      filterType: "string",
    },
    {
      title: "Identificador",
      dataIndex: ["numeroIdentificacion"],
      key: "numeroIdentificacion",
      filtrable: true,
      filterType: "string",
    },
    {
      title: "Último periodo",
      dataIndex: ["ultimoPeriodoPago"],
      key: "ultimoPeriodoPago",
      render: (_: any, record: any) => {
        // posible formas: 'YYYY-MM' o date string
        const raw =
          record?.ultimoPeriodoPago ??
          null;
        if (!raw) return <Tag color="red">Sin pago</Tag>;
        // Obtener string YYYY-MM
        let periodStr = null as string | null;
        if (typeof raw === "string") {
          // si viene como 'YYYY-MM' o 'YYYY-MM-DD'
          const maybe = raw.trim();
          if (/^\d{4}-\d{2}$/.test(maybe)) periodStr = maybe;
          else if (/^\d{4}-\d{2}-\d{2}/.test(maybe)) periodStr = maybe.substring(0, 7);
          else periodStr = maybe; // intentar parsear
        } else if (raw?.id && raw?.attributes?.periodo_pagado) {
          periodStr = raw.attributes.periodo_pagado;
        } else {
          periodStr = null;
        }
        if (!periodStr) return <Tag color="red">Sin pago</Tag>;
        const period = dayjs(periodStr, "YYYY-MM");
        const current = dayjs().startOf("month");
        const isFutureOrCurrent = period.isSame(current, "month") || period.isAfter(current, "month");
        const label = period.format("YYYY-MM");
        return <Tag color={isFutureOrCurrent ? "green" : "red"}>{label}</Tag>;
      },
    },
    // {
    //   title: "Bloqueado",
    //   dataIndex: ["blocked"],
    //   key: "blocked",
    //   render: (blocked: boolean) => (blocked ? "Bloqueado" : "No Bloqueado"),
    // },
    
  ];

  const fetchPaymentsForUser = async (userId: number) => {
    setPaymentsLoading(true);
    try {
      const res = await axiosInstance.get("/pagos", {
        params: {
          populate: "*",
          filters: { users_permissions_user: userId },
          sort: ["createdAt:desc"],
        },
      });
      // Strapi v4 may return data at res.data.data or res.data
      const data = res?.data?.data ?? res?.data ?? [];
      // Normalize array of payments
      const normalized = Array.isArray(data)
        ? data.map((p: any) => (p.attributes ? { id: p.id, ...p.attributes } : p))
        : [];
      setPayments(normalized);
    } catch (error: any) {
      notification.error({ message: "Error cargando pagos" });
    } finally {
      setPaymentsLoading(false);
    }
  };

  const openDetails = async (record: any) => {
    setDetailsUser(record);
    setDetailsModalVisible(true);
    // fetch payments
    await fetchPaymentsForUser(record.id);
  };

  const getModalBgColor = () => {
    if (!detailsUser) return undefined;
    const raw =
      detailsUser?.ultimoPeriodoPago ??
      detailsUser?.ultimo_periodo_pago ??
      detailsUser?.periodo_pagado ??
      null;
    if (!raw) return undefined;
    let periodStr: string | null = null;
    if (typeof raw === "string") {
      const maybe = raw.trim();
      if (/^\d{4}-\d{2}$/.test(maybe)) periodStr = maybe;
      else if (/^\d{4}-\d{2}-\d{2}/.test(maybe)) periodStr = maybe.substring(0, 7);
    } else if (raw?.attributes?.periodo_pagado) {
      periodStr = raw.attributes.periodo_pagado;
    }
    if (!periodStr) return undefined;
    const period = dayjs(periodStr, "YYYY-MM");
    const current = dayjs().startOf("month");
    const isFutureOrCurrent = period.isSame(current, "month") || period.isAfter(current, "month");
    return isFutureOrCurrent ? "#f6ffed" : "#fff1f0";
  };

  const getBgColorForUser = (u: any) => {
    if (!u) return undefined;
    const raw =
      u?.ultimoPeriodoPago ??
      u?.ultimo_periodo_pago ??
      u?.periodo_pagado ??
      null;
    if (!raw) return "#fff1f0";
    let periodStr: string | null = null;
    if (typeof raw === "string") {
      const maybe = raw.trim();
      if (/^\d{4}-\d{2}$/.test(maybe)) periodStr = maybe;
      else if (/^\d{4}-\d{2}-\d{2}/.test(maybe)) periodStr = maybe.substring(0, 7);
    } else if (raw?.attributes?.periodo_pagado) {
      periodStr = raw.attributes.periodo_pagado;
    }
    if (!periodStr) return "#fff1f0";
    const period = dayjs(periodStr, "YYYY-MM");
    const current = dayjs().startOf("month");
    const isFutureOrCurrent = period.isSame(current, "month") || period.isAfter(current, "month");
    return isFutureOrCurrent ? "#f6ffed" : "#fff1f0";
  };

  const searchByIdentifier = async (value?: string) => {
    const v = (value ?? searchValue)?.toString().trim();
    if (!v) return;
    try {
      const res = await axiosInstance.get("/users", {
        params: {
          populate: "*",
          filters: { numeroIdentificacion: v },
        },
      });
      const data = res?.data?.data ?? res?.data ?? [];
      if (Array.isArray(data) && data.length > 0) {
        const first = data[0];
        const u = first?.attributes ? { id: first.id, ...first.attributes } : first;
        setSearchResult(u);
        setSearchNotFound(false);
      } else {
        setSearchResult(null);
        setSearchNotFound(true);
      }
    } catch (err) {
      setSearchResult(null);
      setSearchNotFound(true);
    } finally {
      setSearchValue("");
    }
  };

  const getUserImage = (u: any) => {
    if (!u) return null;
    const foto = u?.foto ?? u?.photo ?? u?.image ?? null;
    if (!foto) return null;
    const f = Array.isArray(foto) ? foto[0] : foto;
    const obj = f?.data?.attributes ?? f?.attributes ?? f;
    const url = obj?.formats?.thumbnail?.url || obj?.formats?.small?.url || obj?.formats?.medium?.url || obj?.url;
    if (!url) return null;
    return url.startsWith("http") ? url : `${process.env.NEXT_PUBLIC_BASE_URL}${url}`;
  };

  const openQrModal = async (record: any) => {
    console.log("openQrModal called", record);
    const value = record?.numeroIdentificacion ?? record?.documentId ?? record?.username;
    if (!value) {
      notification.error({ message: "El usuario no tiene número de identificación" });
      return;
    }
    setQrModalVisible(true);
    setQrUser(record);
    setQrGenerating(true);
    setQrDataUrl(null);
    try {
      console.log("Generating QR for", value);
      const QR = await import('qrcode');
      const dataUrl = await QR.toDataURL(String(value), { errorCorrectionLevel: 'H', width: 512 });
      setQrDataUrl(dataUrl);
    } catch (err) {
      console.error("QR generation error:", err);
      console.error(err);
      notification.error({ message: "No se pudo generar el QR. Instale 'qrcode' (npm i qrcode)" });
    } finally {
      setQrGenerating(false);
    }
  };

  const downloadQr = () => {
    if (!qrDataUrl || !qrUser) return;
    const a = document.createElement('a');
    a.href = qrDataUrl;
    a.download = `${qrUser?.numeroIdentificacion ?? qrUser?.username ?? 'qr'}.png`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  }; 
  const moreActions = [
    {
      icon: <EyeOutlined style={{ fontSize: 18 }} />,
      tooltip: "Ver detalles",
      onClick: (record: any) => openDetails(record),
    },
    {
      icon: <QrcodeOutlined style={{ fontSize: 18 }} />,
      tooltip: "Generar QR",
      onClick: (record: any) => openQrModal(record),
    },
    {
      icon: <DollarOutlined style={{ fontSize: 18 }} />,
      tooltip: "Registrar pago",
      onClick: (record: any) => {
        setSelectedUser(record as IUser);
        // set form defaults
        form.setFieldsValue({
          monto: undefined,
          periodo: dayjs(),
        });
        setPaymentModalVisible(true);
      },
    },
  ];

  const submitPayment = async (values: any) => {
    if (!selectedUser) return;
    try {
      setSubmittingPayment(true);
      const periodo = values.periodo;
      const periodoStr = periodo && periodo.format ? periodo.format("YYYY-MM") : periodo;
      const body = {
        users_permissions_user: selectedUser.id,
        monto: Number(values.monto),
        periodo_pagado: periodoStr,
      };
      const response = await axiosInstance.post("/pagos", { data: body });
      if (response && (response.status === 200 || response.status === 201)) {
        notification.success({ message: "Pago registrado correctamente" });
        setPaymentModalVisible(false);
        setSelectedUser(null);
        setRefetch(true);
      } else {
        const msg = response?.data?.message ?? "Error registrando el pago";
        notification.error({ message: String(msg) });
      }
    } catch (error: any) {
      notification.error({ message: "Error registrando el pago" });
    } finally {
      setSubmittingPayment(false);
    }
  };

  return (
    <>
      <div style={{ marginBottom: 12, width: "100%" }}>
        <Input
          placeholder="Buscar por identificador"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          onPressEnter={(e: any) => searchByIdentifier(e.target.value)}
          autoFocus
          style={{ width: "100%", maxWidth: 300 }}
          allowClear
        />
        {searchResult || searchNotFound ? (
          <div style={{ marginTop: 12 }}>
            {searchResult ? (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 12, alignItems: "center", padding: 12, borderRadius: 6, background: getBgColorForUser(searchResult) }}>
                {getUserImage(searchResult) ? (
                  <Image
                    src={getUserImage(searchResult)}
                    preview={false}
                    alt="Foto"
                    style={{ width: "100%", maxWidth: 200, objectFit: "contain" }}
                  />
                ) : (
                  <div style={{ width: 80, height: 80, background: "#eee" }} />
                )}
                <div style={{ minWidth: 0, flex: 1, fontSize: 17 }}>
                  <div style={{ fontWeight: 600 }}>{searchResult.nombreApellidos ?? searchResult.name ?? "-"}</div>
                  <div>Identificador: {searchResult.numeroIdentificacion ?? searchResult.documentId ?? "-"}</div>
                  <div>Último periodo: {searchResult.ultimoPeriodoPago ?? searchResult.ultimo_periodo_pago ?? searchResult.periodo_pagado ?? "Sin pago"}</div>
                </div>
              </div>
            ) : (
              <div style={{ padding: 12, borderRadius: 6, background: "#fff1f0", color: "#a8071a" }}>
                No existe usuario con identificador buscado
              </div>
            )}
          </div>
        ) : null}
      </div>

      <MagicTable<IUser, IUser>
        columns={columns}
        url={"users"}
        onAdd={() => router.push("/pages/users/form")}
        onEdit={(id) => router.push(`/pages/users/form/${id}`)}
        deleteEntry
        onDelete={handleDelete}
        crud
        moreActions={moreActions}
        refetch={refetch}
        setRefetch={setRefetch}
      />

      <Modal
        title={selectedUser ? `Registrar pago para ${selectedUser.nombreApellidos || selectedUser.username}` : "Registrar pago"}
        open={paymentModalVisible}
        onCancel={() => setPaymentModalVisible(false)}
        onOk={() => form.submit()}
        okButtonProps={{ loading: submittingPayment }}
      >
        <Form form={form} layout="vertical" onFinish={submitPayment}>
          <Form.Item
            name="monto"
            label="Monto"
            rules={[{ required: true, message: "Introduzca el monto" }]}
          >
            <InputNumber style={{ width: "100%" }} min={0} step={0.01} stringMode />
          </Form.Item>
          <Form.Item
            name="periodo"
            label="Periodo pagado"
            rules={[{ required: true, message: "Seleccione mes y año" }]}
          >
            <DatePicker.MonthPicker style={{ width: "100%" }} />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title={detailsUser ? `Detalles de ${detailsUser.nombreApellidos || detailsUser.username}` : "Detalles"}
        open={detailsModalVisible}
        onCancel={() => setDetailsModalVisible(false)}
        footer={null}
        style={{ maxWidth: 800, width: "100%" }}
        bodyStyle={{ backgroundColor: getModalBgColor() }}
      >
        {detailsUser ? (
          <div>
            <Descriptions bordered column={1} size="small">
              <Descriptions.Item label="Foto">
                {getUserImage(detailsUser) ? (
                  <Image
                    src={getUserImage(detailsUser)}
                    preview={false}
                    alt="Foto usuario"
                    style={{ width: "100%", maxWidth: 200, objectFit: "contain" }}
                  />
                ) : (
                  "-"
                )}
              </Descriptions.Item>
              <Descriptions.Item label="Usuario">{detailsUser.username}</Descriptions.Item>
              <Descriptions.Item label="Correo">{detailsUser.email}</Descriptions.Item>
              <Descriptions.Item label="Nombre">{detailsUser.nombreApellidos ?? detailsUser.name}</Descriptions.Item>
              <Descriptions.Item label="Teléfono">{detailsUser.phone}</Descriptions.Item>
              <Descriptions.Item label="Rol">{detailsUser.role?.name ?? (detailsUser.role?.data?.attributes?.name ?? "")}</Descriptions.Item>
              <Descriptions.Item label="Último periodo">{detailsUser.ultimoPeriodoPago ?? detailsUser.ultimo_periodo_pago ?? detailsUser.periodo_pagado ?? "-"}</Descriptions.Item>
            </Descriptions>

            <h3 style={{ marginTop: 16 }}>Historial de pagos</h3>
            <Collapse defaultActiveKey={[]}>
              <Collapse.Panel header={`Historial de pagos (${payments.length})`} key="payments">
                {paymentsLoading ? (
                  <Spin />
                ) : (
                  <Table
                    columns={paymentsColumns}
                    dataSource={payments}
                    rowKey={(r: any) => r.id}
                    pagination={{ pageSize: 5 }}
                    style={{ marginTop: 8 }}
                  />
                )}
              </Collapse.Panel>
            </Collapse>
          </div>
        ) : (
          <Spin />
        )}
      </Modal>

      {/* QR modal rendered at top-level to avoid nesting/z-index issues */}
      <Modal
        title={qrUser ? `QR: ${qrUser.numeroIdentificacion || qrUser.username}` : "QR"}
        open={qrModalVisible}
        onCancel={() => { setQrModalVisible(false); setQrDataUrl(null); setQrUser(null); }}
        footer={[
          <Button key="download" disabled={!qrDataUrl} onClick={downloadQr} loading={qrGenerating}>
            Descargar
          </Button>,
          <Button key="close" onClick={() => { setQrModalVisible(false); setQrDataUrl(null); setQrUser(null); }}>Cerrar</Button>,
        ]}
      >
        {qrGenerating ? (
          <Spin />
        ) : qrDataUrl ? (
          <div style={{ textAlign: "center" }}>
            <img src={qrDataUrl} alt="QR" style={{ width: "100%", maxWidth: 300, height: "auto", objectFit: "contain" }} />
          </div>
        ) : (
          <div>No se generó QR</div>
        )}
      </Modal>
    </>
  );
};

export default User;
