import Link from "next/link";

import { api, HydrateClient } from "~/trpc/server";
import { LatestMeterReading } from "./_components/latestMeterReading";

export default async function Home() {
  const hello = await api.meter.hello({ text: "from tRPC" });

  void api.meter.getLatest.prefetch();

  return (
    <HydrateClient>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
          <LatestMeterReading />
        </div>
      </main>
    </HydrateClient>
  );
}
