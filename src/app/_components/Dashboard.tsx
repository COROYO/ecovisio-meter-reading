"use client";

import { Card, Spinner, Table } from "flowbite-react";
import { api } from "../../trpc/react";
import { BuildingRow } from "./BuildingRow";
import { CustomerRow } from "./CustomerRow";

export function Dashboard() {
  const { data: buildingsData, isLoading } = api.building.getAll.useQuery();
  const { data: customerData, isLoading: isLoadingCustomerData } =
    api.customer.getAll.useQuery();
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
              <Table.HeadCell>Verbrauch davor</Table.HeadCell>
              <Table.HeadCell>aktuellster Verbrauch</Table.HeadCell>
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
      <Card>
        Kunden
        {isLoadingCustomerData ? (
          <Spinner />
        ) : (
          <Table>
            <Table.Head>
              <Table.HeadCell>Kunden</Table.HeadCell>
              <Table.HeadCell>Verbrauch</Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y">
              {customerData?.map((customer) => (
                <CustomerRow
                  key={customer.id}
                  customerId={customer.id}
                  customerName={customer.name}
                />
              ))}
            </Table.Body>
          </Table>
        )}
      </Card>
    </div>
  );
}
