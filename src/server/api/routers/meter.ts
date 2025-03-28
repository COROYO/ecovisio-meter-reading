import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { readingIsInCurrentMonthAndYear } from "../../../lib/utils";

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
          customerId: z.optional(z.number()),
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
            take: 2,
          },
          building: true,
          component: true,
          customer: true,
          parentMeter: true,
        },
        where: {
          ...(input?.buildingId ? { buildingId: input.buildingId } : {}),
          ...(input?.customerId ? { customerId: input.customerId } : {}),
        },
        orderBy: { id: "asc" },
      });

      return meterReading ?? null;
    }),

  addNewMeter: publicProcedure
    .input(
      z.object({
        identifier: z.string(),
        buildingId: z.number(),
        customerId: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.meter.create({
        data: {
          buildingId: input.buildingId,
          customerId: input.customerId,
          identifier: input.identifier,
        },
      });
    }),

  deleteMeter: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.meter.delete({
        where: {
          id: input.id,
        },
      });
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
            take: 3, // Take the 3 latest readings
          },
        },
        where: {
          buildingId: input.buildingId,
        },
      });

      if (buildingMeters.length === 0)
        return { latestConsumption: 0, previousConsumption: 0 };

      const buildingMetersHaveCurrentMonthAndYearReading = buildingMeters.every(
        (meter) =>
          meter.meterReadings.some((reading) => {
            return readingIsInCurrentMonthAndYear(reading);
          }),
      );

      if (!buildingMetersHaveCurrentMonthAndYearReading)
        return { latestConsumption: 0, previousConsumption: 0 };

      const result = buildingMeters.reduce(
        (acc, meter) => {
          const [latestReading, previousReading, thirdReading] =
            meter.meterReadings;

          if (previousReading?.value && latestReading?.value) {
            acc.latestConsumption +=
              latestReading.value - previousReading.value;
          }

          if (thirdReading?.value && previousReading?.value) {
            acc.previousConsumption +=
              previousReading.value - thirdReading.value;
          }

          return acc;
        },
        { latestConsumption: 0, previousConsumption: 0 },
      );

      return result;
    }),

  getLatestCustomerConsumption: publicProcedure
    .input(z.object({ customerId: z.number() }))
    .query(async ({ ctx, input }) => {
      const customerMeters = await ctx.db.meter.findMany({
        include: {
          meterReadings: {
            orderBy: { readingDate: "desc" }, // Order by latest reading date
            take: 2, // Take only the 2 latest readings
          },
        },
        where: {
          customerId: input.customerId,
        },
      });

      if (customerMeters.length === 0) return 0;

      const customerMetersHaveCurrentMonthAndYearReading = customerMeters.every(
        (meter) =>
          meter.meterReadings.some((reading) => {
            return readingIsInCurrentMonthAndYear(reading);
          }),
      );

      if (!customerMetersHaveCurrentMonthAndYearReading) return 0;

      const customerConsumption = customerMeters.reduce((acc, meter) => {
        const latestReading = meter.meterReadings[0];
        const previousReading = meter.meterReadings[1];
        if (previousReading?.value && latestReading?.value) {
          acc += latestReading.value - previousReading.value;
        }
        return acc;
      }, 0);
      return customerConsumption;
    }),
});
