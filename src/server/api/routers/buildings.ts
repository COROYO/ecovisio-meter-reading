import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const buildingsRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    const buildings = await ctx.db.building.findMany({
      orderBy: { id: "asc" },
    });

    return buildings ?? null;
  }),
  addBuilding: publicProcedure
    .input(
      z.object({
        name: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.building.create({
        data: {
          name: input.name,
        },
      });
    }),
  deleteBuilding: publicProcedure
    .input(
      z.object({
        id: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.building.delete({
        where: {
          id: input.id,
        },
      });
    }),
});
