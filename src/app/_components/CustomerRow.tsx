"use client";

import { Spinner, Table } from "flowbite-react";
import { useRouter } from "next/navigation";
import { api } from "../../trpc/react";

type BuildingRowProps = {
  customerName: string;
  customerId: number;
};

export function CustomerRow({ customerId, customerName }: BuildingRowProps) {
  const router = useRouter();
  const { data, isLoading } = api.meter.getLatestCustomerConsumption.useQuery({
    customerId: Number(customerId),
  });
  return (
    <Table.Row
      key={customerId}
      className={`cursor-pointer hover:bg-gray-100 ${data === 0 ? "bg-red-100" : ""}`}
      onClick={() => router.push(`/meter-readings?customerId=${customerId}`)}
    >
      <Table.Cell>{customerName}</Table.Cell>
      <Table.Cell className="text-end">
        {!isLoading ? data : <Spinner />}
      </Table.Cell>
    </Table.Row>
  );
}
