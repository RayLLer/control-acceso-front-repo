'use client';
import { Modal, notification, Upload } from 'antd';
import React, { FC, useState } from 'react';

import { InboxOutlined } from '@ant-design/icons';
import { RcFile } from 'antd/es/upload';
import { uploadQuestions, uploadService } from '@/app/services/upload.service';

type Props = {
  open: boolean;
  onClose: () => void;
};

const UploadModal: FC<Props> = ({ open, onClose }) => {
  const [file, setFile] = useState<any>();

  const handleUpload = async (file: any) => {
    console.log(file[0]);
    try {
      await uploadQuestions(file[0]);
      notification.success({
        message: 'Archivo subido',
        description: 'El archivo fue subido correctamente',
      });
      onClose();
    } catch (error) {
      notification.error({
        message: 'Error al subir archivo',
        description: 'Ocurrió un error al subir el archivo',
      });
    }
  };

  return (
    <Modal
      title='Subir preguntas'
      open={open}
      destroyOnClose
      onOk={() => handleUpload(file)}
      onCancel={() => {
        setFile(undefined);
        onClose();
      }}
      okButtonProps={{ disabled: !file || !file?.length }}
    >
      <Upload.Dragger
        maxCount={1}
        beforeUpload={() => false}
        accept='.xlsx, .xls'
        onChange={(e) => {
          console.log(e)
          if (Array.isArray(e)) {
            setFile(e);
            return;
          }
          setFile(() => e?.fileList);
        }}
      >
        <p className='ant-upload-drag-icon'>
          <InboxOutlined />
        </p>
        <p className='ant-upload-text'>Click o arrastrar archivo para subir</p>
      </Upload.Dragger>
    </Modal>
  );
};

export default UploadModal;
