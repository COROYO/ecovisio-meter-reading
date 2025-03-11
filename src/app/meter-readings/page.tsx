import { HydrateClient } from "~/trpc/server";
import { MeterReadings } from "../_components/LatestMeterReading";

type MeterReadingsPageProps = {
  searchParams: {
    buildingId: string;
  };
};

export default async function MeterReadingsPage({
  searchParams: { buildingId },
}: MeterReadingsPageProps) {
  return (
    <HydrateClient>
      <main className="flex min-h-screen flex-col items-center justify-center">
        <div className="container flex flex-col items-center justify-center">
          <MeterReadings buildingId={buildingId} />
        </div>
      </main>
    </HydrateClient>
  );
}
