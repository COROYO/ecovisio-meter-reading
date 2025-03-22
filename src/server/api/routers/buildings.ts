import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const buildingsRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    const buildings = await ctx.db.building.findMany({
      orderBy: { id: "asc" },
    });

    return buildings ?? null;
  }),
});
