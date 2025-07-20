import z from "zod";

export const clienteSchema = z.object({
  nombre: z.string().min(1).max(100),
  apellidoPaterno: z.string().min(1).max(100),
  apellidoMaterno: z.string().min(1).max(100),
  carnetIdentidad: z.string().min(1).max(20),
  correo: z.string().email().max(100),
  numeroTelefono: z.string().min(5).max(15),
  nit: z.string().min(1).max(20),
  fechaNacimiento: z.coerce.date(),
  paisNacimiento: z.string().min(1).max(50),
});
