import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const meterRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

  /* create: publicProcedure
    .input(z.object({ name: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.post.create({
        data: {
          name: input.name,
        },
      });
    }), */

  getLatest: publicProcedure.query(async ({ ctx }) => {
    const meterReading = await ctx.db.meterReading.findFirst({
      orderBy: { readingDate: "desc" },
    });

    return meterReading ?? null;
  }),

  getAll: publicProcedure.query(async ({ ctx }) => {
    const meterReading = await ctx.db.meter.findMany({
      include: {
        meterReadings: true,
        building: true,
        component: true,
        customer: true,
        parentMeter: true,
      },
      orderBy: { id: "asc" },
    });

    return meterReading ?? null;
  }),
});
