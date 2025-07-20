import type { DetalleVenta, Producto } from "@prisma/client";
import { Table } from "antd";

interface Props {
    detalles: DetalleVenta[];
}

export const VentaDetailProductosTable = ({
    detalles,
}: Props) => {
    const columns = [
        {
            title: 'Producto',
            dataIndex: 'Producto',
            key: 'Producto',
            render: (producto: Producto) => (
                <span>{producto.nombre}</span>
            ),

        },
        {
            title: 'Cantidad',
            dataIndex: 'cantidad',
            key: 'cantidad',
        },
        {
            title: 'Precio',
            dataIndex: 'precio',
            key: 'precio',
        },
        {
            title: 'Subtotal',
            dataIndex: 'subtotal',
            key: 'subtotal',
        },
    ];

    return (
        <Table<DetalleVenta>
            columns={columns}
            dataSource={detalles}
            rowKey="id"
            pagination={false}
        />
    );
};