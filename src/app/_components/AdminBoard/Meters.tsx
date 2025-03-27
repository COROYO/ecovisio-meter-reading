"use client";

import {
  Button,
  Label,
  Modal,
  Select,
  Spinner,
  TextInput,
} from "flowbite-react";
import { useRef, useState } from "react";
import { api } from "../../../trpc/react";

export function Meters() {
  const {
    data: meterData,
    isFetching: isFetchingMeterData,
    refetch: refetchMeterData,
  } = api.meter.getAll.useQuery();
  const { data: customerData, isFetching: isFetchingCustomerData } =
    api.customer.getAll.useQuery();
  const { data: buildingData, isFetching: isFetchingBuildingData } =
    api.building.getAll.useQuery();

  const { mutateAsync: mutateAsyncAddMeter, isPending: isPendingAddMeter } =
    api.meter.addNewMeter.useMutation();
  const {
    mutateAsync: mutateAsyncDeleteMeter,
    isPending: isPendingDeleteMeter,
  } = api.meter.deleteMeter.useMutation();
  const [newMeterName, setNewMeterName] = useState("");
  const [newBuildingId, setNewBuildingId] = useState<number | undefined>();
  const [newCustomerId, setNewCustomerId] = useState<number | undefined>();
  const [openModal, setOpenModal] = useState(false);
  const meterInputRef = useRef<HTMLInputElement>(null);
  return (
    <div className="">
      {isFetchingMeterData && <Spinner />}
      {meterData?.map((meter) => (
        <div
          className="flex flex-row items-center justify-between border px-2 py-1"
          key={meter.id}
        >
          {meter.id}
          <Button
            disabled={isPendingDeleteMeter}
            onClick={async () => {
              await mutateAsyncDeleteMeter({ id: meter.id });
              await refetchMeterData();
            }}
          >
            {isPendingDeleteMeter ? <Spinner /> : "delete"}
          </Button>
        </div>
      ))}
      <div>
        <Button onClick={() => setOpenModal(() => true)}>add customer</Button>
      </div>
      <Modal
        show={openModal}
        size="md"
        popup
        onClose={() => setOpenModal(false)}
        initialFocus={meterInputRef}
      >
        <Modal.Header />
        <Modal.Body>
          {isFetchingBuildingData && isFetchingCustomerData && <Spinner />}
          {buildingData && customerData && (
            <div className="space-y-6">
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="customerName" value="meter name" />
                </div>
                <TextInput
                  value={newMeterName}
                  onChange={(e) => setNewMeterName(e.target.value)}
                  id="customerName"
                  ref={meterInputRef}
                  required
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
                  {buildingData.map((building) => (
                    <option key={building.id} value={building.id}>
                      {building.name}
                    </option>
                  ))}
                </Select>
              </div>
              <div className="max-w-md">
                <div className="mb-2 block">
                  <Label htmlFor="customers">Select customer</Label>
                </div>
                <Select
                  id="customers"
                  onChange={(e) => setNewCustomerId(Number(e.target.value))}
                >
                  {customerData.map((customer) => (
                    <option key={customer.id} value={customer.id}>
                      {customer.name}
                    </option>
                  ))}
                </Select>
              </div>

              <div className="w-full">
                <Button
                  disabled={isPendingAddMeter}
                  onClick={async () => {
                    await mutateAsyncAddMeter({
                      identifier: newMeterName,
                      buildingId: newBuildingId ?? 1,
                      customerId: newCustomerId ?? 1,
                    });
                    await refetchMeterData();
                    setNewMeterName("");
                    setNewBuildingId(undefined);
                    setNewCustomerId(undefined);
                    setOpenModal(false);
                  }}
                >
                  Add Meter
                </Button>
                {isPendingAddMeter && <Spinner />}
              </div>
            </div>
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
}
