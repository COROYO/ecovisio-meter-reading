import { HydrateClient } from "~/trpc/server";
import { MeterReadings } from "../_components/MeterReadings";

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
      <main className="">
        <MeterReadings buildingId={buildingId} customerId={customerId} />
      </main>
    </HydrateClient>
  );
}
