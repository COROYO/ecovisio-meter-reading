import { HydrateClient } from "~/trpc/server";
import { MeterReadings } from "../_components/LatestMeterReading";

type MeterReadingsPageProps = {
  searchParams: {
    buildingId: string;
    customerId: string;
  };
};

export default async function MeterReadingsPage({
  searchParams: { buildingId, customerId },
}: MeterReadingsPageProps) {
  return (
    <HydrateClient>
      <main className="flex min-h-screen flex-col items-center justify-center">
        <div className="container flex flex-col items-center justify-center">
          <MeterReadings buildingId={buildingId} customerId={customerId} />
        </div>
      </main>
    </HydrateClient>
  );
}
