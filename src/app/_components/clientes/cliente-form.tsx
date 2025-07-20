import { Button, DatePicker, Form, Input, Select } from "antd";
import dayjs from "dayjs";
import { useCountries } from "~/app/_hooks/useCountries";
import type { ClienteFormValues } from "~/app/_types/cliente.types";
import { ClienteCountryItem } from "./cliente-country-item";

interface Props {
    initialValues?: ClienteFormValues;
    onSubmit: (values: ClienteFormValues) => void;
    isLoading: boolean;
    isEditing: boolean;
}

export const ClienteForm = ({
    initialValues,
    onSubmit,
    isLoading,
    isEditing
}: Props) => {
    const [form] = Form.useForm();
    const { countries, isLoading: isLoadingCountries } = useCountries();

    const formRules = {
        nombre: [{ required: true, message: "El nombre es requerido" }],
        apellidoPaterno: [{ required: true, message: "El apellido paterno es requerido" }],
        apellidoMaterno: [{ required: true, message: "El apellido materno es requerido" }],
        carnetIdentidad: [{ required: true, message: "El carnet de identidad es requerido" }],
        correo: [
            { required: true, message: "El correo es requerido" },
            { type: 'email' as const, message: "El correo debe ser un email válido" }
        ],
        numeroTelefono: [
            { required: true, message: "El número de teléfono es requerido" },
            { pattern: /^\+?\d{7,15}$/, message: "El número de teléfono debe tener entre 7 y 15 dígitos" },
        ],
        nit: [{ required: true, message: "El NIT es requerido" }],
        fechaNacimiento: [
            { required: true, message: "La fecha de nacimiento es requerida" },
            { type: 'date' as const, message: "La fecha de nacimiento debe ser una fecha válida" }
        ],
        paisNacimiento: [{ required: true, message: "El país de nacimiento es requerido" }],
    };

    return (
        <Form
            form={form}
            layout="vertical"
            onFinish={onSubmit}
            initialValues={{
                ...initialValues,
                fechaNacimiento: initialValues?.fechaNacimiento
                    ? dayjs(initialValues.fechaNacimiento)
                    : undefined,
            }}
        >
            <div className="grid grid-cols-3 gap-5">
                <Form.Item
                    label="Nombre"
                    name="nombre"
                    rules={formRules.nombre}
                >
                    <Input placeholder="Ingrese el nombre del cliente" />
                </Form.Item>

                <Form.Item
                    label="Apellido Paterno"
                    name="apellidoPaterno"
                    rules={formRules.apellidoPaterno}
                >
                    <Input placeholder="Ingrese el apellido paterno del cliente" />
                </Form.Item>

                <Form.Item
                    label="Apellido Materno"
                    name="apellidoMaterno"
                    rules={formRules.apellidoMaterno}
                >
                    <Input placeholder="Ingrese el apellido materno del cliente" />
                </Form.Item>
            </div>

            <div className="grid grid-cols-2 gap-5">
                <Form.Item
                    label="Correo Electrónico"
                    name="correo"
                    rules={formRules.correo}
                >
                    <Input placeholder="Ingrese el correo electrónico del cliente" />
                </Form.Item>

                <Form.Item
                    label="Número de Teléfono"
                    name="numeroTelefono"
                    rules={formRules.numeroTelefono}
                >
                    <Input placeholder="Ingrese el número de teléfono del cliente" />
                </Form.Item>
            </div>

            <div className="grid grid-cols-2 gap-5">
                <Form.Item
                    label="Carnet de Identidad"
                    name="carnetIdentidad"
                    rules={formRules.carnetIdentidad}
                >
                    <Input placeholder="Ingrese el carnet de identidad del cliente" />
                </Form.Item>

                <Form.Item
                    label="NIT"
                    name="nit"
                    rules={formRules.nit}
                >
                    <Input placeholder="Ingrese el NIT del cliente" />
                </Form.Item>
            </div>

            <div className="grid grid-cols-2 gap-5">
                <Form.Item
                    label="País de Nacimiento"
                    name="paisNacimiento"
                    rules={formRules.paisNacimiento}
                >
                    <Select
                        placeholder="Seleccione el país de nacimiento"
                        loading={isLoadingCountries}
                        options={countries}
                        optionRender={(option) => <ClienteCountryItem country={option.data} />}
                    />
                </Form.Item>

                <Form.Item
                    label="Fecha de Nacimiento"
                    name="fechaNacimiento"
                    rules={formRules.fechaNacimiento}
                >
                    <DatePicker
                        style={{ width: '100%' }}
                        placeholder="Seleccione la fecha de nacimiento"
                    />
                </Form.Item>
            </div>

            <Form.Item>
                <Button
                    type="primary"
                    htmlType="submit"
                    loading={isLoading}
                >
                    {isEditing ? 'Actualizar' : 'Crear'} Cliente
                </Button>
            </Form.Item>
        </Form>
    );
};