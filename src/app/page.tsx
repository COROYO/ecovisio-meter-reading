import { HydrateClient } from "~/trpc/server";
import { MeterReadings } from "./_components/LatestMeterReading";

export default async function Home() {
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
