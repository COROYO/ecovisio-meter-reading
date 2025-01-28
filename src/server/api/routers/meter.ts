import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const meterRouter = createTRPCRouter({
  // example code, don't delete

  /* hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),
 */
  /* create: publicProcedure
    .input(z.object({ name: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.post.create({
        data: {
          name: input.name,
        },
      });
    }), */

  getAll: publicProcedure
    .input(
      z.optional(
        z.object({
          meterReadingsFrom: z.optional(z.date()),
          meterReadingsTo: z.optional(z.date()),
        }),
      ),
    )
    .query(async ({ ctx, input }) => {
      const meterReading = await ctx.db.meter.findMany({
        include: {
          meterReadings: {
            ...(input?.meterReadingsFrom && input?.meterReadingsTo
              ? {
                  where: {
                    readingDate: {
                      gte: new Date(
                        `${input.meterReadingsFrom.toISOString().slice(0, 10)}T00:00:00.000Z`,
                      ),
                      lt: new Date(
                        `${input.meterReadingsTo.toISOString().slice(0, 10)}T23:59:59.999Z`,
                      ),
                    },
                  },
                }
              : {}),

            orderBy: { readingDate: "desc" },
            take: 1,
          },
          building: true,
          component: true,
          customer: true,
          parentMeter: true,
        },
        orderBy: { id: "asc" },
      });

      return meterReading ?? null;
    }),

  addNewMeterReading: publicProcedure
    .input(
      z.object({
        meterId: z.number(),
        meterValue: z.number(),
        readingDate: z.date(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.meterReading.create({
        data: {
          readingDate: input.readingDate,
          value: input.meterValue,
          meterId: input.meterId,
        },
      });
    }),
});
