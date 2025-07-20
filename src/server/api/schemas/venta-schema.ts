import z from "zod";
import { detalleVentaSchema } from "./detalle-venta-schema";

export const ventaSchema = z.object({
  clienteId: z.number().int().positive(),
  detalles: z.array(detalleVentaSchema).min(1, "Debe agregar al menos un detalle de venta"),
}).strict();
