"use client";

import {
  Button,
  Card,
  Datepicker,
  Label,
  Modal,
  Select,
  Spinner,
  Table,
  TextInput,
} from "flowbite-react";
import { useRef, useState } from "react";
import { api } from "../../trpc/react";
import { BuildingRow } from "./BuildingRow";
import { CustomerRow } from "./CustomerRow";
import { PurchaseRow } from "./PurchaseRow";

export function Dashboard() {
  const { data: buildingsData, isLoading } = api.building.getAll.useQuery();
  const { data: customerData, isLoading: isLoadingCustomerData } =
    api.customer.getAll.useQuery();
  const {
    data: purchaseData,
    isLoading: isLoadingPurchaseData,
    refetch,
  } = api.purchase.getAll.useQuery();
  const [newBuildingId, setNewBuildingId] = useState<number | undefined>();
  const [openModal, setOpenModal] = useState(false);
  const invoiceNumberRef = useRef<HTMLInputElement>(null);
  const {
    mutateAsync: mutateAsyncAddPurchase,
    isPending: isPendingAddPurchase,
  } = api.purchase.addPurchase.useMutation();
  const [newInvoiceNr, setNewInvoiceNr] = useState<number | undefined>();
  const [newKwh, setNewKwh] = useState<number | undefined>();
  const [newPurchaseDate, setNewPurchseData] = useState<null | Date>(
    new Date(),
  );

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
      <Card>
        <div className="flex flex-row items-center justify-between">
          <h2>Einkäufe</h2>
          <Button onClick={() => setOpenModal(true)}>+</Button>
        </div>
        {isLoadingPurchaseData ? (
          <Spinner />
        ) : (
          <Table>
            <Table.Head>
              <Table.HeadCell>Rechnungsnr</Table.HeadCell>
              <Table.HeadCell>Einkaufsdatum</Table.HeadCell>
              <Table.HeadCell>kwh</Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y">
              {purchaseData?.map((purchase) => (
                <PurchaseRow
                  key={purchase.id}
                  date={purchase.date}
                  invoiceNr={purchase.invoiceNumber}
                  kwh={purchase.kwh}
                />
              ))}
            </Table.Body>
          </Table>
        )}
        <Modal
          show={openModal}
          size="md"
          popup
          onClose={() => setOpenModal(false)}
          initialFocus={invoiceNumberRef}
        >
          <Modal.Header />
          <Modal.Body>
            {isLoading && <Spinner />}
            {buildingsData && customerData && (
              <div className="space-y-6">
                <div>
                  <div className="mb-2 block">
                    <Label htmlFor="invoiceNr" value="invoice number" />
                  </div>
                  <TextInput
                    value={newInvoiceNr}
                    onChange={(e) => setNewInvoiceNr(Number(e.target.value))}
                    id="invoiceNr"
                    type="number"
                    ref={invoiceNumberRef}
                    required
                  />
                </div>
                <div>
                  <div className="mb-2 block">
                    <Label htmlFor="kwh" value="KW/H" />
                  </div>
                  <TextInput
                    value={newKwh}
                    onChange={(e) => setNewKwh(Number(e.target.value))}
                    id="kwh"
                    type="number"
                    required
                  />
                </div>
                <div>
                  <Datepicker
                    value={newPurchaseDate}
                    onChange={(newDate) => setNewPurchseData(newDate)}
                  />
                </div>
                <div className="max-w-md">
                  <div className="mb-2 block">
                    <Label htmlFor="buildings">Select building</Label>
                  </div>
                  <Select
                    id="buildings"
                    onChange={(e) => setNewBuildingId(Number(e.target.value))}
                  >
                    {buildingsData.map((building) => (
                      <option key={building.id} value={building.id}>
                        {building.name}
                      </option>
                    ))}
                  </Select>
                </div>

                <div className="w-full">
                  <Button
                    disabled={isPendingAddPurchase}
                    onClick={async () => {
                      await mutateAsyncAddPurchase({
                        date: newPurchaseDate ?? new Date(),
                        buildingId: newBuildingId ?? 1,
                        invoiceNr: newInvoiceNr ?? 1,
                        kwh: newKwh ?? 1,
                      });
                      await refetch();
                      setOpenModal(false);
                    }}
                  >
                    Add Purchase
                  </Button>
                  {isPendingAddPurchase && <Spinner />}
                </div>
              </div>
            )}
          </Modal.Body>
        </Modal>
      </Card>
    </div>
  );
}
