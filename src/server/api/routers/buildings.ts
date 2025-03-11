import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const buildingsRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    const meterReading = await ctx.db.building.findMany({
      orderBy: { id: "asc" },
    });

    return meterReading ?? null;
  }),
});
