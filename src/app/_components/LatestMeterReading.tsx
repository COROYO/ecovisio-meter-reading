"use client";

import { api } from "~/trpc/react";
import { Spinner, Table } from "flowbite-react";

export function MeterReadings() {
  const { data, isLoading } = api.meter.getAll.useQuery();

  return (
    <div className="w-full">
      {isLoading ? (
        <Spinner />
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <Table.Head>
              <Table.HeadCell>Laufnummer</Table.HeadCell>
              <Table.HeadCell>Zählerpunkt</Table.HeadCell>
              <Table.HeadCell>Beschreibung</Table.HeadCell>
              <Table.HeadCell>Gebäude</Table.HeadCell>
              <Table.HeadCell>Bauteil</Table.HeadCell>
              <Table.HeadCell>Raum</Table.HeadCell>
              <Table.HeadCell>Zählernummer</Table.HeadCell>
              <Table.HeadCell>Kunde</Table.HeadCell>
              <Table.HeadCell>Bemerkung</Table.HeadCell>
              <Table.HeadCell>Zählerstand 30.09.2024</Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y">
              {data?.map((meter) => (
                <Table.Row key={meter.id}>
                  <Table.Cell>{meter.id}</Table.Cell>
                  <Table.Cell>{meter.meterPoint}</Table.Cell>
                  <Table.Cell>{meter.description}</Table.Cell>
                  <Table.Cell>{meter.building?.name}</Table.Cell>
                  <Table.Cell>{meter.component?.name}</Table.Cell>
                  <Table.Cell>{meter.room}</Table.Cell>
                  <Table.Cell>{meter.identifier}</Table.Cell>
                  <Table.Cell>{meter.customer?.name}</Table.Cell>
                  <Table.Cell>{meter.meterReadings[0]?.remarks}</Table.Cell>
                  <Table.Cell>{meter.meterReadings[0]?.value}</Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </div>
      )}
    </div>
  );
}
