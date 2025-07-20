"use client";

import { Button, Result, Spin } from "antd";
import { useParams, useRouter } from "next/navigation";
import { parseIdFromParams } from "~/app/_utils/parse-id";
import { api } from "~/trpc/react";
import { VentaDetailProductosTable } from "./venta-detail-productos-table";

export function VentaDetailScreen() {
    const router = useRouter();
    const params = useParams();
    const id = parseIdFromParams(params.id as string | null);
    const { data: venta, isLoading, error } = api.venta.getById.useQuery(
        { id: id! },
        { enabled: !!id }
    );

    if (isLoading) {
        return <Spin spinning={isLoading} fullscreen />;
    }

    if (!venta) {
        return (
            <Result
                status="404"
                title="Venta no encontrada"
                subTitle="La venta que buscas no existe o ha sido eliminada."
                extra={
                    <Button type="primary" onClick={() => router.push("/ventas")}>
                        Regresar
                    </Button>
                }
            />
        );
    }

    if (error) {
        return (
            <Result
                status={"error"}
                title="Error al cargar la venta"
                extra={
                    <Button type="primary" onClick={() => router.push("/ventas")}>
                        Regresar
                    </Button>
                }
            />
        );
    }

    return (
        <main className="flex flex-col p-5 bg-gray-100 rounded-lg">
            <div className="flex flex-col items-center mb-10">
                <h1 className="text-lg font-semibold mb-5">
                    Nota de Venta
                </h1>
                <p>Número nota: {venta.id}</p>
                <p>Fecha nota: {venta.createdAt.toLocaleDateString()}</p>
            </div>
            <VentaDetailProductosTable detalles={venta.Detalles} />
            <div className="mt-10 ml-auto">
                <p>Total nota: {venta.total.toLocaleString()} Bs.</p>
            </div>
        </main>
    );
}