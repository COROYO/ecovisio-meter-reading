"use client";

import { Table } from "flowbite-react";

type PurchaseRowProps = {
  invoiceNr: number;
  date: Date;
  kwh: number;
};

export function PurchaseRow({ date, invoiceNr, kwh }: PurchaseRowProps) {
  return (
    <Table.Row className={`cursor-pointer hover:bg-gray-100`}>
      <Table.Cell>{invoiceNr}</Table.Cell>
      <Table.Cell>{date.toLocaleDateString("de-DE")}</Table.Cell>
      <Table.Cell className="text-end">{kwh}</Table.Cell>
    </Table.Row>
  );
}
