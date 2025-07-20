"use client";

import { DeleteOutlined, EditOutlined, PlusOutlined, WarningFilled } from "@ant-design/icons";
import type { Cliente } from "@prisma/client";
import { Button, Popconfirm, Table, Tooltip } from "antd";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useMessage } from "~/app/_providers/message-provider";
import { api } from "~/trpc/react";

export function ClientesScreen() {
    const router = useRouter();
    const messageApi = useMessage();
    const { data: clientes, isLoading, refetch } = api.cliente.getAll.useQuery<Cliente[]>();
    const utils = api.useUtils();
    const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);
    const [confirmDelete, setConfirmDelete] = useState(false);

    useEffect(() => {
        void refetch();
    }, [refetch]);

    const deleteCliente = api.cliente.delete.useMutation({
        onMutate: () => {
            setConfirmDelete(true);
        },
        onSuccess: async () => {
            await utils.cliente.invalidate();
            setDeleteTargetId(null);
            setConfirmDelete(false);
            messageApi.success("Cliente eliminado correctamente");
        },
        onError: (error) => {
            setConfirmDelete(false);
            messageApi.error(error.message ?? "Ocurrió un error al eliminar el cliente");
        }
    });

    const handleAddCliente = () => {
        router.push("/clientes/form");
    }

    const handleEditCliente = (id: number) => {
        router.push(`/clientes/form?id=${id}`);
    }

    const handleDeleteCliente = (id: number) => {
        deleteCliente.mutate({ id });
    }

    const handleCancelDelete = () => {
        setDeleteTargetId(null);
    }

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
        {
            title: 'Acciones',
            key: 'acciones',
            render: (_: unknown, record: Cliente) => (
                <div className="flex gap-2">
                    <Tooltip title="Editar">
                        <Button
                            color="primary"
                            variant="filled"
                            icon={<EditOutlined />}
                            onClick={() => handleEditCliente(record.id)}
                        />
                    </Tooltip>
                    <Tooltip title="Eliminar">
                        <Popconfirm
                            title="Eliminar Cliente"
                            description="¿Estás seguro de que deseas eliminar este cliente?"
                            okText="Sí"
                            cancelText="No"
                            open={deleteTargetId === record.id}
                            okButtonProps={{ loading: confirmDelete }}
                            onConfirm={() => handleDeleteCliente(record.id)}
                            onCancel={handleCancelDelete}
                            icon={<WarningFilled style={{ color: 'red' }} />}
                        >
                            <Button
                                color="danger"
                                variant="filled"
                                icon={<DeleteOutlined />}
                                onClick={() => setDeleteTargetId(record.id)}
                            />
                        </Popconfirm>
                    </Tooltip>
                </div>
            ),
        },
    ];

    return (
        <main className="flex flex-col p-5 bg-gray-100 rounded-lg">
            <div className="flex flex-col items-start gap-5 mb-10">
                <h1 className="text-lg font-semibold">
                    Clientes
                </h1>
                <Button
                    color="cyan"
                    variant="solid"
                    icon={<PlusOutlined />}
                    onClick={handleAddCliente}
                >
                    Agregar
                </Button>
            </div>
            <Table<Cliente>
                columns={columns}
                dataSource={clientes}
                loading={isLoading}
                rowKey="id"
            />
        </main>
    );
}