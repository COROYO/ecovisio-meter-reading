import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const customerRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    const customers = await ctx.db.customer.findMany({
      orderBy: { id: "asc" },
    });

    return customers ?? null;
  }),
  addCustomer: publicProcedure
    .input(
      z.object({
        name: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.customer.create({
        data: {
          name: input.name,
        },
      });
    }),
  deleteCustomer: publicProcedure
    .input(
      z.object({
        id: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.customer.delete({
        where: {
          id: input.id,
        },
      });
    }),
});
