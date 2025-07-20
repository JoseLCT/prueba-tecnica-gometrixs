"use client";

import { ArrowLeftOutlined } from "@ant-design/icons";
import { Button, Divider } from "antd";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useVentaForm } from "~/app/_hooks/useVentaForm";
import type { DetalleVentaFormValues, VentaFormValues } from "~/app/_types/venta.types";
import { VentaFormClientesTable } from "./venta-form-clientes-table";
import { VentaFormProductosTable } from "./venta-form-productos-table";
import { useMessage } from "~/app/_providers/message-provider";

export function VentaFormScreen() {
    const router = useRouter();
    const messageApi = useMessage();
    const { handleSubmit, isLoading } = useVentaForm();
    const [clienteId, setClienteId] = useState<number | null>(null);
    const [detalles, setDetalles] = useState<DetalleVentaFormValues[]>([]);

    const onSubmit = () => {
        if (!clienteId ) {
            messageApi.error("Debes seleccionar un cliente para la venta");
            return;
        }

        if (detalles.length === 0) {
            messageApi.error("Debes agregar al menos un producto a la venta");
            return;
        }
        
        const data : VentaFormValues = {
            clienteId,
            detalles
        };
        handleSubmit(data);
    };

    return (
        <main className="flex flex-col p-5 bg-gray-100 rounded-lg">
            <div className="flex items-center gap-2">
                <Button
                    shape="circle"
                    variant="text"
                    color="default"
                    icon={<ArrowLeftOutlined />}
                    onClick={() => router.push("/ventas")}
                />
                <h1 className="text-lg font-semibold">
                    Crear Venta
                </h1>
            </div>
            <Divider />
            <VentaFormClientesTable
                clienteId={clienteId}
                setClienteId={setClienteId}
            />
            <Divider />
            <VentaFormProductosTable
                detalles={detalles}
                setDetalles={setDetalles}
            />
            <Divider />
            <div className="flex justify-end mt-5">
                <Button
                    type="primary"
                    loading={isLoading}
                    onClick={onSubmit}
                >
                    Guardar Venta
                </Button>
            </div>
        </main>
    );
}