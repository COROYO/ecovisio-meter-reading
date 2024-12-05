import { api, HydrateClient } from "~/trpc/server";
import { MeterReadings } from "./_components/LatestMeterReading";

export default async function Home() {
  void api.meter.getLatest.prefetch();

  return (
    <HydrateClient>
      <main className="flex min-h-screen flex-col items-center justify-center">
        <div className="container flex flex-col items-center justify-center">
          <MeterReadings />
        </div>
      </main>
    </HydrateClient>
  );
}
