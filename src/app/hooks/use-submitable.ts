import { Form, FormInstance } from 'antd';
import React, { useEffect, useState } from 'react';

type Props = {
  form: FormInstance;
};

const useSubmitable = ({ form }: Props) => {
  const [submittable, setSubmittable] = useState<boolean>(false);
  const values = Form.useWatch([], form);
  useEffect(() => {
    console.log(values);
    form
      .validateFields({ validateOnly: true })
      .then(() => setSubmittable(true))
      .catch(() => setSubmittable(false));
  }, [form, values]);

  return { submittable, setSubmittable };
};

export default useSubmitable;
