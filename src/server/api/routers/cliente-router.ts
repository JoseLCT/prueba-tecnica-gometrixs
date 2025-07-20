import { z } from "zod";

import { TRPCError } from "@trpc/server";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { clienteSchema } from "../schemas/cliente-schema";

export const clienteRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    return ctx.db.cliente.findMany();
  }),

  getById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      const cliente = await ctx.db.cliente.findUnique({
        where: { id: input.id },
      });

      if (!cliente) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Cliente no encontrado",
        });
      }

      return cliente;
    }),

  create: publicProcedure
    .input(clienteSchema)
    .mutation(async ({ ctx, input }) => {
      const conflictos = await ctx.db.cliente.findMany({
        where: {
          OR: [
            { correo: input.correo },
            { carnetIdentidad: input.carnetIdentidad },
            { nit: input.nit },
          ],
        },
      });

      if (conflictos.length > 0) {
        const errores: Record<string, string> = {};

        conflictos.forEach((c) => {
          if (c.correo === input.correo)
            errores.correo = "Correo ya registrado";
          if (c.carnetIdentidad === input.carnetIdentidad)
            errores.carnetIdentidad = "Carnet ya registrado";
          if (c.nit === input.nit) errores.nit = "NIT ya registrado";
        });

        const message = Object.values(errores).join(", ");

        throw new TRPCError({
          code: "CONFLICT",
          message: message ?? "Campos duplicados",
        });
      }

      return ctx.db.cliente.create({
        data: input,
      });
    }),

  update: publicProcedure
    .input(z.object({ id: z.number(), data: clienteSchema.partial() }))
    .mutation(async ({ ctx, input }) => {
      const cliente = await ctx.db.cliente.findUnique({
        where: { id: input.id },
      });

      if (!cliente) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Cliente no encontrado",
        });
      }

      const conflictos = await ctx.db.cliente.findMany({
        where: {
          OR: [
            { correo: input.data.correo, id: { not: input.id } },
            {
              carnetIdentidad: input.data.carnetIdentidad,
              id: { not: input.id },
            },
            { nit: input.data.nit, id: { not: input.id } },
          ],
        },
      });

      if (conflictos.length > 0) {
        const errores: Record<string, string> = {};

        conflictos.forEach((c) => {
          if (c.correo === input.data.correo)
            errores.correo = "Correo ya registrado";
          if (c.carnetIdentidad === input.data.carnetIdentidad)
            errores.carnetIdentidad = "Carnet ya registrado";
          if (c.nit === input.data.nit) errores.nit = "NIT ya registrado";
        });

        const message = Object.values(errores).join(", ");

        throw new TRPCError({
          code: "CONFLICT",
          message: message ?? "Campos duplicados",
        });
      }

      return ctx.db.cliente.update({
        where: { id: input.id },
        data: input.data,
      });
    }),

  delete: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const cliente = await ctx.db.cliente.findUnique({
        where: { id: input.id },
      });

      if (!cliente) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Cliente no encontrado",
        });
      }

      const ventas = await ctx.db.venta.findMany({
        where: { clienteId: input.id },
      });

      if (ventas.length > 0) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "No se puede eliminar un cliente con ventas asociadas",
        });
      }

      return ctx.db.cliente.delete({
        where: { id: input.id },
      });
    }),
});
