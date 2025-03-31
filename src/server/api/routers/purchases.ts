import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const purchasesRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    const purchases = await ctx.db.purchase.findMany({
      orderBy: { date: "desc" },
      take: 12,
    });

    return purchases ?? null;
  }),

  addPurchase: publicProcedure
    .input(
      z.object({
        invoiceNr: z.number().min(1),
        date: z.date(),
        kwh: z.number().min(1),
        buildingId: z.number().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const purchase = await ctx.db.purchase.create({
        data: {
          invoiceNumber: input.invoiceNr,
          date: input.date,
          kwh: input.kwh,
          buildingId: input.buildingId,
        },
      });

      return purchase;
    }),

  deletePurchase: publicProcedure
    .input(
      z.object({
        id: z.number().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const purchase = await ctx.db.purchase.delete({
        where: {
          id: input.id,
        },
      });

      return purchase;
    }),
});
