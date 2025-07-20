import { useRouter } from "next/navigation";
import { api } from "~/trpc/react";
import { useMessage } from "../_providers/message-provider";
import type { ClienteFormValues } from "../_types/cliente.types";

interface Props {
  id: number | null;
}

export const useClienteForm = ({ id }: Props) => {
  const router = useRouter();
  const messageApi = useMessage();
  const utils = api.useUtils();

  const clienteQuery = api.cliente.getById.useQuery(
    { id: id! },
    {
      enabled: !!id,
      staleTime: 0,
      refetchOnMount: true,
    },
  );

  const createMutation = api.cliente.create.useMutation({
    onSuccess: async () => {
      try {
        await utils.cliente.invalidate();
      } catch (error) {
        console.error("Error invalidating cliente cache:", error);
      }

      messageApi.success("Cliente creado exitosamente");
      router.push("/clientes");
    },
    onError: (error) => {
      console.error("Error al crear el cliente:", error);
      messageApi.error(error.message ?? "Ocurrió un error al crear el cliente");
    },
  });

  const updateMutation = api.cliente.update.useMutation({
    onSuccess: async () => {
      try {
        await utils.cliente.invalidate();
      } catch (error) {
        console.error("Error invalidating cliente cache:", error);
      }

      messageApi.success("Cliente actualizado exitosamente");
      router.push("/clientes");
    },
    onError: (error) => {
      console.error("Error al actualizar el cliente:", error);
      messageApi.error(error.message ?? "Ocurrió un error al actualizar el cliente");
    },
  });

  const handleSubmit = (values: ClienteFormValues) => {
    if (id) {
      updateMutation.mutate({ id, data: values });
    } else {
      createMutation.mutate(values);
    }
  };

  const isLoading =
    clienteQuery.isLoading ||
    createMutation.isPending ||
    updateMutation.isPending;

  return {
    clienteQuery,
    handleSubmit,
    isLoading,
    isEditing: !!id,
  };
};
