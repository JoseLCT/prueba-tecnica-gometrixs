import { Button, Form, Input, InputNumber } from "antd";
import TextArea from "antd/es/input/TextArea";
import type { ProductoFormValues } from "~/app/_types/producto.types";

interface Props {
    initialValues?: ProductoFormValues;
    onSubmit: (values: ProductoFormValues) => void;
    isLoading: boolean;
    isEditing: boolean;
}

export const ProductoForm = ({
    initialValues,
    onSubmit,
    isLoading,
    isEditing
}: Props) => {
    const [form] = Form.useForm();

    const formRules = {
        nombre: [{ required: true, message: "El nombre es requerido" }],
        descripcion: [{ required: true, message: "La descripción es requerida" }],
        precio: [
            { required: true, message: "El precio es requerido" },
            { type: 'number' as const, min: 0, message: "El precio debe ser mayor o igual a 0" }
        ],
        stock: [
            { required: true, message: "El stock es requerido" },
            { type: 'number' as const, min: 0, message: "El stock debe ser mayor o igual a 0" }
        ]
    };

    return (
        <Form
            form={form}
            layout="vertical"
            onFinish={onSubmit}
            initialValues={initialValues}
        >
            <Form.Item
                label="Nombre"
                name="nombre"
                rules={formRules.nombre}
            >
                <Input placeholder="Ingrese el nombre del producto" />
            </Form.Item>

            <Form.Item
                label="Descripción"
                name="descripcion"
                rules={formRules.descripcion}
            >
                <TextArea
                    placeholder="Ingrese la descripción del producto"
                    rows={4}
                />
            </Form.Item>


            <div className="grid grid-cols-2 gap-5">
                <Form.Item
                    label="Precio"
                    name="precio"
                    rules={formRules.precio}
                >
                    <InputNumber
                        min={0}
                        style={{ width: '100%' }}
                        placeholder="0.00"
                        precision={2}
                    />
                </Form.Item>

                <Form.Item
                    label="Stock"
                    name="stock"
                    rules={formRules.stock}
                >
                    <InputNumber
                        min={0}
                        style={{ width: '100%' }}
                        placeholder="0"
                    />
                </Form.Item>
            </div>


            <Form.Item>
                <Button
                    type="primary"
                    htmlType="submit"
                    loading={isLoading}
                >
                    {isEditing ? 'Actualizar' : 'Crear'} Producto
                </Button>
            </Form.Item>
        </Form>
    );
};