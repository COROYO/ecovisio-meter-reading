"use client";

import { Card, Spinner, Table } from "flowbite-react";
import { api } from "../../trpc/react";
import { BuildingRow } from "./BuildingRow";

export function Dashboard() {
  const { data: buildingsData, isLoading } = api.building.getAll.useQuery();
  return (
    <div>
      <Card>
        Gebäude
        {isLoading ? (
          <Spinner />
        ) : (
          <Table>
            <Table.Head>
              <Table.HeadCell>Gebäude</Table.HeadCell>
              <Table.HeadCell>Verbrauch</Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y">
              {buildingsData?.map((building) => (
                <BuildingRow
                  key={building.id}
                  buildingId={building.id}
                  buildingName={building.name}
                />
              ))}
            </Table.Body>
          </Table>
        )}
      </Card>
    </div>
  );
}
