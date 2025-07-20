import { useRouter } from "next/navigation";
import { api } from "~/trpc/react";
import { useMessage } from "../_providers/message-provider";
import type { ProductoFormValues } from "../_types/producto.types";

interface Props {
  id: number | null;
}

export const useProductoForm = ({ id }: Props) => {
  const router = useRouter();
  const messageApi = useMessage();
  const utils = api.useUtils();

  const productoQuery = api.producto.getById.useQuery(
    { id: id! },
    {
      enabled: !!id,
      staleTime: 0,
      refetchOnMount: true,
    },
  );

  const createMutation = api.producto.create.useMutation({
    onSuccess: async () => {
      try {
        await utils.producto.invalidate();
      } catch (error) {
        console.error("Error invalidating producto cache:", error);
      }

      messageApi.success("Producto creado exitosamente");
      router.push("/productos");
    },
    onError: (error) => {
      console.error("Error al crear el producto:", error);
      messageApi.error("Ocurrió un error al crear el producto");
    },
  });

  const updateMutation = api.producto.update.useMutation({
    onSuccess: async () => {
      try {
        await utils.producto.invalidate();
      } catch (error) {
        console.error("Error invalidating producto cache:", error);
      }

      messageApi.success("Producto actualizado exitosamente");
      router.push("/productos");
    },
    onError: (error) => {
      console.error("Error al actualizar el producto:", error);
      messageApi.error("Ocurrió un error al actualizar el producto");
    },
  });

  const handleSubmit = (values: ProductoFormValues) => {
    if (id) {
      updateMutation.mutate({ id, data: values });
    } else {
      createMutation.mutate(values);
    }
  };

  const isLoading =
    productoQuery.isLoading ||
    createMutation.isPending ||
    updateMutation.isPending;

  return {
    productoQuery,
    handleSubmit,
    isLoading,
    isEditing: !!id,
  };
};
