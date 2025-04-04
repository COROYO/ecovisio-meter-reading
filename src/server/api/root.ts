import { meterRouter } from "~/server/api/routers/meter";
import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";
import { buildingsRouter } from "./routers/buildings";
import { customerRouter } from "./routers/customer";
import { purchasesRouter } from "./routers/purchases";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  meter: meterRouter,
  building: buildingsRouter,
  customer: customerRouter,
  purchase: purchasesRouter,
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
