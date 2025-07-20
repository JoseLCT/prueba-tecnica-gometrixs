import { useRouter } from "next/navigation";
import { api } from "~/trpc/react";
import { useMessage } from "../_providers/message-provider";
import type { VentaFormValues } from "../_types/venta.types";

export const useVentaForm = () => {
  const router = useRouter();
  const messageApi = useMessage();
  const utils = api.useUtils();

  const createMutation = api.venta.create.useMutation({
    onSuccess: async () => {
      try {
        await utils.venta.invalidate();
        await utils.producto.invalidate();
      } catch (error) {
        console.error("Error invalidating venta cache:", error);
      }

      messageApi.success("Venta creada exitosamente");
      router.push("/ventas");
    },
    onError: (error) => {
      console.error("Error al crear la venta:", error);
      messageApi.error(error.message ?? "Ocurrió un error al crear la venta");
    },
  });

  const handleSubmit = (values: VentaFormValues) => {
    createMutation.mutate(values);
  };

  const isLoading = createMutation.isPending;

  return {
    handleSubmit,
    isLoading,
  };
};
