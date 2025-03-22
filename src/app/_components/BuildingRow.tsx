"use client";

import { Spinner, Table } from "flowbite-react";
import { useRouter } from "next/navigation";
import { api } from "../../trpc/react";

type BuildingRowProps = {
  buildingName: string;
  buildingId: number;
};

export function BuildingRow({ buildingId, buildingName }: BuildingRowProps) {
  const router = useRouter();
  const { data, isLoading } = api.meter.getLatestBuildingConsumption.useQuery({
    buildingId: Number(buildingId),
  });
  return (
    <Table.Row
      key={buildingId}
      className={`hover:bg-gray-100 ${data === 0 ? "bg-red-100" : ""}`}
      onClick={() => router.push(`/meter-readings?buildingId=${buildingId}`)}
    >
      <Table.Cell>{buildingName}</Table.Cell>
      <Table.Cell className="text-end">
        {!isLoading ? data : <Spinner />}
      </Table.Cell>
    </Table.Row>
  );
}
