import z from "zod";

export const detalleVentaSchema = z.object({
  productoId: z.number().int().positive(),
  cantidad: z.number().int().positive(),
});