import { Button, Card } from "flowbite-react";
import Link from "next/link";
import { HydrateClient } from "~/trpc/server";
import { Dashboard } from "./_components/Dashboard";

export default function Home() {
  return (
    <HydrateClient>
      <main className="flex min-h-screen flex-col items-center justify-center">
        <div className="container flex flex-col items-center justify-center gap-4">
          <Card>
            <Button href="/admin">
              Admin Zugang (ACHTUNG öffentlich, warnung erst entfernen wenn
              Admin bereich geschützt!)
            </Button>
            <Link href={"/meter-readings"}>
              <Button>meter readings list</Button>
            </Link>
          </Card>
          <Dashboard />
        </div>
      </main>
    </HydrateClient>
  );
}
