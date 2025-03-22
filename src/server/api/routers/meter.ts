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
          buildingId: z.optional(z.number()),
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
        where: {
          ...(input?.buildingId ? { buildingId: input.buildingId } : {}),
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

  getLatestBuildingConsumption: publicProcedure
    .input(z.object({ buildingId: z.number() }))
    .query(async ({ ctx, input }) => {
      const buildingMeters = await ctx.db.meter.findMany({
        include: {
          meterReadings: {
            orderBy: { readingDate: "desc" },
            take: 2,
          },
        },
        where: {
          buildingId: input.buildingId,
        },
      });

      if (buildingMeters.length === 0) return 0;

      const buildingMetersWithoutCurrentMonthReading = buildingMeters.filter(
        (meter) => {
          const filteredReadings = meter.meterReadings.filter((reading) => {
            return (
              reading.readingDate.getMonth() !== new Date().getMonth() ||
              reading.readingDate.getFullYear() !== new Date().getFullYear()
            );
          });
          return filteredReadings.length > 0;
        },
      );

      if (buildingMetersWithoutCurrentMonthReading.length > 0) return 0;

      const buildingConsumption = buildingMeters.reduce((acc, meter) => {
        const latestReading = meter.meterReadings[0];
        const previousReading = meter.meterReadings[1];
        if (previousReading?.value && latestReading?.value) {
          acc += latestReading.value - previousReading.value;
        }
        return acc;
      }, 0);
      return buildingConsumption;
    }),
});
