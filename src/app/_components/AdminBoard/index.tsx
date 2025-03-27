"use client";

import { TabItem, Tabs } from "flowbite-react";
import { Buildings } from "./Buildings";
import { Customers } from "./Customers";
import { Meters } from "./Meters";

export function AdminBoard() {
  return (
    <div className="">
      <h1 className="text-xl font-medium text-red-500">
        ADMINBOARD not secured remove only if secured
      </h1>
      <Tabs aria-label="tabs" variant="default">
        <TabItem active title="Customers">
          <Customers />
        </TabItem>
        <TabItem title="Buildings">
          <Buildings />
        </TabItem>
        <TabItem title="Meters">
          <Meters />
        </TabItem>
      </Tabs>
    </div>
  );
}
