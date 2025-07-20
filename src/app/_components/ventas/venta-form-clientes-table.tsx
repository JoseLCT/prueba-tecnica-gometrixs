import type { Cliente } from "@prisma/client";
import { Table } from "antd";
import { api } from "~/trpc/react";

interface Props {
    clienteId: number | null;
    setClienteId: (id: number | null) => void;
}

export const VentaFormClientesTable = ({
    clienteId,
    setClienteId,
}: Props) => {
    const { data: clientes, isLoading: isLoadingClientes } = api.cliente.getAll.useQuery<Cliente[]>();

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
            title: 'Correo',
            dataIndex: 'correo',
            key: 'correo',
        },
        {
            title: 'Número de Teléfono',
            dataIndex: 'numeroTelefono',
            key: 'telefono',
        },
        {
            title: 'NIT',
            dataIndex: 'nit',
            key: 'nit',
        },
    ];

    return (
        <main className="flex flex-col">
            <div className="flex flex-col items-start mb-5">
                <h1 className="text-lg font-semibold">
                    Clientes
                </h1>
                <p className="text-sm">Lista de clientes disponibles para la venta</p>
            </div>
            <Table<Cliente>
                columns={columns}
                dataSource={clientes}
                loading={isLoadingClientes}
                rowSelection={{
                    type: 'radio',
                    selectedRowKeys: clienteId ? [clienteId] : [],
                    onChange: (selectedRowKeys) => {
                        if (selectedRowKeys.length > 0) {
                            setClienteId(Number(selectedRowKeys[0]));
                        } else {
                            setClienteId(null);
                        }
                    },
                }}
                rowKey="id"
            />
        </main>
    );
};