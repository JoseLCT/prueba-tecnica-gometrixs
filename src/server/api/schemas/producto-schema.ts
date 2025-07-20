import z from "zod";

export const productoSchema = z.object({
  nombre: z.string().min(2).max(100),
  descripcion: z.string().max(510),
  precio: z.number().min(0),
  stock: z.number().min(0),
});
