import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";
import { clienteRouter } from "./routers/cliente-router";
import { productoRouter } from "./routers/producto-router";
import { ventaRouter } from "./routers/venta-router";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  producto: productoRouter,
  cliente: clienteRouter,
  venta: ventaRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
