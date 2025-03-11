"use client";

import { Card, ListGroup, Spinner } from "flowbite-react";
import { api } from "../../trpc/react";

export function Dashboard() {
  const { data: buildingsData, isLoading } = api.building.getAll.useQuery();
  return (
    <div>
      <Card>
        Buildings
        {isLoading ? (
          <Spinner />
        ) : (
          <ListGroup className="min-w-48">
            {buildingsData?.map((building) => (
              <ListGroup.Item
                key={building.id}
                href={`/meter-readings?buildingId=${building.id}`}
              >
                {building.name}
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}
      </Card>
    </div>
  );
}
