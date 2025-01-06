/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { ITipResponse, ITipForm } from "@/app/interfaces/tip";
import { paths } from "@/app/routes/paths";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { tipService } from "@/app/services/tip.service";
import { App, Button, Form, Input } from "antd";
import { questionService } from "@/app/services/question.service";
import useSubmitable from "@/app/hooks/use-submitable";
import { ArrowLeftOutlined } from "@ant-design/icons";

const TipForm = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const { id } = useParams();
    const [tip, setTip] = useState<ITipForm>({
        tipText: "",
    });
    const { notification } = App.useApp();
    const [form] = Form.useForm();
    const { submittable, setSubmittable } = useSubmitable({ form });

    const fetchTip = async () => {
        const response = await tipService.getById(+id)
        form.setFieldValue("tipText", response.data.data.attributes.tipText)
    }

    useEffect(() => {
        if (id) {
            fetchTip();
        }
        return () => {
            form.resetFields();
        };
    }, []);


    const onFinish = async (values: any) => {
        setLoading(true);
        try {
            if (id) {
                await tipService.put(+id, values);
                notification.success({
                        message: "Tip actualizado correctamente",
                        placement: "topRight",
                    });
                setSubmittable(false);    
            } else {
                await tipService.post(values);
                notification.success({
                    message: "Tip creado correctamente",
                    placement: "topRight",
                });   
            }
            router.push(paths.tips.root);
        } catch (error) {
            notification.error({
                message: "Ha ocurrido un error al guardar el tip",
                placement: "topRight",
            });
        } finally {
            setLoading(false);
        }
    } 

    return (
        <Form
            form={form}
            onFinish={onFinish}
            initialValues={tip}
            layout="vertical"
            requiredMark={false}
            autoComplete="off"
        >
            <Button
                type="link"
                color="primary"
                icon={<ArrowLeftOutlined />}
                style={{ marginBottom: 10 }}
                onClick={() => router.push(paths.tips.root)}
            >
                VOLVER
            </Button>
            <Form.Item
                label="Texto del tip"
                name="tipText"
                rules={[
                    {
                        required: true,
                        message: "Debes ingresar el texto del tip",
                    },
                ]}
            >
                <Input />
            </Form.Item>
            <Form.Item>
                <Button type="primary" htmlType="submit" loading={loading}>
                    {id? "Actualizar" : "Crear"}
                </Button>
            </Form.Item>
        </Form>
    )

}

export default TipForm;