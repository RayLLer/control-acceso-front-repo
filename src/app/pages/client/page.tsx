"use client";
import React, { useEffect, useState } from "react";
import { Spin, Modal, Button } from "antd";
import secureStorage from "react-secure-storage";
import { userService } from "@/app/pages/users/users.service";
import { promoServices } from '@/app/services/promos.service';
import { sources } from "@/utils/sources";
import { isPeriodActive } from "@/utils/payment-period";
import styles from "./page.module.css";
import { IUserPlane } from "@/app/pages/users/users.interface";

const resolveIdentification = (user: any) => {
  return (
    user?.numeroIdentificacion || user?.documentId || user?.documento || user?.username || String(user?.id || "")
  );
};

const getUserImage = (u: any) => {
    if (!u) return null;
    const foto = u?.foto ?? null;
    if (!foto) return null;
    const f = Array.isArray(foto) ? foto[0] : foto;
    const obj = f?.data?.attributes ?? f?.attributes ?? f;
    const url = obj?.formats?.thumbnail?.url || obj?.formats?.small?.url || obj?.formats?.medium?.url || obj?.url;
    if (!url) return null;
    return url.startsWith("http") ? url : `${process.env.NEXT_PUBLIC_BASE_URL}${url}`;
  };



const resolvePhoto = (user: any) => {
  const src = getUserImage(user);
  return src || "/img/default-user.png";
};

const resolveLastPayment = (user: any) => {
  const raw = user?.ultimoPeriodoPago ?? user?.ultimo_periodo_pago ?? user?.periodo_pagado ?? null;
  
  if (raw) return raw;
  
  return null;
};

const parseDateString = (value: string) => {
  const trimmed = String(value).trim();
  const isoMatch = /^([0-9]{4})-([0-9]{2})-([0-9]{2})$/.exec(trimmed);
  if (isoMatch) {
    return new Date(Number(isoMatch[1]), Number(isoMatch[2]) - 1, Number(isoMatch[3]));
  }
  const dmyMatch = /^([0-9]{2})[\/\-]([0-9]{2})[\/\-]([0-9]{4})$/.exec(trimmed);
  if (dmyMatch) {
    return new Date(Number(dmyMatch[3]), Number(dmyMatch[2]) - 1, Number(dmyMatch[1]));
  }
  const parsed = new Date(trimmed);
  return isNaN(parsed.getTime()) ? null : parsed;
};

const formatDateForModal = (date: Date) => {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

const isDateInDaysFromNow = (date: Date, days: number) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(date);
  target.setHours(0, 0, 0, 0);
  const diffDays = Math.round((target.getTime() - today.getTime()) / 86400000);
  return diffDays === days;
};

const parsePaymentRangeEndDate = (lastPaymentRaw: string | null) => {
  if (!lastPaymentRaw) return null;
  const maybe = String(lastPaymentRaw).trim();
  const parts = maybe.split("::").map((part) => part.trim()).filter(Boolean);
  if (parts.length < 2) return null;
  return parseDateString(parts[parts.length - 1]);
};

const ClientPage: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [qrGenerating, setQrGenerating] = useState(false);
  const [promoText, setPromoText] = useState<string>('');
  const [promoVisible, setPromoVisible] = useState<boolean>(false);
  const [promoLoading, setPromoLoading] = useState<boolean>(false);
  const [dueVisible, setDueVisible] = useState<boolean>(false);
  const [dueDate, setDueDate] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    const fetchUser = async () => {
      // Try to fetch fresh user data from backend (/users/me)
      try {
        const res = await userService.getLoggedUser(sources.USERS + "/me");
        if (!mounted) return;
        // Strapi may return { data: { id, attributes } } or { id, attributes } or plain attributes
        const raw = res?.data ?? res;
        let u: IUserPlane | null = null;
        if (raw && typeof raw === "object" && "attributes" in raw) {
          // shape: { id, attributes }
          u = { id: (raw as any).id, ...(raw as any).attributes } as IUserPlane;
        } else if (raw && (raw as any).id && ((raw as any).username || (raw as any).email || (raw as any).nombreApellidos)) {
          // already IUserPlane
          u = raw as IUserPlane;
        } else if (raw) {
          // raw looks like attributes only (IUser), coerce into IUserPlane with id fallback
          u = { id: (raw as any).id ?? 0, ...(raw as any) } as IUserPlane;
        }
        setUser(u);
        // store into secureStorage so other code still finds it
        try { secureStorage.setItem("user", JSON.stringify(u)); } catch (e) {}
      } catch (err) {
        // Fallback: try to read from secureStorage once
        const stored = secureStorage.getItem("user");
        if (stored) {
          try {
            const parsed = typeof stored === "string" ? JSON.parse(stored) : stored;
            if (mounted) setUser(parsed);
          } catch (e) {
            if (mounted) setUser(stored);
          }
        }
      }
    };
    fetchUser();
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    let mounted = true;
    const fetchPromo = async () => {
      setPromoLoading(true);
      try {
        const resp = await promoServices.getPromos();
        //const body = resp?.data ?? resp;
        // Normalize several possible shapes:
        // { data: { texto: '...' }, meta: {} }
        // { data: { attributes: { texto: '...' } } }
        // or already the object with texto
        const candidate = resp.data.data;
        const texto = candidate?.texto ?? candidate?.attributes?.texto ?? '';
        const finalText = typeof texto === 'string' ? texto : String(texto ?? '');
        if (mounted) {
          setPromoText(finalText);
          if (finalText.trim().length > 0) setPromoVisible(true);
        }
      } catch (e) {
        console.error('Error fetching promo:', e);
        if (mounted) setPromoText('');
      } finally {
        if (mounted) setPromoLoading(false);
      }
    };
    fetchPromo();
    return () => { mounted = false; };
  }, []);

  const identification = resolveIdentification(user);
  useEffect(() => {
    let mounted = true;
    const id = identification;
    if (!id) {
      setQrDataUrl(null);
      return;
    }
    setQrGenerating(true);
    import("qrcode")
      .then((QR) => QR.toDataURL(String(id), { errorCorrectionLevel: "H", width: 300 }))
      .then((dataUrl: string) => {
        if (!mounted) return;
        setQrDataUrl(dataUrl);
      })
      .catch(() => {
        if (!mounted) return;
        setQrDataUrl(null);
      })
      .finally(() => {
        if (!mounted) return;
        setQrGenerating(false);
      });
    return () => {
      mounted = false;
    };
  }, [identification]);

  const fullName = `${user?.nombreApellidos || ""}`.trim();
  const lastPayment = resolveLastPayment(user);
  const paid = isPeriodActive(lastPayment);
  const photo = resolvePhoto(user);

  useEffect(() => {
    const endDate = parsePaymentRangeEndDate(lastPayment);
    if (endDate && isDateInDaysFromNow(endDate, 2)) {
      setDueDate(formatDateForModal(endDate));
      setDueVisible(true);
    } else {
      setDueVisible(false);
      setDueDate(null);
    }
  }, [lastPayment]);

  if (!user) {
    return (
      <div className={styles.container}>
        <div className={styles.content}>Cargando...</div>
      </div>
    );
  }

  return (
    <div className={`${styles.container} ${paid ? styles.paid : styles.unpaid}`}>
      <Modal
        title="Promoción"
        open={promoVisible}
        onCancel={() => setPromoVisible(false)}
        footer={[
          <Button key="close" onClick={() => setPromoVisible(false)}>
            Cerrar
          </Button>,
        ]}
      >
        {promoLoading ? <div style={{ textAlign: 'center' }}><Spin /></div> : (
          <div style={{ whiteSpace: 'pre-wrap' }}>{promoText || 'No hay promociones disponibles.'}</div>
        )}
      </Modal>
      <Modal
        title="Pago próximo"
        open={dueVisible}
        onCancel={() => setDueVisible(false)}
        footer={[
          <Button key="close" onClick={() => setDueVisible(false)}>
            Cerrar
          </Button>,
        ]}
      >
        <div>
          Su pago vence en fecha: {dueDate ?? "-"}
        </div>
      </Modal>
      <div className={styles.card}>
        <img src={photo} alt="Foto" className={styles.photo} />
        {qrGenerating ? (
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Spin />
          </div>
        ) : (
          <img src={qrDataUrl || undefined} alt="QR" className={styles.qr} />
        )}
        <div className={styles.info}>
          <div className={styles.name}>{fullName || "Sin nombre"}</div>
          <div className={styles.ident}>ID: {identification}</div>
          <div className={styles.payment}>Último pago: {lastPayment || "-"}</div>
        </div>
      </div>
    </div>
  );
};

export default ClientPage;
