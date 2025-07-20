import z from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { productoSchema } from "../schemas/producto-schema";
import { TRPCError } from "@trpc/server";

export const productoRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    return ctx.db.producto.findMany();
  }),

  getById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {

      const producto = await ctx.db.producto.findUnique({
        where: { id: input.id },
      });

      if (!producto) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Producto no encontrado",
        });
      }

      return producto;
    }),

  create: publicProcedure
    .input(productoSchema)
    .mutation(async ({ ctx, input }) => {
      return ctx.db.producto.create({
        data: input,
      });
    }),

  update: publicProcedure
    .input(z.object({ id: z.number(), data: productoSchema }))
    .mutation(async ({ ctx, input }) => {
      const producto = await ctx.db.producto.findUnique({
        where: { id: input.id },
      });

      if (!producto) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Producto no encontrado",
        });
      }

      return ctx.db.producto.update({
        where: { id: input.id },
        data: input.data,
      });
    }),

  delete: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const producto = await ctx.db.producto.findUnique({
        where: { id: input.id },
      });

      if (!producto) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Producto no encontrado",
        });
      }

      const ventas = await ctx.db.venta.findMany({
        where: {
          Detalles: {
            some: {
              productoId: input.id,
            },
          },
        },
      });

      if (ventas.length > 0) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "No se puede eliminar un producto con ventas asociadas",
        });
      }

      return ctx.db.producto.delete({
        where: { id: input.id },
      });
    }),
});
