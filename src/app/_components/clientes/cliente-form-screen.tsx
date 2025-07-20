"use client";

import { ArrowLeftOutlined } from "@ant-design/icons";
import { Button, Result, Spin } from "antd";
import { useRouter, useSearchParams } from "next/navigation";
import { useClienteForm } from "~/app/_hooks/useClienteForm";
import { parseIdFromParams } from "~/app/_utils/parse-id";
import { ClienteForm } from "./cliente-form";

export function ClienteFormScreen() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const id = parseIdFromParams(searchParams.get('id'));

    const {
        clienteQuery,
        handleSubmit,
        isLoading,
        isEditing
    } = useClienteForm({ id });

    if (clienteQuery.isLoading) {
        return <Spin spinning={clienteQuery.isLoading} fullscreen />;
    }

    if (id && !clienteQuery.data && !clienteQuery.isLoading) {
        return (
            <Result
                status="404"
                title="Cliente no encontrado"
                subTitle="El cliente que buscas no existe o ha sido eliminado."
                extra={
                    <Button type="primary" onClick={() => router.push("/clientes")}>
                        Regresar
                    </Button>
                }
            />
        );
    }

    if (clienteQuery.error) {
        return (
            <Result
                status={"error"}
                title="Error al cargar el cliente"
                extra={
                    <Button type="primary" onClick={() => router.push("/clientes")}>
                        Regresar
                    </Button>
                }
            />
        );
    }

    const initialValues = clienteQuery.data ? {
        nombre: clienteQuery.data.nombre,
        apellidoPaterno: clienteQuery.data.apellidoPaterno,
        apellidoMaterno: clienteQuery.data.apellidoMaterno,
        carnetIdentidad: clienteQuery.data.carnetIdentidad,
        correo: clienteQuery.data.correo,
        numeroTelefono: clienteQuery.data.numeroTelefono,
        nit: clienteQuery.data.nit,
        fechaNacimiento: clienteQuery.data.fechaNacimiento,
        paisNacimiento: clienteQuery.data.paisNacimiento,
    } : undefined;

    return (
        <main className="flex flex-col p-5 bg-gray-100 rounded-lg">
            <div className="flex items-center gap-2 mb-5">
                <Button
                    shape="circle"
                    variant="text"
                    color="default"
                    icon={<ArrowLeftOutlined />}
                    onClick={() => router.push("/clientes")}
                />
                <h1 className="text-lg font-semibold">
                    {isEditing ? "Editar Cliente" : "Agregar Cliente"}
                </h1>
            </div>
            <div className="w-full">
                <ClienteForm
                    initialValues={initialValues}
                    onSubmit={handleSubmit}
                    isLoading={isLoading}
                    isEditing={isEditing}
                />
            </div>
        </main>
    );
}