"use client";

import { DeleteOutlined, EditOutlined, PlusOutlined, WarningFilled } from "@ant-design/icons";
import type { Producto } from "@prisma/client";
import { Button, Popconfirm, Table, Tooltip } from "antd";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useMessage } from "~/app/_providers/message-provider";
import { api } from "~/trpc/react";

export function ProductosScreen() {
    const router = useRouter();
    const messageApi = useMessage();
    const { data: productos, isLoading, refetch } = api.producto.getAll.useQuery<Producto[]>();
    const utils = api.useUtils();
    const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);
    const [confirmDelete, setConfirmDelete] = useState(false);

    useEffect(() => {
        void refetch();
    }, [refetch]);

    const deleteProducto = api.producto.delete.useMutation({
        onMutate: () => {
            setConfirmDelete(true);
        },
        onSuccess: async () => {
            await utils.producto.invalidate();
            setDeleteTargetId(null);
            setConfirmDelete(false);
            messageApi.success("Producto eliminado correctamente");
        },
        onError: (error) => {
            setConfirmDelete(false);
            messageApi.error(error.message ?? "Ocurrió un error al eliminar el producto");
        }
    });

    const handleAddProducto = () => {
        router.push("/productos/form");
    }

    const handleEditProducto = (id: number) => {
        router.push(`/productos/form?id=${id}`);
    }

    const handleDeleteProducto = (id: number) => {
        deleteProducto.mutate({ id });
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
            title: 'Acciones',
            key: 'acciones',
            render: (_: unknown, record: Producto) => (
                <div className="flex gap-2">
                    <Tooltip title="Editar">
                        <Button
                            color="primary"
                            variant="filled"
                            icon={<EditOutlined />}
                            onClick={() => handleEditProducto(record.id)}
                        />
                    </Tooltip>
                    <Tooltip title="Eliminar">
                        <Popconfirm
                            title="Eliminar Producto"
                            description="¿Estás seguro de que deseas eliminar este producto?"
                            okText="Sí"
                            cancelText="No"
                            open={deleteTargetId === record.id}
                            okButtonProps={{ loading: confirmDelete }}
                            onConfirm={() => handleDeleteProducto(record.id)}
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
                    Productos
                </h1>
                <Button
                    color="cyan"
                    variant="solid"
                    icon={<PlusOutlined />}
                    onClick={handleAddProducto}
                >
                    Agregar
                </Button>
            </div>
            <Table<Producto>
                columns={columns}
                dataSource={productos}
                loading={isLoading}
                rowKey="id"
            />
        </main>
    );
}