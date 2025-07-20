import z from "zod";

import { Prisma } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { ventaSchema } from "../schemas/venta-schema";

export const ventaRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    return ctx.db.venta.findMany({
      include: {
        Cliente: true,
      },
    });
  }),

  getByFilters: publicProcedure
    .input(
      z.object({
        clientesIds: z.array(z.number()).optional(),
        productosIds: z.array(z.number()).optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { clientesIds, productosIds } = input;

      const where: Prisma.VentaWhereInput = {};
      if (clientesIds && clientesIds.length > 0) {
        where.clienteId = { in: clientesIds };
      }
      if (productosIds && productosIds.length > 0) {
        where.Detalles = {
          some: {
            productoId: { in: productosIds },
          },
        };
      }

      return ctx.db.venta.findMany({
        where,
        include: {
          Cliente: true,
          Detalles: {
            include: {
              Producto: true,
            },
          },
        },
      });
    }),

  getById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      const venta = await ctx.db.venta.findUnique({
        where: { id: input.id },
        include: {
          Cliente: true,
          Detalles: {
            include: {
              Producto: true,
            },
          },
        },
      });

      if (!venta) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Venta no encontrada",
        });
      }

      return venta;
    }),

  create: publicProcedure
    .input(ventaSchema)
    .mutation(async ({ ctx, input }) => {
      const cliente = await ctx.db.cliente.findUnique({
        where: { id: input.clienteId },
      });

      if (!cliente) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Cliente no encontrado",
        });
      }

      const productosIds = input.detalles.map((detalle) => detalle.productoId);
      const productos = await ctx.db.producto.findMany({
        where: { id: { in: productosIds } },
      });

      if (productos.length !== productosIds.length) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Uno o más productos no encontrados",
        });
      }

      const detallesConPrecios = input.detalles.map((detalle) => {
        const producto = productos.find((p) => p.id === detalle.productoId);
        if (!producto) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: `Producto con id ${detalle.productoId} no encontrado`,
          });
        }
        if (producto.stock < detalle.cantidad) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: `No hay suficiente stock para el producto ${producto.nombre}`,
          });
        }

        const precio = producto.precio;
        const subtotal = precio.mul(new Prisma.Decimal(detalle.cantidad));

        return {
          productoId: detalle.productoId,
          cantidad: detalle.cantidad,
          precio,
          subtotal,
          stock: producto.stock,
        };
      });

      const total = detallesConPrecios.reduce(
        (acc, d) => acc.add(d.subtotal),
        new Prisma.Decimal(0),
      );

      await Promise.all(
        detallesConPrecios.map((d) =>
          ctx.db.producto.update({
            where: { id: d.productoId },
            data: { stock: d.stock - d.cantidad },
          }),
        ),
      );

      const ventaCreada = await ctx.db.venta.create({
        data: {
          clienteId: input.clienteId,
          total: total,
          Detalles: {
            create: detallesConPrecios.map((d) => ({
              productoId: d.productoId,
              cantidad: d.cantidad,
              precio: d.precio,
              subtotal: d.subtotal,
            })),
          },
        },
        include: {
          Detalles: true,
        },
      });

      return ventaCreada;
    }),
});
