"use client";

import { Button, Label, Modal, Spinner, TextInput } from "flowbite-react";
import { useRef, useState } from "react";
import { api } from "../../../trpc/react";

export function Buildings() {
  const {
    data: buildingData,
    isFetching,
    refetch,
  } = api.building.getAll.useQuery();
  const {
    mutateAsync: mutateAsyncAddBuilding,
    isPending: isPendingAddBuilding,
  } = api.building.addBuilding.useMutation();
  const {
    mutateAsync: mutateAsyncDeleteBuilding,
    isPending: isPendingRemoveBuilding,
  } = api.building.deleteBuilding.useMutation();
  const [newBuildingName, setNewBuildingName] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const BuildingInputRef = useRef<HTMLInputElement>(null);
  return (
    <div className="">
      {isFetching && <Spinner />}
      {buildingData?.map((customer) => (
        <div
          className="flex flex-row items-center justify-between border px-2 py-1"
          key={customer.id}
        >
          {customer.name}
          <Button
            disabled={isPendingRemoveBuilding}
            onClick={async () => {
              await mutateAsyncDeleteBuilding({ id: customer.id });
              await refetch();
            }}
          >
            {isPendingRemoveBuilding ? <Spinner /> : "delete"}
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
        initialFocus={BuildingInputRef}
      >
        <Modal.Header />
        <Modal.Body>
          <div className="space-y-6">
            <div>
              <div className="mb-2 block">
                <Label htmlFor="customerName" value="customer name" />
              </div>
              <TextInput
                value={newBuildingName}
                onChange={(e) => setNewBuildingName(e.target.value)}
                id="customerName"
                ref={BuildingInputRef}
                required
              />
            </div>

            <div className="w-full">
              <Button
                disabled={isPendingAddBuilding}
                onClick={async () => {
                  await mutateAsyncAddBuilding({ name: newBuildingName });
                  await refetch();
                  setNewBuildingName("");
                  setOpenModal(false);
                }}
              >
                Add Building
              </Button>
              {isPendingAddBuilding && <Spinner />}
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}
