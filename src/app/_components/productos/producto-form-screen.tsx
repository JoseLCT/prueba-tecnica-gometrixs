"use client";

import { Button, Result, Spin } from "antd";
import { useRouter, useSearchParams } from "next/navigation";
import { useProductoForm } from "~/app/_hooks/useProductoForm";
import { parseIdFromParams } from "~/app/_utils/parse-id";
import { ProductoForm } from "./producto-form";
import { ArrowLeftOutlined } from "@ant-design/icons";

export function ProductoFormScreen() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const id = parseIdFromParams(searchParams.get('id'));

    const {
        productoQuery,
        handleSubmit,
        isLoading,
        isEditing
    } = useProductoForm({ id });

    if (productoQuery.isLoading) {
        return <Spin spinning={productoQuery.isLoading} fullscreen />;
    }

    if (id && !productoQuery.data && !productoQuery.isLoading) {
        return (
            <Result
                status="404"
                title="Producto no encontrado"
                subTitle="El producto que buscas no existe o ha sido eliminado."
                extra={
                    <Button type="primary" onClick={() => router.push("/productos")}>
                        Regresar
                    </Button>
                }
            />
        );
    }

    if (productoQuery.error) {
        return (
            <Result
                status={"error"}
                title="Error al cargar el producto"
                extra={
                    <Button type="primary" onClick={() => router.push("/productos")}>
                        Regresar
                    </Button>
                }
            />
        );
    }

    const initialValues = productoQuery.data ? {
        nombre: productoQuery.data.nombre,
        descripcion: productoQuery.data.descripcion,
        precio: Number(productoQuery.data.precio),
        stock: productoQuery.data.stock,
    } : undefined;

    return (
        <main className="flex flex-col p-5 bg-gray-100 rounded-lg">
            <div className="flex items-center gap-2 mb-5">
                <Button
                    shape="circle"
                    variant="text"
                    color="default"
                    icon={<ArrowLeftOutlined />}
                    onClick={() => router.push("/productos")}
                />
                <h1 className="text-lg font-semibold">
                    {isEditing ? "Editar Producto" : "Agregar Producto"}
                </h1>
            </div>
            <div className="w-full">
                <ProductoForm
                    initialValues={initialValues}
                    onSubmit={handleSubmit}
                    isLoading={isLoading}
                    isEditing={isEditing}
                />
            </div>
        </main>
    );
}