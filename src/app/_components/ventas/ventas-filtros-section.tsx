import { ClearOutlined } from "@ant-design/icons";
import type { Cliente, Producto } from "@prisma/client";
import { Button, Select, Tooltip } from "antd";
import { useVentas } from "~/app/_providers/ventas-provider";
import { api } from "~/trpc/react";

export function VentasFiltrosSection() {
    const { filtros, setFiltros } = useVentas();
    const { data: productos } = api.producto.getAll.useQuery<Producto[]>();
    const { data: clientes } = api.cliente.getAll.useQuery<Cliente[]>();

    return (
        <div className="flex gap-5">
            <Select
                className="w-60"
                mode="multiple"
                allowClear
                placeholder="Seleccionar productos"
                options={productos?.map(producto => ({
                    label: producto.nombre,
                    value: producto.id
                }))}
                onChange={(values) => setFiltros({ ...filtros, productosIds: values })}
                value={filtros.productosIds ?? []}
            />
            <Select
                className="w-60"
                mode="multiple"
                allowClear
                placeholder="Seleccionar clientes"
                options={clientes?.map(cliente => ({
                    label: cliente.nombre,
                    value: cliente.id
                }))}
                onChange={(values) => setFiltros({ ...filtros, clientesIds: values })}
                value={filtros.clientesIds ?? []}
            />
            <Tooltip title="Limpiar Filtros">
                <Button
                    type="primary"
                    onClick={() => setFiltros({})}
                    className="ml-auto"
                    icon={<ClearOutlined />}
                />
            </Tooltip>
        </div>
    );
}