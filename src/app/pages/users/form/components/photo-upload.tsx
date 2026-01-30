"use client";
import React, { useEffect, useState } from "react";
import { Button, Upload, Image, Popconfirm, notification, Spin } from "antd";
import { UploadOutlined, DeleteOutlined } from "@ant-design/icons";
import { uploadService, deleteUpload } from "@/app/services/upload.service";

interface Props {
  value?: any;
  onChange?: (val: any) => void;
}

const MAX_SIZE_MB = 5;

const PhotoUpload = ({ value, onChange }: Props) => {
  const [fileObj, setFileObj] = useState<any>(value ?? null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    setFileObj(value ?? null);
  }, [value]);

  const getFullUrl = (f: any) => {
    if (!f) return null;
    // If it's an array (Strapi returns arrays for relations), take first element
    if (Array.isArray(f)) {
      f = f[0];
      if (!f) return null;
    }

    // Support Strapi's { data: [...] } shape
    if (f?.data && Array.isArray(f.data)) {
      f = f.data[0]?.attributes ?? f.data[0] ?? null;
      if (!f) return null;
    }

    // Guard against strings like 'undefined' or 'null'
    if (typeof f === "string") {
      if (f === "undefined" || f === "null" || f.trim() === "") return null;
      // If it's a path or full url, normalize it
      if (f.startsWith("http")) return f;
      if (f.startsWith("/")) return `${process.env.NEXT_PUBLIC_BASE_URL}${f}`;
      return null;
    }

    // Handle Strapi response shapes: f, f.attributes
    const obj = f?.attributes ?? f;
    const url =
      obj?.url ||
      obj?.formats?.thumbnail?.url ||
      obj?.formats?.small?.url ||
      obj?.formats?.medium?.url;
    if (!url) return null;
    if (url.startsWith("http")) return url;
    return `${process.env.NEXT_PUBLIC_BASE_URL}${url}`;
  };  

  const handleUpload = async (file: File) => {
    if (!file) return;
    if (file.size / 1024 / 1024 > MAX_SIZE_MB) {
      notification.error({ message: `El fichero supera el límite de ${MAX_SIZE_MB}MB` });
      return;
    }
    try {
      setUploading(true);
      const res: any = await uploadService(file);
      const uploaded = res?.data?.[0] ?? res?.data;
      setFileObj(uploaded);
      onChange && onChange(uploaded);
      notification.success({ message: "Foto subida correctamente" });
    } catch (error) {
      notification.error({ message: "Error subiendo la foto" });
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = async () => {
    if (!fileObj) return;
    const id = fileObj.id;
    try {
      if (id) {
        await deleteUpload(id);
      }
      setFileObj(null);
      onChange && onChange(null);
      notification.success({ message: "Foto eliminada" });
    } catch (error) {
      notification.error({ message: "Error al eliminar la foto" });
    }
  };

  const src = getFullUrl(fileObj);
  return (
    <div>
      {src ? (
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Image src={src} width={100} height={100} alt="Foto usuario" />
          <div>
            <Popconfirm title="¿Eliminar foto?" onConfirm={handleRemove} okText="Sí" cancelText="No">
              <Button danger icon={<DeleteOutlined />}>Eliminar</Button>
            </Popconfirm>
          </div>
        </div>
      ) : (
        <div>
          <Upload
            showUploadList={false}
            beforeUpload={(f) => {
              // prevent auto upload
              handleUpload(f as File);
              return false;
            }}
            accept="image/*"
          >
            <Button icon={<UploadOutlined />} loading={uploading}>Agregar foto</Button>
          </Upload>
        </div>
      )}
    </div>
  );
};

export default PhotoUpload;
