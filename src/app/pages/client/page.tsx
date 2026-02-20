"use client";
import React, { useEffect, useState } from "react";
import { Spin, Modal, Button } from "antd";
import secureStorage from "react-secure-storage";
import { userService } from "@/app/pages/users/users.service";
import { promoServices } from '@/app/services/promos.service';
import { sources } from "@/utils/sources";
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
  const payments = user?.pagos ?? user?.payments ?? user?.pagos?.data ?? user?.payments?.data ?? null;
  if (Array.isArray(payments) && payments.length > 0) {
    const p = payments[0];
    const attrs = p?.attributes ?? p;
    return attrs?.createdAt ?? attrs?.fecha ?? attrs?.date ?? null;
  }
  return null;
};

const isPaidCurrentPeriod = (lastPaymentRaw: string | null) => {
  if (!lastPaymentRaw) return false;
  const maybe = String(lastPaymentRaw).trim();
  const now = new Date();
  if (/^\d{4}-\d{2}$/.test(maybe)) {
    const [y, m] = maybe.split("-");
    return Number(y) === now.getFullYear() && Number(m) - 1 === now.getMonth();
  }
  if (/^\d{4}-\d{2}-\d{2}/.test(maybe)) {
    const d = new Date(maybe);
    if (isNaN(d.getTime())) return false;
    return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
  }
  const parsed = new Date(maybe);
  if (!isNaN(parsed.getTime())) {
    return parsed.getFullYear() === now.getFullYear() && parsed.getMonth() === now.getMonth();
  }
  return false;
};

const ClientPage: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [qrGenerating, setQrGenerating] = useState(false);
  const [promoText, setPromoText] = useState<string>('');
  const [promoVisible, setPromoVisible] = useState<boolean>(false);
  const [promoLoading, setPromoLoading] = useState<boolean>(false);

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
        console.debug("Fetched promo response:", resp);
        //const body = resp?.data ?? resp;
        // Normalize several possible shapes:
        // { data: { texto: '...' }, meta: {} }
        // { data: { attributes: { texto: '...' } } }
        // or already the object with texto
        console.debug("Normalized promo body:", resp?.data);
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

  if (!user) {
    return (
      <div className={styles.container}>
        <div className={styles.content}>Cargando...</div>
      </div>
    );
  }

  const fullName = `${user?.nombreApellidos || ""}`.trim();
  const lastPayment = resolveLastPayment(user);
  const paid = isPaidCurrentPeriod(lastPayment);
  const photo = resolvePhoto(user);

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
