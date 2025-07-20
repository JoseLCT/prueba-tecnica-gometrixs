import type { Producto } from "@prisma/client";
import { InputNumber, Table } from "antd";
import type { DetalleVentaFormValues } from "~/app/_types/venta.types";
import { api } from "~/trpc/react";

interface Props {
    detalles: DetalleVentaFormValues[];
    setDetalles: (detalles: DetalleVentaFormValues[]) => void;
}

export const VentaFormProductosTable = ({
    detalles,
    setDetalles,
}: Props) => {
    const { data: productos, isLoading: isLoadingProductos } = api.producto.getAll.useQuery<Producto[]>();

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Nombre',
            dataIndex: 'nombre',
            key: 'nombre',
        },
        {
            title: 'Precio',
            dataIndex: 'precio',
            key: 'precio',
        },
        {
            title: 'Stock',
            dataIndex: 'stock',
            key: 'stock',
        },
        {
            title: 'Cantidad',
            key: 'cantidad',
            render: (_: unknown, record: Producto) => {
                const detalle = detalles.find(d => d.productoId === record.id);
                return (
                    <InputNumber
                        min={0}
                        max={record.stock}
                        defaultValue={detalle?.cantidad ?? 0}
                        disabled={record.stock === 0}
                        onChange={(value) => {
                            if (detalle) {
                                if (value === null || value === 0) {
                                    setDetalles(detalles.filter(d => d.productoId !== record.id));
                                } else {
                                    setDetalles(detalles.map(d => d.productoId === record.id ? { ...d, cantidad: value } : d));
                                }
                            } else {
                                if (value === null || value === 0) return;
                                setDetalles([...detalles, { productoId: record.id, cantidad: value }]);
                            }
                        }}
                    />
                );
            },
        },
    ];

    return (
        <main className="flex flex-col">
            <div className="flex flex-col items-start mb-5">
                <h1 className="text-lg font-semibold">
                    Productos
                </h1>
                <p className="text-sm">Lista de productos disponibles para la venta</p>
            </div>
            <Table<Producto>
                columns={columns}
                dataSource={productos}
                loading={isLoadingProductos}
                rowKey="id"
            />
        </main>
    );
};