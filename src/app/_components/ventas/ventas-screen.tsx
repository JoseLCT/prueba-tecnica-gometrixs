"use client";

import { EyeOutlined, PlusOutlined } from "@ant-design/icons";
import type { Cliente, Venta } from "@prisma/client";
import { Button, Divider, Table, Tooltip } from "antd";
import { type Decimal } from 'decimal.js';
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useVentas } from "~/app/_providers/ventas-provider";
import { api } from "~/trpc/react";
import { VentasFiltrosSection } from "./ventas-filtros-section";

export function VentasScreen() {
    const router = useRouter();
    const { filtros } = useVentas();
    const { data: ventas, isLoading, refetch } = api.venta.getByFilters.useQuery({
        ...filtros
    });

    useEffect(() => {
        void refetch();
    }, [refetch]);

    const handleAddVenta = () => {
        router.push("/ventas/form");
    }

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Cliente',
            dataIndex: 'Cliente',
            key: 'Cliente',
            render: (cliente: Cliente) => cliente ? cliente.nombre : 'N/A',
        },
        {
            title: 'Fecha',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (value: Date) => value ? new Date(value).toLocaleDateString() : '',
        },
        {
            title: 'Total',
            dataIndex: 'total',
            key: 'total',
            render: (value: Decimal) => value ? `$${value.toString()}` : '0.00',
        },
        {
            title: 'Acciones',
            key: 'acciones',
            render: (_: unknown, record: Venta) => (
                <div className="flex gap-2">
                    <Tooltip title="Ver Detalles">
                        <Button
                            color="primary"
                            variant="filled"
                            icon={<EyeOutlined />}
                            onClick={() => router.push(`/ventas/${record.id}`)}
                        />
                    </Tooltip>
                </div>
            ),
        },
    ];

    return (
        <main className="flex flex-col p-5 bg-gray-100 rounded-lg">
            <h1 className="text-lg font-semibold">
                Ventas
            </h1>
            <Divider />
            <div className="flex justify-between mb-10">
                <Button
                    color="cyan"
                    variant="solid"
                    icon={<PlusOutlined />}
                    onClick={handleAddVenta}
                >
                    Agregar
                </Button>
                <VentasFiltrosSection />
            </div>
            <Table<Venta>
                columns={columns}
                dataSource={ventas}
                loading={isLoading}
                rowKey="id"
                pagination={false}
            />
        </main>
    );
}